const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const twilio = require("twilio");
require("dotenv").config();
const app = express();
const port = 3000;

// Twilio credentials
const client = twilio(process.env.accountSid, process.env.authToken);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,"../frontend"))); 

// Route to serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Route to handle form submission
app.post("/sendMessage", (req, res) => {
  const { "first-name": firstName, "last-name": lastName, email, message } = req.body;

  const smsContent = `New form submission from ${firstName} ${lastName}\nEmail: ${email}\nMessage: ${message}`;

  client.messages
    .create({
      body: smsContent,
      from: '+12512902567',     // Your Twilio trial number
      to: '+917058366859'       // 👈 Replace with your verified mobile number
    })
    .then(msg => {
      console.log("✅ SMS Sent! SID:", msg.sid);
      res.redirect("/?success=1");
    })
    .catch(err => {
      console.error("❌ Error sending SMS:", err.message);
      res.redirect("/?success=0");
    });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
