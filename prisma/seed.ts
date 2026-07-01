import "dotenv/config"
import { PrismaClient, LeadScoreValue, DealStatus, ActivityType, LeadSource, PipelineStage } from "../src/generated/prisma/client"
import { auth } from "../src/lib/auth"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Starting database seed...")

  const email = "demo@leadflow.ai"
  let user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    console.log("Creating demo user...")
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password: "Password123!",
        name: "Demo User",
      },
    })
    if (!result) {
      throw new Error("Failed to create demo user via Better Auth")
    }
    user = await prisma.user.findUnique({
      where: { email },
    })
  }

  if (!user) {
    throw new Error("Demo user could not be resolved")
  }

  const userId = user.id
  console.log(`Demo user resolved: ${user.name} (${userId})`)

  // Clean existing records scoped to this user
  console.log("Cleaning old CRM records...")
  await prisma.notification.deleteMany({ where: { userId } })
  await prisma.emailDraft.deleteMany({ where: { userId } })
  await prisma.leadScore.deleteMany({ where: { userId } })
  await prisma.meeting.deleteMany({ where: { userId } })
  await prisma.note.deleteMany({ where: { userId } })
  await prisma.activity.deleteMany({ where: { userId } })
  await prisma.task.deleteMany({ where: { userId } })
  await prisma.deal.deleteMany({ where: { userId } })
  await prisma.lead.deleteMany({ where: { userId } })
  await prisma.contact.deleteMany({ where: { userId } })
  await prisma.company.deleteMany({ where: { userId } })
  await prisma.pipeline.deleteMany({ where: { userId } })

  console.log("Seeding core pipeline...")
  const pipeline = await prisma.pipeline.create({
    data: {
      name: "Sales Pipeline",
      description: "Standard CRM deals workflow",
      userId,
    },
  })

  const stagesData = [
    { name: "New", position: 1 },
    { name: "Contacted", position: 2 },
    { name: "Qualified", position: 3 },
    { name: "Proposal Sent", position: 4 },
    { name: "Negotiation", position: 5 },
    { name: "Closed Won", position: 6 },
    { name: "Closed Lost", position: 7 },
  ]

  const stages: PipelineStage[] = []
  for (const s of stagesData) {
    const stage = await prisma.pipelineStage.create({
      data: {
        name: s.name,
        position: s.position,
        pipelineId: pipeline.id,
      },
    })
    stages.push(stage)
  }

  const getStage = (name: string) => {
    const s = stages.find((st) => st.name === name)
    if (!s) throw new Error(`Stage ${name} not found`)
    return s
  }

  console.log("Seeding companies...")
  const starkInd = await prisma.company.create({
    data: { name: "Stark Industries", industry: "Aerospace", website: "starkindustries.com", description: "Advanced power and tech systems", userId },
  })
  const wayneEnt = await prisma.company.create({
    data: { name: "Wayne Enterprises", industry: "Defense", website: "wayneenterprises.com", description: "Industrial and security solutions", userId },
  })
  const acmeCorp = await prisma.company.create({
    data: { name: "Acme Corp", industry: "Manufacturing", website: "acme.com", description: "Anvils, magnets, and gadgetry", userId },
  })
  const globex = await prisma.company.create({
    data: { name: "Globex Corp", industry: "Technology", website: "globex.com", description: "High-tech research and services", userId },
  })

  console.log("Seeding contacts...")
  const pepper = await prisma.contact.create({
    data: { firstName: "Pepper", lastName: "Potts", email: "pepper@starkindustries.com", phone: "555-0199", jobTitle: "COO", companyId: starkInd.id, userId },
  })
  const lucius = await prisma.contact.create({
    data: { firstName: "Lucius", lastName: "Fox", email: "lucius@wayne.com", phone: "555-0188", jobTitle: "CEO", companyId: wayneEnt.id, userId },
  })
  const coyote = await prisma.contact.create({
    data: { firstName: "Wile E.", lastName: "Coyote", email: "coyote@acme.com", phone: "555-0177", jobTitle: "Procurement Mgr", companyId: acmeCorp.id, userId },
  })
  const hank = await prisma.contact.create({
    data: { firstName: "Hank", lastName: "Scorpio", email: "hank@globex.com", phone: "555-0166", jobTitle: "President", companyId: globex.id, userId },
  })

  console.log("Seeding leads...")
  const lead1 = await prisma.lead.create({
    data: {
      name: "Stark Arc Reactor Deal",
      email: pepper.email,
      phone: pepper.phone,
      source: LeadSource.PARTNER,
      estimatedValue: 500000,
      score: LeadScoreValue.HOT,
      companyId: starkInd.id,
      contactId: pepper.id,
      stageId: getStage("Qualified").id,
      userId,
    },
  })

  const lead2 = await prisma.lead.create({
    data: {
      name: "Wayne Satellite System",
      email: lucius.email,
      phone: lucius.phone,
      source: LeadSource.REFERRAL,
      estimatedValue: 1200000,
      score: LeadScoreValue.HOT,
      companyId: wayneEnt.id,
      contactId: lucius.id,
      stageId: getStage("Proposal Sent").id,
      userId,
    },
  })

  const lead3 = await prisma.lead.create({
    data: {
      name: "Acme Anvil Supply",
      email: coyote.email,
      phone: coyote.phone,
      source: LeadSource.WEB,
      estimatedValue: 15000,
      score: LeadScoreValue.COLD,
      companyId: acmeCorp.id,
      contactId: coyote.id,
      stageId: getStage("New").id,
      userId,
    },
  })

  await prisma.lead.create({
    data: {
      name: "Globex Server Expansion",
      email: hank.email,
      phone: hank.phone,
      source: LeadSource.COLD_OUTREACH,
      estimatedValue: 250000,
      score: LeadScoreValue.WARM,
      companyId: globex.id,
      contactId: hank.id,
      stageId: getStage("Contacted").id,
      userId,
    },
  })

  console.log("Seeding deals...")
  await prisma.deal.create({
    data: {
      name: "Stark Arc Reactor Opportunity",
      value: 500000,
      probability: 70,
      status: DealStatus.OPEN,
      leadId: lead1.id,
      companyId: starkInd.id,
      contactId: pepper.id,
      stageId: getStage("Qualified").id,
      userId,
    },
  })

  await prisma.deal.create({
    data: {
      name: "Wayne Satellite Contract",
      value: 1200000,
      probability: 90,
      status: DealStatus.OPEN,
      leadId: lead2.id,
      companyId: wayneEnt.id,
      contactId: lucius.id,
      stageId: getStage("Proposal Sent").id,
      userId,
    },
  })

  console.log("Seeding tasks...")
  await prisma.task.create({
    data: { title: "Send revised proposal to Pepper Potts", dueDate: new Date(Date.now() + 86400000), isCompleted: false, leadId: lead1.id, userId },
  })
  await prisma.task.create({
    data: { title: "Call Lucius Fox regarding compliance questions", dueDate: new Date(Date.now() + 86400000 * 3), isCompleted: false, leadId: lead2.id, userId },
  })
  await prisma.task.create({
    data: { title: "Send initial anvil catalogs", dueDate: new Date(Date.now() - 86400000), isCompleted: true, leadId: lead3.id, userId },
  })

  console.log("Seeding notes...")
  await prisma.note.create({
    data: { content: "Pepper mentioned they need a fully secure power source by next quarter. Budget is flexible if delivery SLA is guaranteed.", leadId: lead1.id, userId },
  })
  await prisma.note.create({
    data: { content: "Lucius was very receptive to the custom payload configuration. We need to sync with their aerospace engineer next week.", leadId: lead2.id, userId },
  })

  console.log("Seeding meetings...")
  await prisma.meeting.create({
    data: {
      title: "Initial Stark Intro Call",
      description: "Discussed requirements for reactor configurations",
      startTime: new Date(Date.now() - 86400000 * 5),
      endTime: new Date(Date.now() - 86400000 * 5 + 3600000),
      leadId: lead1.id,
      contactId: pepper.id,
      userId,
    },
  })

  await prisma.meeting.create({
    data: {
      title: "Wayne Satellite System Tech Demo",
      description: "Overview of integration requirements",
      startTime: new Date(Date.now() + 86400000 * 2),
      endTime: new Date(Date.now() + 86400000 * 2 + 7200000),
      leadId: lead2.id,
      contactId: lucius.id,
      userId,
    },
  })

  console.log("Seeding activities...")
  const activitiesData = [
    { type: ActivityType.LEAD_CREATED, description: "Lead Stark Arc Reactor Deal was created.", leadId: lead1.id },
    { type: ActivityType.LEAD_CREATED, description: "Lead Wayne Satellite System was created.", leadId: lead2.id },
    { type: ActivityType.MEETING_SCHEDULED, description: "Scheduled Stark Intro Call meeting.", leadId: lead1.id },
    { type: ActivityType.NOTE_ADDED, description: "Added note about Pepper's delivery SLA requirements.", leadId: lead1.id },
    { type: ActivityType.TASK_CREATED, description: "Task: Send revised proposal to Pepper Potts created.", leadId: lead1.id },
  ]
  for (const act of activitiesData) {
    await prisma.activity.create({
      data: {
        type: act.type,
        description: act.description,
        leadId: act.leadId,
        userId,
      },
    })
  }

  console.log("Seeding notifications...")
  await prisma.notification.create({
    data: { title: "New Lead Assigned", message: "Stark Arc Reactor Deal has been assigned to you.", link: `/leads/${lead1.id}`, userId },
  })
  await prisma.notification.create({
    data: { title: "Upcoming Meeting", message: "Wayne Satellite System Tech Demo is scheduled in 2 days.", link: `/meetings`, userId },
  })

  console.log("🌱 Seed complete! Log in with: demo@leadflow.ai / Password123!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
