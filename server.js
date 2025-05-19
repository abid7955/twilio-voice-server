const express = require("express");
const twilio = require("twilio");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const VoiceResponse = twilio.twiml.VoiceResponse;
const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET;
const outgoingAppSid = process.env.TWILIO_TWIML_APP_SID;

app.get("/token", (req, res) => {
  const identity = "user";

  const token = new AccessToken(accountSid, apiKey, apiSecret, { identity });

  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: outgoingAppSid,
    incomingAllow: true,
  });

  token.addGrant(voiceGrant);

  res.json({ token: token.toJwt() });
});

app.post("/voice", (req, res) => {
  const toNumber = req.body.To;

  console.log("Incoming voice request", toNumber);

  const twiml = new VoiceResponse();
  const dial = twiml.dial({
    callerId: process.env.TWILIO_CALLER_ID || '+918810377366'
  });

  if (toNumber) {
    dial.number({}, toNumber);
  } else {
    twiml.say("Thanks for calling!");
  }

  res.type('text/xml');
  res.send(twiml.toString());
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
