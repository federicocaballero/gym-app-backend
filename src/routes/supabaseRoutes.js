const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

router.get("/credentials", async (req, res) => {
    res.json({ supabase })
})