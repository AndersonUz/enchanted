# 🚪 knock knock

Una pequeña página interactiva: alguien toca la puerta, ella la abre, y la historia empieza.

## Personalizar
Todo se edita en **`config.js`**: su nombre, la fecha en que se conocieron, las ciudades (distancia y hora), los textos, las páginas del librito y la música.

- `songQuote` y `finalPage.songQuote`: escribe ahí tú mismo las frases de la canción.
- Música: pon el ID del video de YouTube en `music.youtubeId` (la parte después de `v=`), y si quieres que arranque en el coro, ponlo en `startAt` (en segundos).

## Publicar gratis en GitHub Pages
1. Crea un repositorio nuevo en GitHub (ej. `knock-knock`).
2. Sube los archivos `index.html`, `style.css`, `script.js`, `config.js` (y `README.md`).
3. Ve a **Settings → Pages → Build and deployment** y en *Source* elige **Deploy from a branch**, rama `main`, carpeta `/ (root)` → **Save**.
4. En uno o dos minutos queda en `https://TU-USUARIO.github.io/knock-knock/`.

Para probarlo en tu PC antes de subirlo: `python -m http.server` dentro de la carpeta y abre `http://localhost:8000` (YouTube no funciona si abres el archivo con doble clic).
