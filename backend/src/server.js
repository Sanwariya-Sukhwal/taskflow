const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await pool.query("SELECT NOW()");

    console.log("PostgreSQL connected successfully");

    app.listen(PORT, () => {
      console.log(`TaskFlow server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      "PostgreSQL connection failed:",
      error.message
    );

    process.exit(1);
  }
};

startServer();