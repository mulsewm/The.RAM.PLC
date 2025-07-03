-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'OTHER');

-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('HIGH_SCHOOL', 'ASSOCIATE', 'BACHELORS', 'MASTERS', 'PHD', 'OTHER');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY', 'INTERNSHIP', 'FREELANCE', 'SELF_EMPLOYED', 'UNEMPLOYED', 'OTHER');

-- Step 1: Add new columns as nullable
ALTER TABLE "registrations" 
ADD COLUMN "address" TEXT,
ADD COLUMN "alternatePhoneNumber" TEXT,
ADD COLUMN "city" TEXT,
ADD COLUMN "country" TEXT,
ADD COLUMN "currentCompany" TEXT,
ADD COLUMN "currentEmploymentStatus" "EmploymentType",
ADD COLUMN "currentJobTitle" TEXT,
ADD COLUMN "fieldOfStudy" TEXT,
ADD COLUMN "gender" "Gender",
ADD COLUMN "graduationYear" INTEGER,
ADD COLUMN "institution" TEXT,
ADD COLUMN "languageProficiencies" JSONB,
ADD COLUMN "maritalStatus" "MaritalStatus",
ADD COLUMN "middleName" TEXT,
ADD COLUMN "notes" TEXT,
ADD COLUMN "postalCode" TEXT;

-- Step 2: Migrate existing data to new schema
-- First, convert the languages array to JSONB format
UPDATE "registrations" SET
  "address" = 'Not provided',
  "city" = 'Not provided',
  "country" = COALESCE("currentCountry", 'Not provided'),
  "currentEmploymentStatus" = 'OTHER',
  "fieldOfStudy" = 'Not specified',
  "gender" = 'PREFER_NOT_TO_SAY',
  "graduationYear" = EXTRACT(YEAR FROM NOW()),
  "institution" = 'Not specified',
  "languageProficiencies" = (
    SELECT COALESCE(
      (
        SELECT jsonb_agg(jsonb_build_object(
          'language', lang,
          'proficiency', 'INTERMEDIATE'::text
        ))
        FROM unnest("languages") AS lang
      )::jsonb,
      '[]'::jsonb
    )
  ),
  "maritalStatus" = 'SINGLE',
  "notes" = "statusNotes",
  "postalCode" = '00000';

-- Step 3: Convert educationLevel to new enum type
-- First create a temporary column to store the new enum values
ALTER TABLE "registrations" ADD COLUMN "temp_education_level" "EducationLevel";

-- Map old string values to new enum values
UPDATE "registrations" SET "temp_education_level" = 
  CASE 
    WHEN "educationLevel" ILIKE '%high%school%' THEN 'HIGH_SCHOOL'::"EducationLevel"
    WHEN "educationLevel" ILIKE '%associate%' THEN 'ASSOCIATE'::"EducationLevel"
    WHEN "educationLevel" ILIKE '%bachelor%' THEN 'BACHELORS'::"EducationLevel"
    WHEN "educationLevel" ILIKE '%master%' THEN 'MASTERS'::"EducationLevel"
    WHEN "educationLevel" ILIKE '%phd%' OR "educationLevel" ILIKE '%doctor%' THEN 'PHD'::"EducationLevel"
    ELSE 'OTHER'::"EducationLevel"
  END;

-- Step 4: Drop old column and rename the temporary column
-- First, drop the old column
ALTER TABLE "registrations" DROP COLUMN "educationLevel";

-- Then rename the temporary column
ALTER TABLE "registrations" RENAME COLUMN "temp_education_level" TO "educationLevel";

-- Step 5: Make all new columns required
ALTER TABLE "registrations" 
  ALTER COLUMN "address" SET NOT NULL,
  ALTER COLUMN "city" SET NOT NULL,
  ALTER COLUMN "country" SET NOT NULL,
  ALTER COLUMN "currentEmploymentStatus" SET NOT NULL,
  ALTER COLUMN "fieldOfStudy" SET NOT NULL,
  ALTER COLUMN "gender" SET NOT NULL,
  ALTER COLUMN "graduationYear" SET NOT NULL,
  ALTER COLUMN "institution" SET NOT NULL,
  ALTER COLUMN "languageProficiencies" SET NOT NULL,
  ALTER COLUMN "maritalStatus" SET NOT NULL,
  ALTER COLUMN "postalCode" SET NOT NULL,
  ALTER COLUMN "educationLevel" SET NOT NULL;

-- Step 6: Drop old columns after migration is complete
ALTER TABLE "registrations" 
  DROP COLUMN "currentCountry",
  DROP COLUMN "languages",
  DROP COLUMN "nationality",
  DROP COLUMN "statusNotes";
