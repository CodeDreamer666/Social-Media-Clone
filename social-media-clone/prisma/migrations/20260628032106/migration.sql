-- CreateEnum
CREATE TYPE "Interests" AS ENUM ('Coding', 'Design', 'Psychology', 'Finance', 'Books', 'Study', 'Productivity', 'Life_thoughts', 'Business', 'Art', 'Technology', 'Self_improvement');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "interest" "Interests";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "interest" "Interests"[];
