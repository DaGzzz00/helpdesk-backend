// index.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createClient } from "@supabase/supabase-js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Supabase client (use environment variables in Render!)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Test route
app.get("/", (req, res) => {
  res.send("✅ Helpdesk backend is running!");
});

// Example request route
app.post("/requests", async (req, res) => {
  try {
    const { type, name, email, issue } = req.body;

    const { data, error } = await supabase
      .from("requests")
      .insert([{ type, name, email, issue }]);

    if (error) throw error;

    res.status(201).json({ message: "Request submitted", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
