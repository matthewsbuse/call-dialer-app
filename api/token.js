// Génère un Access Token Twilio Voice SDK pour le client navigateur
const twilio = require('twilio');

const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ erreur: 'Méthode non autorisée' });

  const {
    TWILIO_ACCOUNT_SID,
    TWILIO_API_KEY_SID,
    TWILIO_API_KEY_SECRET,
    TWILIO_TWIML_APP_SID,
    TWILIO_PHONE_NUMBER,
  } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_API_KEY_SID || !TWILIO_API_KEY_SECRET || !TWILIO_TWIML_APP_SID) {
    return res.status(500).json({ erreur: 'Variables d\'environnement manquantes' });
  }

  try {
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: TWILIO_TWIML_APP_SID,
      incomingAllow: false,
    });

    // Token expire après 1 heure
    const token = new AccessToken(
      TWILIO_ACCOUNT_SID,
      TWILIO_API_KEY_SID,
      TWILIO_API_KEY_SECRET,
      { identity: 'dialer-user', ttl: 3600 }
    );

    token.addGrant(voiceGrant);

    return res.status(200).json({
      token: token.toJwt(),
      identity: 'dialer-user',
      callerNumber: TWILIO_PHONE_NUMBER || '',
    });
  } catch (err) {
    return res.status(500).json({ erreur: 'Erreur génération token' });
  }
};
