// === Dialer — Twilio Voice SDK v2 ===

let device = null;
let appelActif = null;
let intervalTimer = null;
let secondesEcoulees = 0;

const champNumero      = document.getElementById('champNumero');
const btnDemarrer      = document.getElementById('btnDemarrer');
const btnAppeler       = document.getElementById('btnAppeler');
const btnRaccrocher    = document.getElementById('btnRaccrocher');
const texteStatut      = document.getElementById('texteStatut');
const pastilleStatut   = document.getElementById('pastilleStatut');
const zoneTimer        = document.getElementById('zoneTimer');
const timerAffichage   = document.getElementById('timer');
const callerIdAffichage = document.getElementById('callerIdAffichage');

// --- Utilitaires ---

function setStatut(texte, type) {
  texteStatut.textContent = texte;
  pastilleStatut.className = 'pastille ' + (type || '');
}

function formatTimer(s) {
  return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
}

function demarrerTimer() {
  secondesEcoulees = 0;
  zoneTimer.classList.add('visible');
  timerAffichage.textContent = '00:00';
  intervalTimer = setInterval(() => {
    secondesEcoulees++;
    timerAffichage.textContent = formatTimer(secondesEcoulees);
  }, 1000);
}

function arreterTimer() {
  clearInterval(intervalTimer);
  intervalTimer = null;
  zoneTimer.classList.remove('visible');
  secondesEcoulees = 0;
}

function etatAppelActif(actif) {
  btnRaccrocher.style.display = actif ? 'block' : 'none';
  btnAppeler.style.display    = actif ? 'none'  : 'block';
}

// Bouton Démarrer — nécessaire sur mobile (iOS exige gesture avant AudioContext)
btnDemarrer.addEventListener('click', async () => {
  btnDemarrer.disabled = true;
  btnDemarrer.style.display = 'none';
  btnAppeler.style.display = 'block';
  await initialiserDevice();
});

function numeroValide() {
  return champNumero.value.replace(/\D/g, '').length === 10;
}

// --- Formatage automatique numéro canadien (XXX-XXX-XXXX) ---

champNumero.addEventListener('input', () => {
  let v = champNumero.value.replace(/\D/g, '').slice(0, 10);
  if (v.length >= 7)      v = v.slice(0, 3) + '-' + v.slice(3, 6) + '-' + v.slice(6);
  else if (v.length >= 4) v = v.slice(0, 3) + '-' + v.slice(3);
  champNumero.value = v;
  btnAppeler.disabled = !numeroValide() || !!appelActif;
});

// --- Initialisation Device Twilio ---

async function initialiserDevice() {
  setStatut('Connexion...', 'attente');

  try {
    const rep = await fetch('/api/token', { method: 'POST' });
    if (!rep.ok) throw new Error('Erreur serveur ' + rep.status);

    const data = await rep.json();

    if (data.callerNumber) {
      callerIdAffichage.textContent = data.callerNumber;
    }

    device = new Twilio.Device(data.token, {
      logLevel: 1,
      codecPreferences: ['opus', 'pcmu'],
    });

    device.on('registered', () => {
      setStatut('Prêt', 'pret');
      btnAppeler.disabled = !numeroValide();
    });

    device.on('error', (err) => {
      setStatut('Erreur: ' + err.message, 'erreur');
    });

    // Sécurité: si le device coupe en cours d'appel
    device.on('disconnect', () => {
      if (appelActif) terminerAppel();
    });

    await device.register();

  } catch (err) {
    setStatut('Hors ligne — retry dans 5s', 'erreur');
    setTimeout(initialiserDevice, 5000);
  }
}

// --- Appel ---

btnAppeler.addEventListener('click', async () => {
  if (!device || appelActif || !numeroValide()) return;

  const chiffres = champNumero.value.replace(/\D/g, '');
  const numeroE164 = '+1' + chiffres; // Format E.164 Canada

  setStatut('Connexion...', 'attente');
  btnAppeler.disabled = true;

  try {
    appelActif = await device.connect({ params: { To: numeroE164 } });

    appelActif.on('ringing', () => setStatut('Sonnerie...', 'attente'));

    appelActif.on('accept', () => {
      setStatut('En appel ↗', 'appel');
      etatAppelActif(true);
      demarrerTimer();
    });

    appelActif.on('disconnect', () => terminerAppel());
    appelActif.on('cancel',     () => terminerAppel('Annulé'));
    appelActif.on('error',      (err) => terminerAppel('Erreur: ' + err.message));

  } catch (err) {
    terminerAppel('Échec connexion');
  }
});

// --- Raccrocher ---

btnRaccrocher.addEventListener('click', () => {
  if (appelActif) appelActif.disconnect();
});

// --- Fin d'appel (tous les cas) ---

function terminerAppel(messageStatut) {
  appelActif = null;
  arreterTimer();
  etatAppelActif(false);
  setStatut(messageStatut || 'Appel terminé', 'pret');
  btnAppeler.disabled = !numeroValide();
  setTimeout(() => {
    if (texteStatut.textContent !== 'Prêt') setStatut('Prêt', 'pret');
  }, 3000);
}

// --- Démarrage ---

setStatut('Appuie Démarrer', '');
