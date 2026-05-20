// Webhook TwiML — Twilio appelle cet endpoint pour les appels sortants
// URL à configurer dans la TwiML App Twilio : https://[projet].vercel.app/api/voice
const twilio = require('twilio');

module.exports = (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();

  // Twilio transmet le param `To` depuis device.connect({ params: { To: '...' } })
  const numeroCible = (req.body && req.body.To) || (req.query && req.query.To);

  if (!numeroCible) {
    twiml.say({ language: 'fr-CA' }, 'Numéro de destination manquant.');
    res.setHeader('Content-Type', 'text/xml');
    return res.status(200).send(twiml.toString());
  }

  const dial = twiml.dial({ callerId: process.env.TWILIO_PHONE_NUMBER });
  dial.number(numeroCible);

  res.setHeader('Content-Type', 'text/xml');
  return res.status(200).send(twiml.toString());
};
