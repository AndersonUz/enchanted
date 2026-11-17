// =====================================================================
//  CONFIGURACIÓN — todo lo que tienes que personalizar está aquí.
//  No necesitas tocar index.html, style.css ni script.js.
// =====================================================================
window.CONFIG = {
  herName: "Giulia",          // <- su nombre
  hisName: "Anderson",

  // Fecha en que se conocieron (AAAA-MM-DD) — para el contador de días
  dateMet: "2026-01-01",

  // Ubicaciones para calcular la distancia y mostrar la hora de cada uno
  me:  { city: "Santo Domingo", lat: 18.4861, lon: -69.9312, tz: "America/Santo_Domingo" },
  her: { city: "Roma",          lat: 41.9028, lon: 12.4964,  tz: "Europe/Rome" },

  // ---------------- MÚSICA ----------------
  // Opción A (recomendada para repo público): el ID del video de YouTube.
  //   Ej: https://www.youtube.com/watch?v=XXXXXXXXXXX  ->  youtubeId: "XXXXXXXXXXX"
  // Opción B: un mp3 tuyo dentro del repo, ej. "music/enchanted.mp3"
  //   (si llenas audioFile, tiene prioridad sobre YouTube)
  music: {
    youtubeId: "",
    audioFile: "",
    startAt: 0,              // segundo en que empieza (ej. 60 para arrancar en el coro)
    volume: 70               // 0–100
  },

  // ---------------- TEXTOS ----------------
  intro: {
    eyebrow: "11:47 pm · someone is outside",
    title: "Someone is at your door…",
    button: "Turn on the sound & come in",
    hint: "Better with headphones 🎧"
  },

  knockText: "knock knock",
  openButton: "Open the door",

  // Lo que dice el chico cuando se abre la puerta (se escribe línea por línea).
  // {km} se reemplaza por la distancia real y {name} por su nombre.
  greeting: [
    "Hi, {name}. Sorry I'm late…",
    "I crossed {km} km of ocean just to knock on your door."
  ],

  // ✍️ Escribe aquí tú mismo la frase de la canción que él le dice en la puerta.
  // Si la dejas vacía, simplemente no aparece.
  songQuote: "",

  greetingEnd: "And I'd knock again. Every single night.",

  nextButton: "Come with me →",

  // Páginas del librito — cámbialas por recuerdos reales de ustedes
  pages: [
    {
      title: "Chapter one",
      text: "Every story starts with a small, brave thing. Ours started with a hello I almost didn't send."
    },
    {
      title: "The distance",
      text: "An ocean, a few time zones and two languages between us. And somehow you still feel like the closest person in my day."
    },
    {
      title: "What I wish",
      text: "That one day the door is real, the knock is real, and I don't need a screen to say goodnight."
    }
  ],

  // Página final (muestra contadores debajo)
  finalPage: {
    title: "Still on the first page",
    text: "Ours is a story that has barely begun — and I don't want to skip to the end. I want every page in between.",
    // ✍️ Segunda frase de la canción (opcional), la escribes tú
    songQuote: "",
    signature: "— to be continued…"
  },

  labels: {
    days: "days since we met",
    km: "km between us",
    hereTime: "here",
    thereTime: "there",
    replay: "Knock again ↺"
  }
};
