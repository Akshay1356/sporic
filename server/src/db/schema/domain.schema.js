// Domain tables ported from the previous Prisma schema, now expressed with Drizzle ORM.
import { pgTable, text, integer, real, boolean, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { user } from './auth.schema.js';

const uuidId = () =>
  text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID());

// ----------------------------------------------------
// Categories & Courses
// ----------------------------------------------------
export const category = pgTable('category', {
  id: uuidId(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  domain: text('domain').notNull(), // Technology, Management, Leadership & Personality
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const course = pgTable('course', {
  id: uuidId(),
  courseCode: text('course_code').notNull().unique(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  categoryId: text('category_id')
    .notNull()
    .references(() => category.id, { onDelete: 'cascade' }),
  shortDescription: text('short_description').notNull(),
  fullDescription: text('full_description'),
  durationHours: integer('duration_hours').notNull().default(20),
  trainingMode: text('training_mode').notNull().default('ONLINE'), // ONLINE, OFFLINE, BLENDED
  price: real('price').notNull().default(4999.0),
  discountPercent: real('discount_percent').notNull().default(0.0),
  finalPrice: real('final_price').notNull().default(4999.0),
  contactEmail: text('contact_email').notNull().default('deancc.sporic@vit.ac.in'),
  contactPerson: text('contact_person').notNull().default('Dean, SpoRIC'),
  contactNumber: text('contact_number').notNull().default('73587 82571'),
  thumbnail: text('thumbnail'),
  banner: text('banner'),
  status: text('status').notNull().default('PUBLISHED'), // DRAFT, PUBLISHED, ARCHIVED
  certificateEnabled: boolean('certificate_enabled').notNull().default(true),
  facultyId: text('faculty_id').references(() => user.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  publishedAt: timestamp('published_at'),
});

export const learningObjective = pgTable('learning_objective', {
  id: uuidId(),
  courseId: text('course_id')
    .notNull()
    .references(() => course.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  type: text('type').notNull().default('LEARN'), // LEARN, FEATURE
  order: integer('order').notNull().default(0),
});

export const sessionBatch = pgTable('session_batch', {
  id: uuidId(),
  courseId: text('course_id')
    .notNull()
    .references(() => course.id, { onDelete: 'cascade' }),
  batchNumber: integer('batch_number').notNull().default(1),
  startDate: text('start_date').notNull(), // format: DD-MM-YYYY
  endDate: text('end_date'),
  status: text('status').notNull().default('UPCOMING'), // UPCOMING, ONGOING, COMPLETED
});

export const module = pgTable('module', {
  id: uuidId(),
  courseId: text('course_id')
    .notNull()
    .references(() => course.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  order: integer('order').notNull().default(1),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const lesson = pgTable('lesson', {
  id: uuidId(),
  moduleId: text('module_id')
    .notNull()
    .references(() => module.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  order: integer('order').notNull().default(1),
  contentType: text('content_type').notNull().default('TEXT'), // VIDEO, DOCUMENT, TEXT, LAB
  contentUrl: text('content_url'),
  textContent: text('text_content'),
  durationMinutes: integer('duration_minutes').notNull().default(30),
  isFreePreview: boolean('is_free_preview').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ----------------------------------------------------
// Enrollments, Progress & Payments
// ----------------------------------------------------
export const payment = pgTable('payment', {
  id: uuidId(),
  studentId: text('student_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  courseId: text('course_id')
    .notNull()
    .references(() => course.id, { onDelete: 'cascade' }),
  razorpayOrderId: text('razorpay_order_id').notNull().unique(),
  razorpayPaymentId: text('razorpay_payment_id').unique(),
  razorpaySignature: text('razorpay_signature'),
  amount: real('amount').notNull(),
  currency: text('currency').notNull().default('INR'),
  status: text('status').notNull().default('PENDING'), // PENDING, SUCCESS, FAILED, REFUNDED
  receiptNumber: text('receipt_number').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const enrollment = pgTable(
  'enrollment',
  {
    id: uuidId(),
    studentId: text('student_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    courseId: text('course_id')
      .notNull()
      .references(() => course.id, { onDelete: 'cascade' }),
    batchId: text('batch_id').references(() => sessionBatch.id, { onDelete: 'set null' }),
    paymentId: text('payment_id').references(() => payment.id, { onDelete: 'set null' }),
    status: text('status').notNull().default('ACTIVE'), // ACTIVE, COMPLETED, CANCELLED
    progressPercent: real('progress_percent').notNull().default(0.0),
    completedLessons: text('completed_lessons').notNull().default('[]'), // JSON string of lesson IDs
    enrolledAt: timestamp('enrolled_at').notNull().defaultNow(),
    completedAt: timestamp('completed_at'),
  },
  (table) => ({
    studentCourseUnique: uniqueIndex('enrollment_student_course_unique').on(table.studentId, table.courseId),
  })
);

// ----------------------------------------------------
// Faculty Funding Opportunities & Applications
// ----------------------------------------------------
export const fundingOpportunity = pgTable('funding_opportunity', {
  id: uuidId(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  eligibility: text('eligibility').notNull(),
  guidelines: text('guidelines').notNull(),
  deadline: timestamp('deadline').notNull(),
  fundingAmount: real('funding_amount').notNull(),
  status: text('status').notNull().default('OPEN'), // OPEN, CLOSED, ARCHIVED
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const fundingApplication = pgTable('funding_application', {
  id: uuidId(),
  applicationNumber: text('application_number').notNull().unique(),
  facultyId: text('faculty_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  fundingOpportunityId: text('funding_opportunity_id')
    .notNull()
    .references(() => fundingOpportunity.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  researchArea: text('research_area').notNull(),
  problemStatement: text('problem_statement').notNull(),
  objectives: text('objectives').notNull(),
  methodology: text('methodology').notNull(),
  expectedOutcomes: text('expected_outcomes').notNull(),
  durationMonths: integer('duration_months').notNull().default(12),
  budget: real('budget').notNull(),
  equipmentRequirements: text('equipment_requirements'),
  teamMembers: text('team_members'),
  previousResearch: text('previous_research'),
  patentInformation: text('patent_information'),
  documentsUrl: text('documents_url'),
  declarationAccepted: boolean('declaration_accepted').notNull().default(true),
  status: text('status').notNull().default('DRAFT'), // DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED
  reviewerComments: text('reviewer_comments'),
  submittedAt: timestamp('submitted_at'),
  reviewedAt: timestamp('reviewed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ----------------------------------------------------
// Research Projects, Patents & Publications
// ----------------------------------------------------
export const researchProject = pgTable('research_project', {
  id: uuidId(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  researchArea: text('research_area').notNull(),
  principalInvestigatorId: text('principal_investigator_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  fundingSource: text('funding_source').notNull().default('SpoRIC Industry Partner'),
  budget: real('budget'),
  objectives: text('objectives'),
  methodology: text('methodology'),
  outcomes: text('outcomes'),
  status: text('status').notNull().default('ONGOING'), // ONGOING, COMPLETED
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const patent = pgTable('patent', {
  id: uuidId(),
  title: text('title').notNull(),
  patentNumber: text('patent_number').unique(),
  applicationNumber: text('application_number').notNull().unique(),
  filingDate: timestamp('filing_date').notNull(),
  grantDate: timestamp('grant_date'),
  status: text('status').notNull().default('PENDING'), // APPLIED, PENDING, GRANTED, EXPIRED
  inventors: text('inventors').notNull(),
  assignee: text('assignee').notNull().default('Vellore Institute of Technology'),
  abstract: text('abstract').notNull(),
  documentUrl: text('document_url'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const publication = pgTable('publication', {
  id: uuidId(),
  title: text('title').notNull(),
  authors: text('authors').notNull(),
  journalName: text('journal_name').notNull(),
  publicationDate: timestamp('publication_date').notNull(),
  doi: text('doi').unique(),
  abstract: text('abstract'),
  link: text('link'),
  projectId: text('project_id').references(() => researchProject.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ----------------------------------------------------
// Certificates & Verification
// ----------------------------------------------------
export const certificate = pgTable('certificate', {
  id: uuidId(),
  certificateNumber: text('certificate_number').notNull().unique(),
  studentId: text('student_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  courseId: text('course_id')
    .notNull()
    .references(() => course.id, { onDelete: 'cascade' }),
  studentName: text('student_name').notNull(),
  courseName: text('course_name').notNull(),
  issueDate: timestamp('issue_date').notNull().defaultNow(),
  verificationHash: text('verification_hash').notNull().unique(),
  certificateUrl: text('certificate_url'),
  status: text('status').notNull().default('VALID'), // VALID, REVOKED
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ----------------------------------------------------
// Notifications & Contact Inquiries
// ----------------------------------------------------
export const notification = pgTable('notification', {
  id: uuidId(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull().default('SYSTEM'), // ENROLLMENT, PAYMENT, FUNDING, SYSTEM, ANNOUNCEMENT
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const contactInquiry = pgTable('contact_inquiry', {
  id: uuidId(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('NEW'), // NEW, IN_PROGRESS, RESOLVED
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ----------------------------------------------------
// Corporate Training Gallery Photos
// ----------------------------------------------------
export const galleryPhoto = pgTable('gallery_photo', {
  id: uuidId(),
  src: text('src').notNull(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ----------------------------------------------------
// Relations (mirrors the Prisma relations for the query API)
// ----------------------------------------------------
export const categoryRelations = relations(category, ({ many }) => ({
  courses: many(course),
}));

export const courseRelations = relations(course, ({ one, many }) => ({
  category: one(category, { fields: [course.categoryId], references: [category.id] }),
  instructor: one(user, { fields: [course.facultyId], references: [user.id] }),
  objectives: many(learningObjective),
  sessions: many(sessionBatch),
  modules: many(module),
  enrollments: many(enrollment),
  payments: many(payment),
  certificates: many(certificate),
}));

export const learningObjectiveRelations = relations(learningObjective, ({ one }) => ({
  course: one(course, { fields: [learningObjective.courseId], references: [course.id] }),
}));

export const sessionBatchRelations = relations(sessionBatch, ({ one, many }) => ({
  course: one(course, { fields: [sessionBatch.courseId], references: [course.id] }),
  enrollments: many(enrollment),
}));

export const moduleRelations = relations(module, ({ one, many }) => ({
  course: one(course, { fields: [module.courseId], references: [course.id] }),
  lessons: many(lesson),
}));

export const lessonRelations = relations(lesson, ({ one }) => ({
  module: one(module, { fields: [lesson.moduleId], references: [module.id] }),
}));

export const paymentRelations = relations(payment, ({ one, many }) => ({
  student: one(user, { fields: [payment.studentId], references: [user.id] }),
  course: one(course, { fields: [payment.courseId], references: [course.id] }),
  enrollments: many(enrollment),
}));

export const enrollmentRelations = relations(enrollment, ({ one }) => ({
  student: one(user, { fields: [enrollment.studentId], references: [user.id] }),
  course: one(course, { fields: [enrollment.courseId], references: [course.id] }),
  batch: one(sessionBatch, { fields: [enrollment.batchId], references: [sessionBatch.id] }),
  payment: one(payment, { fields: [enrollment.paymentId], references: [payment.id] }),
}));

export const fundingOpportunityRelations = relations(fundingOpportunity, ({ many }) => ({
  applications: many(fundingApplication),
}));

export const fundingApplicationRelations = relations(fundingApplication, ({ one }) => ({
  faculty: one(user, { fields: [fundingApplication.facultyId], references: [user.id] }),
  fundingOpportunity: one(fundingOpportunity, {
    fields: [fundingApplication.fundingOpportunityId],
    references: [fundingOpportunity.id],
  }),
}));

export const researchProjectRelations = relations(researchProject, ({ one, many }) => ({
  principalInvestigator: one(user, { fields: [researchProject.principalInvestigatorId], references: [user.id] }),
  publications: many(publication),
}));

export const publicationRelations = relations(publication, ({ one }) => ({
  project: one(researchProject, { fields: [publication.projectId], references: [researchProject.id] }),
}));

export const certificateRelations = relations(certificate, ({ one }) => ({
  student: one(user, { fields: [certificate.studentId], references: [user.id] }),
  course: one(course, { fields: [certificate.courseId], references: [course.id] }),
}));

export const notificationRelations = relations(notification, ({ one }) => ({
  user: one(user, { fields: [notification.userId], references: [user.id] }),
}));

export const userDomainRelations = relations(user, ({ many }) => ({
  enrollments: many(enrollment),
  payments: many(payment),
  certificates: many(certificate),
  notifications: many(notification),
  coursesInstructed: many(course),
  fundingApplications: many(fundingApplication),
  researchProjects: many(researchProject),
}));
