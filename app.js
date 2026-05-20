// === Dialer — Twilio Voice SDK v2 ===

let device = null;
let appelActif = null;
let intervalTimer = null;
let secondesEcoulees = 0;
let dernierNumero = null;
let appelTente = false;

const HISTORIQUE_KEY = 'dialerHistory';

const champNumero       = document.getElementById('champNumero');
const btnDemarrer       = document.getElementById('btnDemarrer');
const btnAppeler        = document.getElementById('btnAppeler');
const btnRaccrocher     = document.getElementById('btnRaccrocher');
const texteStatut       = document.getElementById('texteStatut');
const pastilleStatut    = document.getElementById('pastilleStatut');
const zoneTimer         = document.getElementById('zoneTimer');
const timerAffichage    = document.getElementById('timer');
const callerIdAffichage = document.getElementById('callerIdAffichage');
const popupOverlay      = document.getElementById('popupOverlay');
const popupNumero       = document.getElementById('popupNumero');
const btnParle          = document.getElementById('btnParle');
const btnPasRepondu     = document.getElementById('btnPasRepondu');
const listeRappeler     = document.getElementById('listeRappeler');
const listeParle        = document.getElementById('listeParle');

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

// --- Historique ---

function chargerHistorique() {
  try {
    return JSON.parse(localStorage.getItem(HISTORIQUE_KEY)) || { parle: [], rappeler: [] };
  } catch { return { parle: [], rappeler: [] }; }
}

function sauvegarderStatut(numero, statut) {
  const h = chargerHistorique();
  h.parle    = h.parle.filter(e => e.numero !== numero);
  h.rappeler = h.rappeler.filter(e => e.numero !== numero);
  h[statut].unshift({ numero, ts: Date.now() });
  localStorage.setItem(HISTORIQUE_KEY, JSON.stringify(h));
  rendreListes();
}

function formatDate(ts) {
  const d = new Date(ts);
  const maintenant = new Date();
  if (d.toDateString() === maintenant.toDateString()) {
    return d.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString('fr-CA', { month: 'short', day: 'numeric' });
}

function rendreListe(conteneur, entrees, avecRappel) {
  if (entrees.length === 0) {
    conteneur.innerHTML = '<p class="liste-vide">Aucun appel</p>';
    return;
  }
  conteneur.innerHTML = entrees.map(e => `
    <div class="entree-appel">
      <div class="entree-info">
        <span class="numero-affiche">${e.numero}</span>
        <span class="date-appel">${formatDate(e.ts)}</span>
      </div>
      ${avecRappel ? `<button class="btn-rappeler" data-numero="${e.numero}">📞</button>` : ''}
    </div>
  `).join('');

  if (avecRappel) {
    conteneur.querySelectorAll('.btn-rappeler').forEach(btn => {
      btn.addEventListener('click', () => rappelerNumero(btn.dataset.numero));
    });
  }
}

function rendreListes() {
  const h = chargerHistorique();
  rendreListe(listeRappeler, h.rappeler, true);
  rendreListe(listeParle, h.parle, false);
}

function rappelerNumero(numero) {
  champNumero.value = numero;
  btnAppeler.disabled = !numeroValide() || !!appelActif;
  if (device && !appelActif && numeroValide()) {
    btnAppeler.click();
  }
}

// --- Popup ---

function afficherPopup(numero) {
  popupNumero.textContent = numero;
  popupOverlay.classList.add('visible');
}

function fermerPopup() {
  popupOverlay.classList.remove('visible');
}

btnParle.addEventListener('click', () => {
  sauvegarderStatut(dernierNumero, 'parle');
  fermerPopup();
});

btnPasRepondu.addEventListener('click', () => {
  sauvegarderStatut(dernierNumero, 'rappeler');
  fermerPopup();
});

// --- Onglets ---

document.querySelectorAll('.onglet').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.onglet').forEach(b => b.classList.remove('actif'));
    btn.classList.add('actif');
    listeRappeler.style.display = btn.dataset.tab === 'rappeler' ? 'flex' : 'none';
    listeParle.style.display    = btn.dataset.tab === 'parle'    ? 'flex' : 'none';
  });
});

// --- Bouton Démarrer — nécessaire sur mobile (iOS exige gesture avant AudioContext) ---

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
  const numeroE164 = '+1' + chiffres;

  dernierNumero = champNumero.value;
  appelTente = true;

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
  const numero = dernierNumero;
  const tente = appelTente;

  appelActif = null;
  appelTente = false;
  arreterTimer();
  etatAppelActif(false);
  setStatut(messageStatut || 'Appel terminé', 'pret');
  btnAppeler.disabled = !numeroValide();

  if (tente && numero) {
    afficherPopup(numero);
  }

  setTimeout(() => {
    if (texteStatut.textContent !== 'Prêt') setStatut('Prêt', 'pret');
  }, 3000);
}

// --- Démarrage ---

setStatut('Appuie Démarrer', '');
rendreListes();
