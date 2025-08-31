<<<<<<< HEAD
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";

const app = express();
app.use(cors()); // allow frontend (Netlify) to call backend
app.use(bodyParser.json());

// Supabase connection
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Resend API config
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_URL = "https://api.resend.com/emails";

// Health check
app.get("/", (req, res) => res.send("Helpdesk API running ✅"));

// Submit request (from frontend form)
app.post("/requests", async (req, res) => {
  const { type, name, address, contact_no, email, department, requested_by, delivered_by, issue, attachment_path } = req.body;

  const { data, error } = await supabase
    .from("requests")
    .insert([{ type, name, address, contact_no, email, department, requested_by, delivered_by, issue, attachment_path }])
    .select();

  if (error) return res.status(400).json({ error });
  res.json({ success: true, request: data[0] });
});

// Get all requests (for admin dashboard)
app.get("/requests", async (req, res) => {
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error });
  res.json(data);
});

// Update request status + notify via Resend
app.patch("/requests/:id", async (req, res) => {
  const { id } = req.params;
  const { status, assigned_staff, email } = req.body;

  const { data, error } = await supabase
    .from("requests")
    .update({ status, assigned_staff })
    .eq("id", id)
    .select();

  if (error) return res.status(400).json({ error });

  // Send email notification
  if (email && RESEND_API_KEY) {
    await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Helpdesk <noreply@yourdomain.com>",
        to: email,
        subject: `Your Helpdesk Request has been ${status}`,
        html: `<p>Hello,</p><p>Your request for <b>${data[0].issue}</b> has been <b>${status}</b>.</p><p>Assigned staff: ${assigned_staff || "Not yet assigned"}</p>`,
      }),
    });
  }

  res.json({ success: true, updated: data[0] });
});

// Run server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API running on port ${PORT}`));
=======
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";

const app = express();
app.use(cors()); // allow frontend (Netlify) to call backend
app.use(bodyParser.json());

// Supabase connection
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Resend API config
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_URL = "https://api.resend.com/emails";

// Health check
app.get("/", (req, res) => res.send("Helpdesk API running ✅"));

// Submit request (from frontend form)
app.post("/requests", async (req, res) => {
  const { type, name, address, contact_no, email, department, requested_by, delivered_by, issue, attachment_path } = req.body;

  const { data, error } = await supabase
    .from("requests")
    .insert([{ type, name, address, contact_no, email, department, requested_by, delivered_by, issue, attachment_path }])
    .select();

  if (error) return res.status(400).json({ error });
  res.json({ success: true, request: data[0] });
});

// Get all requests (for admin dashboard)
app.get("/requests", async (req, res) => {
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error });
  res.json(data);
});

// Update request status + notify via Resend
app.patch("/requests/:id", async (req, res) => {
  const { id } = req.params;
  const { status, assigned_staff, email } = req.body;

  const { data, error } = await supabase
    .from("requests")
    .update({ status, assigned_staff })
    .eq("id", id)
    .select();

  if (error) return res.status(400).json({ error });

  // Send email notification
  if (email && RESEND_API_KEY) {
    await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Helpdesk <noreply@yourdomain.com>",
        to: email,
        subject: `Your Helpdesk Request has been ${status}`,
        html: `<p>Hello,</p><p>Your request for <b>${data[0].issue}</b> has been <b>${status}</b>.</p><p>Assigned staff: ${assigned_staff || "Not yet assigned"}</p>`,
      }),
    });
  }

  res.json({ success: true, updated: data[0] });
});

// Run server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API running on port ${PORT}`));
>>>>>>> f08ffcfcebacadb5e0920da6676289c6456621b1
