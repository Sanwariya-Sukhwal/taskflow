const fs = require("fs");
const path = require("path");
const pool = require("./db");

const runDatabaseSetup = async () => {
  try {
    const schemaPath = path.join(
      __dirname,
      "../../database/schema.sql"
    );

    const seedPath = path.join(
      __dirname,
      "../../database/seed.sql"
    );

    const schemaSql = fs.readFileSync(schemaPath, "utf8");
    const seedSql = fs.readFileSync(seedPath, "utf8");

    console.log("Creating database tables...");
    await pool.query(schemaSql);

    console.log("Inserting seed data...");
    await pool.query(seedSql);

    console.log("Database setup completed successfully.");
  } catch (error) {
    console.error("Database setup failed:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

runDatabaseSetup();