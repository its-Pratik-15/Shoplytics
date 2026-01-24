/*
  Warnings:

  - You are about to drop the column `price` on the `products` table. All the data in the column will be lost.
  - Added the required column `costPrice` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellingPrice` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- Add new columns with default values first
ALTER TABLE "products" ADD COLUMN "sellingPrice" DECIMAL(10,2);
ALTER TABLE "products" ADD COLUMN "costPrice" DECIMAL(10,2);

-- Copy existing price to sellingPrice and set costPrice as 80% of selling price
UPDATE "products" SET "sellingPrice" = "price", "costPrice" = "price" * 0.8;

-- Make columns NOT NULL
ALTER TABLE "products" ALTER COLUMN "sellingPrice" SET NOT NULL;
ALTER TABLE "products" ALTER COLUMN "costPrice" SET NOT NULL;

-- Drop the old price column
ALTER TABLE "products" DROP COLUMN "price";
