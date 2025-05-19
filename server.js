const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
app.use(cors());

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_API_KEY,
  TWILIO_API_SECRET,
  TWILIO_TWIML_APP_SID
} = process.env;

app.get('/token', (req, res) => {
  const identity = "powerapps-user";
  const token = new twilio.jwt.AccessToken(
    TWILIO_ACCOUNT_SID,
    TWILIO_API_KEY,
    TWILIO_API_SECRET,
    { identity }
  );
  const voiceGrant = new twilio.jwt.AccessToken.VoiceGrant({
    outgoingApplicationSid: TWILIO_TWIML_APP_SID,
    incomingAllow: true
  });

  token.addGrant(voiceGrant);
  res.send({ token: token.toJwt() });
});

app.listen(3000, () => {
  console.log("Token service running on http://localhost:3000/token");
});
