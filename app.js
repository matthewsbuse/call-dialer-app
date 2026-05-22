// === Dialer — Twilio Voice SDK v2 + CRM ===

// --- Auth ---
const AUTH_KEY = 'dialerAuth';

function verifierAuth() {
  if (sessionStorage.getItem(AUTH_KEY) !== '1') {
    document.getElementById('loginOverlay').style.display = 'flex';
  }
}

document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginMdp').value;
  if (u === 'admin' && p === 'admin') {
    sessionStorage.setItem(AUTH_KEY, '1');
    document.getElementById('loginOverlay').style.display = 'none';
  } else {
    document.getElementById('loginErreur').style.display = 'block';
  }
});

verifierAuth();

// --- CRM Data ---
const CRM_DATA_INITIALE = [
  { id:  1, nom: "Complexe Nettoyage Saguenay",         tel: "418-602-3874", adresse: "2147 boul Talbot, Chicoutimi",             site: "https://complexenettoyagesaguenay.com" },
  { id:  2, nom: "Autolook Inc",                         tel: "418-696-1352", adresse: "205 rue des Laurentides, Chicoutimi",       site: "https://garageautolook.com" },
  { id:  3, nom: "Unique Auto Shine",                    tel: "418-973-5666", adresse: "1462 boul Saint-Paul, Chicoutimi",          site: "" },
  { id:  4, nom: "Lave-Auto W",                          tel: "581-574-8484", adresse: "990 ch de la Réserve, Chicoutimi",          site: "https://laveautow.com" },
  { id:  5, nom: "Lave Auto Quatre Saisons",             tel: "418-695-4444", adresse: "3449 rue de l'Énergie, Jonquière",          site: "https://laveautojonquiere.com" },
  { id:  6, nom: "Lave Auto Expert 2003",                tel: "418-542-5353", adresse: "3581 rue de l'Énergie, Jonquière",          site: "" },
  { id:  7, nom: "Centre Esthétique Alexis-Le-Trotteur", tel: "418-695-0999", adresse: "2305 rue Alexis-Le-Trotteur, Jonquière",    site: "" },
  { id:  8, nom: "S'a Coche Esthétique Auto",            tel: "418-487-8065", adresse: "221 1re Av. Nord, Saint-Nazaire",           site: "https://sacocheesthetiqueautomobile.com" },
  { id:  9, nom: "Garage Ghislain Leclerc",              tel: "418-275-2724", adresse: "1638 boul Marcotte, Roberval",              site: "https://garageghislainleclerc.ca" },
  { id: 10, nom: "Lave-Auto Centre-Ville",               tel: "418-693-3016", adresse: "29 rue Bossé, Chicoutimi",                  site: "" },
  { id: 11, nom: "Lave-Auto Optimum",                    tel: "418-818-9307", adresse: "2547 rue Godbout, Jonquière",               site: "https://laveautooptimum.com" },
  { id: 12, nom: "Multi-Shine Saguenay",                 tel: "418-549-5555", adresse: "524 boul du Royaume O, Chicoutimi",         site: "" },
  { id: 13, nom: "Autoluxe 2000",                        tel: "418-695-2353", adresse: "Jonquière",                                 site: "" },
  { id: 14, nom: "Esthétique GS",                        tel: "581-235-4095", adresse: "245 rte de Tadoussac, Canton-Tremblay",     site: "" },
  { id: 15, nom: "Lave-Auto du Royaume",                 tel: "418-290-0075", adresse: "2341B boul du Royaume, Jonquière",          site: "" },
  { id: 16, nom: "Détailing Jonquière",                  tel: "418-548-3022", adresse: "1742 rue Hoopes, Jonquière",                site: "" },
  { id: 17, nom: "Lave-Auto Chic",                       tel: "",              adresse: "1741 boul Talbot, Chicoutimi",              site: "" },
  { id: 18, nom: "Auto Flash 2000",                      tel: "",              adresse: "2706 boul Talbot, Chicoutimi",              site: "" },
  { id: 19, nom: "Lave-Auto LD Esso",                    tel: "",              adresse: "1455 boul Talbot, Chicoutimi",              site: "" },
  { id: 20, nom: "Garage Raymond Roy",                   tel: "",              adresse: "Jonquière",                                 site: "" },
  // --- Beauce ---
  { id: 21, nom: "Ultra-Pro Lave-Auto Beauce",            tel: "418-226-9274", adresse: "11915 2e Avenue, Saint-Georges",              site: "" },
  { id: 22, nom: "BCE Lave-Auto Plus",                    tel: "418-228-9392", adresse: "2085 127e Rue, Saint-Georges",                site: "https://www.laveautoplus.ca" },
  { id: 23, nom: "Lave-Auto Perso (Lacroix)",             tel: "418-313-4336", adresse: "17088 boulevard Lacroix, Saint-Georges",      site: "" },
  { id: 24, nom: "Signé Perso Esthétique Auto",           tel: "418-313-4336", adresse: "2500 45e Rue Nord, Saint-Georges",            site: "" },
  { id: 25, nom: "Lave Auto Stephan Gilbert",             tel: "418-228-1980", adresse: "15540 boulevard Lacroix, Saint-Georges",      site: "" },
  { id: 26, nom: "iWash Lave-Auto Libre-Service",         tel: "418-957-7731", adresse: "2300 127e Rue, Saint-Georges",                site: "" },
  { id: 27, nom: "Fusion Esthétique Automobile",          tel: "418-222-1671", adresse: "8865 boulevard Lacroix, Saint-Georges",       site: "" },
  { id: 28, nom: "Entretiens LP Esthétique Auto",         tel: "418-957-3886", adresse: "632 11e Rue Ouest, Saint-Georges",            site: "" },
  { id: 29, nom: "Lave Auto Express Saint-Georges",       tel: "",              adresse: "Saint-Georges, QC",                          site: "" },
  { id: 30, nom: "Ultramar Lave-Auto Dionne",             tel: "418-227-3883", adresse: "2105 boulevard Dionne, Saint-Georges",        site: "" },
  { id: 31, nom: "Ultramar Lave-Auto Lacroix",            tel: "418-227-0033", adresse: "14655 boulevard Lacroix, Saint-Georges",      site: "" },
  { id: 32, nom: "Ultramar Lave-Auto Saint-Georges Est",  tel: "418-230-0174", adresse: "8400 boulevard Lacroix, Saint-Georges Est",   site: "" },
  { id: 33, nom: "St-Georges Chevrolet GMC Esthétique",   tel: "418-228-8801", adresse: "520 87e Rue Est, Saint-Georges",              site: "https://www.stgeorgesgm.ca" },
  { id: 34, nom: "Prestige Esthétique Auto Beauceville",  tel: "",              adresse: "107 57e Avenue, Beauceville",                 site: "" },
  { id: 35, nom: "Lave-Auto VIP Beauceville",             tel: "418-774-3433", adresse: "95 125e Rue, Beauceville",                    site: "" },
  { id: 36, nom: "Garage Lave-Auto Pro Beauceville",      tel: "418-774-9222", adresse: "Beauceville, QC",                             site: "" },
  { id: 37, nom: "Ultramar Lave-Auto Beauceville",        tel: "418-774-5554", adresse: "575A boulevard Renault, Beauceville",         site: "" },
  { id: 38, nom: "Irving Lave-Auto Beauceville",          tel: "418-774-5217", adresse: "646 boulevard Renault, Beauceville",          site: "" },
  { id: 39, nom: "Magic & Shine Esthétique Auto",         tel: "",              adresse: "243 Côte Taschereau, Saint-Joseph-de-Beauce", site: "" },
  { id: 40, nom: "Ultramar Lave-Auto Saint-Joseph",       tel: "418-397-6814", adresse: "271 Route 276, Saint-Joseph-de-Beauce",       site: "" },
  { id: 41, nom: "Lave-Auto La Chaudière",                tel: "418-387-3989", adresse: "Sainte-Marie, QC",                            site: "https://laveautolachaudiere.ca" },
  { id: 42, nom: "Lave-Auto Sainte-Marie",                tel: "418-387-5816", adresse: "1111 boulevard Vachon Nord, Sainte-Marie",    site: "" },
  { id: 43, nom: "Le Pro du Lave-Auto",                   tel: "418-386-1869", adresse: "590 rue Notre-Dame Nord, Sainte-Marie",       site: "" },
  { id: 44, nom: "Lave-Auto Deschênes",                   tel: "418-209-9330", adresse: "1458 Route Président-Kennedy Nord, Ste-Marie",site: "" },
  { id: 45, nom: "Esthétique et Carrosserie Auto CL",     tel: "418-803-4841", adresse: "1141 rue Notre-Dame Nord, Sainte-Marie",      site: "" },
  { id: 46, nom: "Unicoop Lave-Auto Sainte-Marie",        tel: "418-387-5464", adresse: "364 avenue de la Coopérative, Sainte-Marie",  site: "" },
  { id: 47, nom: "Lave-Auto Saint-Gédéon",                tel: "418-215-0258", adresse: "154 1re Avenue Sud, Saint-Gédéon-de-Beauce",  site: "" },
  { id: 48, nom: "Lave-Auto Saint-Sylvestre",             tel: "418-596-2856", adresse: "101 Du Parc, Saint-Sylvestre",                site: "" },
  { id: 49, nom: "Cliche Auto Ford Vallée-Jonction",      tel: "418-253-5445", adresse: "46 Route Kennedy, Vallée-Jonction",           site: "https://www.clicheautovallee.com" },
  { id: 50, nom: "Lave-Auto Etchemins Inc",               tel: "",              adresse: "Lac-Etchemin, QC",                           site: "" },
  { id: 51, nom: "Esthétique Écovap",                     tel: "819-237-5000", adresse: "6435 rue Salaberry, Lac-Mégantic",            site: "" },
  { id: 52, nom: "FR Dallaire Esthétique Auto",           tel: "819-583-0110", adresse: "4196 rue Laval, Lac-Mégantic",                site: "" },
  { id: 53, nom: "CB Esthétique Auto",                    tel: "819-214-2235", adresse: "Lac-Mégantic, QC",                            site: "" },
  { id: 54, nom: "Boutique de l'Auto Saint-Prosper",      tel: "418-594-5787", adresse: "2289 25e Avenue, Saint-Prosper",              site: "https://boutiquedelauto.ca" },
  { id: 55, nom: "Esthétique Auto du Boulevard",          tel: "418-332-0292", adresse: "67 boulevard Frontenac, Thetford Mines",      site: "https://www.esthetique-auto.com" },
  { id: 56, nom: "Centre Esthétique Auto Thetford",       tel: "418-423-4774", adresse: "3501 boulevard Frontenac Ouest, Thetford Mines",site: "" },
  { id: 57, nom: "Centre Esthétique Auto-Mobile",         tel: "418-341-0531", adresse: "1045 boulevard Frontenac Ouest, Thetford Mines",site: "" },
  { id: 58, nom: "Alain Lavallée Esthétique Auto",        tel: "418-335-3078", adresse: "70 rue Blais, Thetford Mines",                site: "" },
  { id: 59, nom: "Lave-Auto Supreme Plus Saint-Joseph",   tel: "",              adresse: "Saint-Joseph-de-Beauce, QC",                 site: "" },
  { id: 60, nom: "Lave-Auto Supreme Plus Saint-Gédéon",   tel: "",              adresse: "Saint-Gédéon-de-Beauce, QC",                 site: "" },
  { id: 61, nom: "Esthétique Auto Sainte-Marie",          tel: "",              adresse: "Sainte-Marie, QC",                            site: "" },
  { id: 62, nom: "Lave-Auto Notre-Dame-des-Pins",         tel: "",              adresse: "Notre-Dame-des-Pins, QC",                    site: "" },
  { id: 63, nom: "Centre Auto Vallée-Jonction",           tel: "418-253-5030", adresse: "Vallée-Jonction, QC",                         site: "" },
  { id: 64, nom: "Hyundai Beauce Esthétique",             tel: "",              adresse: "Saint-Georges, QC",                          site: "https://www.hyundaibeauce.com" },
  { id: 65, nom: "Beauce Auto Ford Lincoln Esthétique",   tel: "",              adresse: "Beauceville, QC",                             site: "https://www.beauceauto.ca" },
  { id: 66, nom: "Esthétique Auto Saint-Prosper",         tel: "",              adresse: "Saint-Prosper, QC",                           site: "" },
  { id: 67, nom: "Lave-Auto Champlain Lac-Mégantic",      tel: "",              adresse: "4802 rue Champlain, Lac-Mégantic",            site: "" },
  { id: 68, nom: "Centre Auto Perron Lac-Mégantic",       tel: "",              adresse: "Lac-Mégantic, QC",                            site: "" },
  { id: 69, nom: "Lave-Auto Perso Dionne",                tel: "418-957-3886", adresse: "790 boulevard Dionne, Saint-Georges",          site: "" },
  { id: 70, nom: "Esthétique Auto CNet Beauce",           tel: "",              adresse: "Beauce-Sartigan, QC",                         site: "" },
];

// --- State ---
let device = null;
let appelActif = null;
let intervalTimer = null;
let secondesEcoulees = 0;
let dernierNumero = null;
let appelTente = false;
let crmContactActif = null;
let wakeLock = null;
let silenceCount = 0;

// --- Keys ---
const HISTORIQUE_KEY = 'dialerHistory';
const CRM_KEY = 'dialerCRM';

// --- DOM Refs ---
const champNumero       = document.getElementById('champNumero');
const btnDemarrer       = document.getElementById('btnDemarrer');
const btnAppeler        = document.getElementById('btnAppeler');
const btnRaccrocher     = document.getElementById('btnRaccrocher');
const btnScript         = document.getElementById('btnScript');
const scriptOverlay     = document.getElementById('scriptOverlay');
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
const crmCarte          = document.getElementById('crmCarte');
const crmProgress       = document.getElementById('crmProgress');
const crmListe          = document.getElementById('crmListe');
const btnSuivant        = document.getElementById('btnSuivant');

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
  btnScript.style.display     = actif ? 'block' : 'none';
  if (!actif) scriptOverlay.style.display = 'none';
}

btnScript.addEventListener('click', () => {
  scriptOverlay.style.display = scriptOverlay.style.display === 'none' ? 'flex' : 'none';
});
document.getElementById('btnFermerScript').addEventListener('click', () => {
  scriptOverlay.style.display = 'none';
});

// --- Récupération micro iOS ---
// Quand iOS background une page, le MediaStreamTrack du micro se mute ou se termine.
// Fix: détecter le retour en foreground → forcer nouveau getUserMedia via cycle
// unsetInputDevice/setInputDevice. C'est ce que Twilio Video SDK fait en interne.

async function recupererMicro() {
  if (!device || !appelActif) return;
  setStatut('Reconnexion micro...', 'attente');
  try {
    await device.audio.unsetInputDevice();
    await device.audio.setInputDevice('default');
    setStatut('En appel ↗', 'appel');
  } catch (e) {
    setStatut('En appel ↗', 'appel');
  }
  silenceCount = 0;
}

// Retour en foreground → attendre 500ms (iOS stabilise session audio) → reacquérir micro
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && appelActif) {
    setTimeout(() => recupererMicro(), 500);
  }
});

// AudioProcessor: surveille les events track "ended" et "mute" sur le stream Twilio
class MicMonitorProcessor {
  async createProcessedStream(stream) {
    const track = stream.getAudioTracks()[0];
    if (track) {
      track.addEventListener('ended', () => {
        if (appelActif && !document.hidden) recupererMicro();
      });
      track.addEventListener('mute', () => {
        if (appelActif && !document.hidden) setTimeout(() => recupererMicro(), 300);
      });
    }
    return stream;
  }
  async destroyProcessedStream(stream) {}
}

function activerGardeAudio() {
  // WakeLock: garde écran allumé → iOS suspend moins la page
  if ('wakeLock' in navigator) {
    navigator.wakeLock.request('screen').then(l => { wakeLock = l; }).catch(() => {});
  }
  silenceCount = 0;
}

function desactiverGardeAudio() {
  if (wakeLock) { wakeLock.release().catch(() => {}); wakeLock = null; }
  silenceCount = 0;
}

// --- CRM ---

function chargerCRM() {
  try {
    const stored = JSON.parse(localStorage.getItem(CRM_KEY));
    if (stored && Array.isArray(stored.contacts)) return stored;
  } catch {}
  return { contacts: CRM_DATA_INITIALE.map(c => ({ ...c })), indexActif: 0 };
}

function sauvegarderCRM(crm) {
  localStorage.setItem(CRM_KEY, JSON.stringify(crm));
}

function initialiserCRM() {
  if (!localStorage.getItem(CRM_KEY)) {
    sauvegarderCRM({ contacts: CRM_DATA_INITIALE.map(c => ({ ...c })), indexActif: 0 });
  }
}

function rendreCRM() {
  const crm = chargerCRM();
  const c = crm.contacts[crm.indexActif];
  if (!c) return;

  // Progress
  const contactes = crm.contacts.filter(x => x.statut !== 'a_appeler').length;
  crmProgress.textContent = `${contactes} / ${crm.contacts.length} contactés`;

  // Carte contact actif
  const siteHtml = c.site
    ? `<a class="crm-site" href="${c.site}" target="_blank" rel="noopener">${c.site.replace(/^https?:\/\//, '')}</a>`
    : '';
  const telHtml = c.tel
    ? `<span class="crm-tel">${c.tel}</span>`
    : `<span class="crm-tel crm-tel-manquant">⚠ Téléphone à vérifier</span>`;

  crmCarte.innerHTML = `
    <div class="crm-nom">${c.nom}</div>
    ${telHtml}
    <div class="crm-adresse">📍 ${c.adresse}</div>
    ${siteHtml}
  `;

  // Auto-remplir champ numéro si disponible
  if (c.tel) {
    champNumero.value = c.tel;
    champNumero.dispatchEvent(new Event('input'));
    crmContactActif = c.id;
  } else {
    champNumero.value = '';
    champNumero.dispatchEvent(new Event('input'));
    crmContactActif = null;
  }

  // Liste tous les contacts
  crmListe.innerHTML = crm.contacts.map((contact, i) => {
    const icone = contact.statut === 'parle' ? '✅' : contact.statut === 'pas_repondu' ? '❌' : '·';
    const actif = i === crm.indexActif ? 'crm-item-actif' : '';
    const dateLabel = contact.id <= 20 ? '21 mai 2026' : '22 mai 2026';
    return `
      <div class="crm-item ${actif} crm-statut-${contact.statut}" data-index="${i}">
        <span class="crm-item-icone">${icone}</span>
        <div class="crm-item-info">
          <span class="crm-item-nom">${contact.nom}</span>
          <span class="crm-item-tel">${contact.tel || '—'} <span style="font-size:10px;opacity:0.5;margin-left:4px">${dateLabel}</span></span>
        </div>
      </div>
    `;
  }).join('');

  crmListe.querySelectorAll('.crm-item').forEach(el => {
    el.addEventListener('click', () => {
      const crm2 = chargerCRM();
      crm2.indexActif = parseInt(el.dataset.index);
      sauvegarderCRM(crm2);
      rendreCRM();
    });
  });
}

function avancerCRM() {
  const crm = chargerCRM();
  crm.indexActif = (crm.indexActif + 1) % crm.contacts.length;
  sauvegarderCRM(crm);
  rendreCRM();
}

function mettreAJourStatutCRM(contactId, statut) {
  const crm = chargerCRM();
  const c = crm.contacts.find(x => x.id === contactId);
  if (c) c.statut = statut;
  sauvegarderCRM(crm);
}

btnSuivant.addEventListener('click', avancerCRM);

document.getElementById('btnResetCRM').addEventListener('click', () => {
  if (!confirm('Ajouter les nouveaux contacts Beauce sans effacer les statuts existants?')) return;
  const crm = chargerCRM();
  const idsExistants = new Set(crm.contacts.map(c => c.id));
  const nouveaux = CRM_DATA_INITIALE.filter(c => !idsExistants.has(c.id)).map(c => ({ ...c }));
  if (nouveaux.length === 0) { alert('Tous les contacts sont déjà chargés.'); return; }
  crm.contacts = [...crm.contacts, ...nouveaux];
  sauvegarderCRM(crm);
  location.reload();
});

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
  crmContactActif = null;
  champNumero.value = numero;
  btnAppeler.disabled = !numeroValide() || !!appelActif;
  if (device && !appelActif && numeroValide()) {
    btnAppeler.click();
  }
}

// --- Popup ---

function afficherPopup(numero, nomContact) {
  if (nomContact) {
    popupNumero.innerHTML = `<strong>${nomContact}</strong><br><small style="font-weight:400;letter-spacing:0.05em">${numero}</small>`;
  } else {
    popupNumero.textContent = numero;
  }
  popupOverlay.classList.add('visible');
}

function fermerPopup() {
  popupOverlay.classList.remove('visible');
}

btnParle.addEventListener('click', () => {
  const crmId = crmContactActif;
  crmContactActif = null;
  if (dernierNumero) sauvegarderStatut(dernierNumero, 'parle');
  if (crmId !== null) {
    mettreAJourStatutCRM(crmId, 'parle');
    fermerPopup();
    avancerCRM();
  } else {
    fermerPopup();
  }
});

btnPasRepondu.addEventListener('click', () => {
  const crmId = crmContactActif;
  crmContactActif = null;
  if (dernierNumero) sauvegarderStatut(dernierNumero, 'rappeler');
  if (crmId !== null) {
    mettreAJourStatutCRM(crmId, 'pas_repondu');
    fermerPopup();
    avancerCRM();
  } else {
    fermerPopup();
  }
});

// --- Tabs principales ---

document.querySelectorAll('.tab-main').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-main').forEach(b => b.classList.remove('actif'));
    btn.classList.add('actif');
    document.getElementById('panelCRM').style.display        = btn.dataset.tab === 'crm'        ? 'block' : 'none';
    document.getElementById('panelHistorique').style.display = btn.dataset.tab === 'historique' ? 'block' : 'none';
  });
});

// --- Onglets Historique ---

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
    if (data.callerNumber) callerIdAffichage.textContent = data.callerNumber;

    device = new Twilio.Device(data.token, {
      logLevel: 1,
      codecPreferences: ['opus', 'pcmu'],
    });

    // Surveille le track micro — détecte si iOS le coupe
    device.audio.addProcessor(new MicMonitorProcessor());

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

  // Vérifier que le numéro correspond encore au contact CRM actif
  if (crmContactActif !== null) {
    const crm = chargerCRM();
    const c = crm.contacts.find(x => x.id === crmContactActif);
    if (!c || champNumero.value !== c.tel) crmContactActif = null;
  }

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
      activerGardeAudio();
    });

    // Détecte micro silencieux prolongé en foreground → récupère automatiquement
    // volume() fire toutes les ~50ms; 60 ticks = ~3 secondes de silence
    appelActif.on('volume', (inputVolume) => {
      if (!document.hidden) {
        if (inputVolume === 0) {
          silenceCount++;
          if (silenceCount === 60) recupererMicro();
        } else {
          silenceCount = 0;
        }
      }
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

  // Capturer crmContactActif avant que les boutons popup le modifient
  // (crmContactActif reste set pour que les boutons popup le lisent)

  appelActif = null;
  appelTente = false;
  arreterTimer();
  desactiverGardeAudio();
  etatAppelActif(false);
  setStatut(messageStatut || 'Appel terminé', 'pret');
  btnAppeler.disabled = !numeroValide();

  if (tente && numero) {
    // Trouver nom du contact CRM si applicable
    let nomContact = null;
    if (crmContactActif !== null) {
      const crm = chargerCRM();
      const c = crm.contacts.find(x => x.id === crmContactActif);
      if (c) nomContact = c.nom;
    }
    afficherPopup(numero, nomContact);
  }

  setTimeout(() => {
    if (texteStatut.textContent !== 'Prêt') setStatut('Prêt', 'pret');
  }, 3000);
}

// --- Démarrage ---

initialiserCRM();
setStatut('Appuie Démarrer', '');
rendreCRM();
rendreListes();
