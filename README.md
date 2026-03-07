# 🪁 KiteDash — Perú Beach

Your personal kitesurf dashboard for Perú Beach, Acassuso.
Pulls live forecast data from **Windguru** (via server proxy) with **Open-Meteo** as fallback.

---

## 🚀 Deploy in 5 minutes (GitHub + Netlify)

### Step 1 — Put this folder on GitHub

1. Go to [github.com/new](https://github.com/new)
2. Create a new repo called `kitedash` (private is fine)
3. Upload all the files from this folder — drag & drop them into the repo on GitHub
   - `netlify.toml`
   - `public/index.html`
   - `netlify/functions/windguru.js`
   - `netlify/functions/station.js`

### Step 2 — Connect to Netlify

1. Go to [netlify.com](https://netlify.com) and sign up (free)
2. Click **"Add new site" → "Import an existing project"**
3. Choose **GitHub** and select your `kitedash` repo
4. Build settings will be auto-detected from `netlify.toml`:
   - **Publish directory:** `public`
   - **Functions directory:** `netlify/functions`
5. Click **Deploy site**

### Step 3 — Open your dashboard!

Netlify gives you a URL like `https://random-name-123.netlify.app`  
You can rename it to something like `kitedash-peru` in Site Settings.

**Bookmark it on your phone** — or add to Home Screen for a full app experience.

---

## 📁 File Structure

```
kitedash/
├── netlify.toml                    ← Netlify config
├── public/
│   └── index.html                  ← The dashboard
└── netlify/
    └── functions/
        ├── windguru.js             ← Proxies Windguru forecast (spot 88345)
        └── station.js              ← Proxies CNSI live station (ID 2042)
```

---

## 🔧 How it works

```
Your browser
    ↓
Netlify (your hosted page)
    ↓ calls /.netlify/functions/windguru
Netlify serverless function
    ↓ fetches server-to-server (no CORS block)
windguru.cz
    ↓ returns forecast JSON
Back to your dashboard ✅
```

When running the file **locally** (not hosted), Windguru will fail (CORS)
and the dashboard automatically falls back to **Open-Meteo** — same models,
very close numbers. So it always works.

---

## 🌊 Data sources

| Data | Source |
|------|--------|
| Wind forecast | Windguru GFS (via proxy) |
| Live wind now | CNSI Station ID 2042 (via proxy) |
| Fallback forecast | Open-Meteo (GFS/ECMWF, free) |
| Wave height | Open-Meteo Marine API |
| Windy map | windy.com embed |

---

## ✏️ Customising

- **Change spot:** Edit `SPOT_ID` in `netlify/functions/windguru.js`
- **Change station:** Edit `STATION_ID` in `netlify/functions/station.js`
- **Change coordinates:** Edit `LAT` / `LON` at the top of `public/index.html`
