# Digital Safety Lab: FUTA Edition

*Think. Identify. Protect.* A mobile-first, offline-capable digital safety playground. Independent learning resource, not an official FUTA product.

## 1. Overview
Four activities (Spot the Scam, Footprint Detective, Truth or Trap?, The Safety Challenge), XP, badges and a personal safety report. No registration, no tracking, no backend.

## 2. Features
- 600 XP total (150 / 100 / 100 / 200 + 50 bonus). Each question pays once, so retries cannot farm XP.
- All activities open from the start. Progress saved in the browser (LocalStorage).
- Inert simulated links, fictional identities, clear SIMULATION labels.
- Installable PWA with offline support and an online/offline indicator.

## 3. Technology
HTML5, CSS3, vanilla JavaScript, JSON content, LocalStorage, Service Worker, Web App Manifest. No libraries, fonts or external requests.

## 4. Local development
Service workers and JSON loading need http, not `file://`.
```
cd digital-safety-lab
python3 -m http.server 8000
```
Open http://localhost:8000.

## 5. GitHub repository setup
1. Create a new public repository (for example `digital-safety-lab`).
2. Upload the **contents** of this folder so `index.html` is at the repository root.
3. Commit to the `main` branch.

## 6. GitHub Pages deployment
1. Repository **Settings → Pages**.
2. Under **Build and deployment**, set Source to **Deploy from a branch**, Branch **main**, folder **/ (root)**, then Save.
3. After a minute the site is live at `https://<username>.github.io/<repository>/`.
4. Turn that URL into a QR code for students.

All paths are relative, so the repository subpath works.

## 7. Offline testing
1. Open the live site once while online and wait for it to load fully.
2. In Chrome DevTools, Application → Service Workers: confirm it is activated; Cache Storage should contain `dsl-futa-v1`.
3. Tick **Offline** (or enable airplane mode) and reload. Every activity should still work.
4. On Android, use the browser menu → Install app / Add to Home screen.
5. When you change any file, bump `CACHE` in `sw.js` (for example `dsl-futa-v2`) so devices update.

## 8. Known limitations
- Progress lives in one browser on one device and is lost if site data is cleared or in private browsing.
- Offline use needs one successful online visit first.
- Tested automatically in a simulated browser (logic, scoring, reset). Not yet tested on real phones or at 320 to 430px widths. Please do this before the event.
- iOS Safari may clear site data after weeks of inactivity.
- Content is English only. Contents are fictional and educational.
