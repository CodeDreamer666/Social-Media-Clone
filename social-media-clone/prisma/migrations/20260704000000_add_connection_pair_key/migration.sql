-- Add canonical pair keys so A -> B and B -> A are treated as one relationship.
ALTER TABLE "Connection" ADD COLUMN "pairKey" TEXT;

UPDATE "Connection"
SET "pairKey" = CASE
    WHEN "requestUserId" < "responseUserId"
        THEN "requestUserId" || ':' || "responseUserId"
    ELSE "responseUserId" || ':' || "requestUserId"
END;

DELETE FROM "Connection"
WHERE "requestUserId" = "responseUserId";

WITH ranked_connections AS (
    SELECT
        "id",
        ROW_NUMBER() OVER (
            PARTITION BY "pairKey"
            ORDER BY
                CASE WHEN "status" = 'ACCEPTED' THEN 0 ELSE 1 END,
                "createdAt" ASC,
                "id" ASC
        ) AS "rank"
    FROM "Connection"
)
DELETE FROM "Connection"
WHERE "id" IN (
    SELECT "id"
    FROM ranked_connections
    WHERE "rank" > 1
);

ALTER TABLE "Connection" ALTER COLUMN "pairKey" SET NOT NULL;

CREATE UNIQUE INDEX "Connection_pairKey_key" ON "Connection"("pairKey");
