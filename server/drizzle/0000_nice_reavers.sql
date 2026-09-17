CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text DEFAULT 'STUDENT' NOT NULL,
	"account_status" text DEFAULT 'ACTIVE' NOT NULL,
	"phone" text,
	"organization" text,
	"department" text,
	"designation" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "category" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"domain" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "category_name_unique" UNIQUE("name"),
	CONSTRAINT "category_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "certificate" (
	"id" text PRIMARY KEY NOT NULL,
	"certificate_number" text NOT NULL,
	"student_id" text NOT NULL,
	"course_id" text NOT NULL,
	"student_name" text NOT NULL,
	"course_name" text NOT NULL,
	"issue_date" timestamp DEFAULT now() NOT NULL,
	"verification_hash" text NOT NULL,
	"certificate_url" text,
	"status" text DEFAULT 'VALID' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "certificate_certificate_number_unique" UNIQUE("certificate_number"),
	CONSTRAINT "certificate_verification_hash_unique" UNIQUE("verification_hash")
);
--> statement-breakpoint
CREATE TABLE "contact_inquiry" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"status" text DEFAULT 'NEW' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course" (
	"id" text PRIMARY KEY NOT NULL,
	"course_code" text NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"category_id" text NOT NULL,
	"short_description" text NOT NULL,
	"full_description" text,
	"duration_hours" integer DEFAULT 20 NOT NULL,
	"training_mode" text DEFAULT 'ONLINE' NOT NULL,
	"price" real DEFAULT 4999 NOT NULL,
	"discount_percent" real DEFAULT 0 NOT NULL,
	"final_price" real DEFAULT 4999 NOT NULL,
	"contact_email" text DEFAULT 'deancc.sporic@vit.ac.in' NOT NULL,
	"contact_person" text DEFAULT 'Dean, SpoRIC' NOT NULL,
	"contact_number" text DEFAULT '73587 82571' NOT NULL,
	"thumbnail" text,
	"banner" text,
	"status" text DEFAULT 'PUBLISHED' NOT NULL,
	"certificate_enabled" boolean DEFAULT true NOT NULL,
	"faculty_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp,
	CONSTRAINT "course_course_code_unique" UNIQUE("course_code"),
	CONSTRAINT "course_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "enrollment" (
	"id" text PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"course_id" text NOT NULL,
	"batch_id" text,
	"payment_id" text,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"progress_percent" real DEFAULT 0 NOT NULL,
	"completed_lessons" text DEFAULT '[]' NOT NULL,
	"enrolled_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "funding_application" (
	"id" text PRIMARY KEY NOT NULL,
	"application_number" text NOT NULL,
	"faculty_id" text NOT NULL,
	"funding_opportunity_id" text NOT NULL,
	"title" text NOT NULL,
	"research_area" text NOT NULL,
	"problem_statement" text NOT NULL,
	"objectives" text NOT NULL,
	"methodology" text NOT NULL,
	"expected_outcomes" text NOT NULL,
	"duration_months" integer DEFAULT 12 NOT NULL,
	"budget" real NOT NULL,
	"equipment_requirements" text,
	"team_members" text,
	"previous_research" text,
	"patent_information" text,
	"documents_url" text,
	"declaration_accepted" boolean DEFAULT true NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"reviewer_comments" text,
	"submitted_at" timestamp,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "funding_application_application_number_unique" UNIQUE("application_number")
);
--> statement-breakpoint
CREATE TABLE "funding_opportunity" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"eligibility" text NOT NULL,
	"guidelines" text NOT NULL,
	"deadline" timestamp NOT NULL,
	"funding_amount" real NOT NULL,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery_photo" (
	"id" text PRIMARY KEY NOT NULL,
	"src" text NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "learning_objective" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text NOT NULL,
	"content" text NOT NULL,
	"type" text DEFAULT 'LEARN' NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson" (
	"id" text PRIMARY KEY NOT NULL,
	"module_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"order" integer DEFAULT 1 NOT NULL,
	"content_type" text DEFAULT 'TEXT' NOT NULL,
	"content_url" text,
	"text_content" text,
	"duration_minutes" integer DEFAULT 30 NOT NULL,
	"is_free_preview" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "module" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"order" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"type" text DEFAULT 'SYSTEM' NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patent" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"patent_number" text,
	"application_number" text NOT NULL,
	"filing_date" timestamp NOT NULL,
	"grant_date" timestamp,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"inventors" text NOT NULL,
	"assignee" text DEFAULT 'Vellore Institute of Technology' NOT NULL,
	"abstract" text NOT NULL,
	"document_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "patent_patent_number_unique" UNIQUE("patent_number"),
	CONSTRAINT "patent_application_number_unique" UNIQUE("application_number")
);
--> statement-breakpoint
CREATE TABLE "payment" (
	"id" text PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"course_id" text NOT NULL,
	"razorpay_order_id" text NOT NULL,
	"razorpay_payment_id" text,
	"razorpay_signature" text,
	"amount" real NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"receipt_number" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payment_razorpay_order_id_unique" UNIQUE("razorpay_order_id"),
	CONSTRAINT "payment_razorpay_payment_id_unique" UNIQUE("razorpay_payment_id"),
	CONSTRAINT "payment_receipt_number_unique" UNIQUE("receipt_number")
);
--> statement-breakpoint
CREATE TABLE "publication" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"authors" text NOT NULL,
	"journal_name" text NOT NULL,
	"publication_date" timestamp NOT NULL,
	"doi" text,
	"abstract" text,
	"link" text,
	"project_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "publication_doi_unique" UNIQUE("doi")
);
--> statement-breakpoint
CREATE TABLE "research_project" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"research_area" text NOT NULL,
	"principal_investigator_id" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"funding_source" text DEFAULT 'SpoRIC Industry Partner' NOT NULL,
	"budget" real,
	"objectives" text,
	"methodology" text,
	"outcomes" text,
	"status" text DEFAULT 'ONGOING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session_batch" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text NOT NULL,
	"batch_number" integer DEFAULT 1 NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text,
	"status" text DEFAULT 'UPCOMING' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificate" ADD CONSTRAINT "certificate_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificate" ADD CONSTRAINT "certificate_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course" ADD CONSTRAINT "course_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course" ADD CONSTRAINT "course_faculty_id_user_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_batch_id_session_batch_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."session_batch"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_payment_id_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "funding_application" ADD CONSTRAINT "funding_application_faculty_id_user_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "funding_application" ADD CONSTRAINT "funding_application_funding_opportunity_id_funding_opportunity_id_fk" FOREIGN KEY ("funding_opportunity_id") REFERENCES "public"."funding_opportunity"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_objective" ADD CONSTRAINT "learning_objective_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_module_id_module_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."module"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "module" ADD CONSTRAINT "module_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication" ADD CONSTRAINT "publication_project_id_research_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."research_project"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_project" ADD CONSTRAINT "research_project_principal_investigator_id_user_id_fk" FOREIGN KEY ("principal_investigator_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_batch" ADD CONSTRAINT "session_batch_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "enrollment_student_course_unique" ON "enrollment" USING btree ("student_id","course_id");