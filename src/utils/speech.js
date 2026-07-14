const preferredLocales = ["es-419", "es-MX", "es-US"];
const femaleVoiceNames = /female|mujer|abril|ainhoa|arabella|camila|candela|carlota|carmen|catalina|conchita|dalia|elena|elvira|francisca|gabriela|helena|ines|irene|isabella|isidora|jimena|laura|lia|lola|luciana|marina|marisol|mia|mónica|monica|paloma|paulina|penélope|penelope|renata|rosa|sabina|salom[eé]|sara|silvia|soledad|teresa|valentina|victoria|ximena|yara/i;
const maleVoiceNames = /male|hombre|alejandro|alonso|álvaro|alvaro|andrés|andres|antonio|arnau|carlos|darío|dario|diego|eduardo|elías|elias|emilio|enrique|federico|felipe|fernando|gerard|gonzalo|guillermo|javier|jorge|jos[eé]|juan|luis|manuel|mateo|miguel|nicol[aá]s|pablo|pedro|ra[uú]l|ricardo|roberto|rodrigo|sergio|tom[aá]s|v[ií]ctor/i;
let voicesReady;
let speechRequest = 0;

export function prepareSpanishVoices() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return Promise.resolve([]);
  const synthesis = window.speechSynthesis;
  const available = synthesis.getVoices();
  if (available.length) return Promise.resolve(available);
  if (voicesReady) return voicesReady;
  voicesReady = new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      synthesis.removeEventListener?.("voiceschanged", finish);
      resolve(synthesis.getVoices());
    };
    synthesis.addEventListener?.("voiceschanged", finish, { once: true });
    window.setTimeout(finish, 1800);
  });
  return voicesReady;
}

function preferredVoice(voices) {
  const spanishVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith("es"));
  const femaleVoices = spanishVoices.filter((voice) => femaleVoiceNames.test(voice.name));
  const notKnownMale = spanishVoices.filter((voice) => !maleVoiceNames.test(voice.name));
  return preferredLocales
    .map((locale) => femaleVoices.find((voice) => voice.lang.toLowerCase() === locale.toLowerCase()))
    .find(Boolean)
    || femaleVoices[0]
    || preferredLocales.map((locale) => notKnownMale.find((voice) => voice.lang.toLowerCase() === locale.toLowerCase())).find(Boolean)
    || notKnownMale[0]
    || null;
}

export async function speakSpanish(text) {
  const value = String(text || "").trim();
  if (!value || typeof window === "undefined" || !("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") return false;
  const request = ++speechRequest;
  window.speechSynthesis.cancel();
  const voices = await prepareSpanishVoices();
  if (request !== speechRequest) return false;
  const voice = preferredVoice(voices);
  if (!voice) return false;
  const utterance = new SpeechSynthesisUtterance(value);
  utterance.lang = voice.lang;
  utterance.voice = voice;
  utterance.rate = 0.92;
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeech() {
  speechRequest += 1;
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
}
