const express = require("express");
const twilio = require("twilio");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const VoiceResponse = twilio.twiml.VoiceResponse;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET;
const outgoingAppSid = process.env.TWIML_APP_SID;

// Optional root route
app.get("/token", (req, res) => {
  const identity = "user";

  const token = new AccessToken(
    twilioAccountSid,
    twilioApiKey,
    twilioApiSecret,
    { identity }
  );

  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: twilioAppSid,
    incomingAllow: true
  });

  token.addGrant(voiceGrant);

  res.json({ token: token.toJwt() });
});


  const token = new AccessToken(accountSid, apiKey, apiSecret);
  token.addGrant(voiceGrant);
  token.identity = identity;

  res.send({
    identity: identity,
    token: token.toJwt(),
  });
});

// Voice route
app.post("/voice", (req, res) => {
  const twiml = new VoiceResponse();
  const dial = twiml.dial();
  dial.number(req.body.To); // This should come from the client
  res.type("text/xml");
  res.send(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
