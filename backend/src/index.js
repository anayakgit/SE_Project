const express = require("express");
const cors = require("cors"); 
const pool = require("./db/db_config");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse form data
app.set("view engine", "ejs"); // Use EJS for templating
app.set("views", path.join(__dirname, "views")); // Set views folder
app.use(express.static("public")); // Serve static files

// Route to submit score
app.post("/top-scores/:game", async (req, res) => {
  const { game } = req.params;
  const { score } = req.body;

  if (!score) {
    return res.status(400).json({ error: "Score is required" });
  }

  try {
    await pool.query("INSERT INTO scores (game, score) VALUES ($1, $2)", [
      game,
      score,
    ]);
    res.json({ message: "Score submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

// Route to display top scores
app.get("/top-scores/:game", async (req, res) => {
  const { game } = req.params;

  try {
    const result = await pool.query(
      "SELECT score, created_at FROM scores WHERE game = $1 ORDER BY score DESC LIMIT 10",
      [game]
    );

    res.render("scores", { game, scores: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
