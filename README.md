# FocusFlow — Website

Official informational website for **FocusFlow**, an AI-powered attention assessment app that helps people understand their attention patterns through interactive assessments, camera-based attention tracking, and personalized insights.

> FocusFlow is an attention assessment tool. It is not a substitute for professional medical diagnosis.

**Live site (GitHub Pages):** https://valerie-joy.github.io/focus_flowweb/

## Pages

| File | Page |
| --- | --- |
| `index.html` | About FocusFlow — hero, what FocusFlow is, key features, how it works, interactive app preview, privacy & trust, footer |
| `privacy.html` | Privacy Policy — 16 sections with a sticky table of contents |

## Project structure

```
focus_flowweb/
├── index.html          About FocusFlow (landing page)
├── privacy.html        Privacy Policy
├── style.css           Shared styles, light/dark design tokens, responsive layout
├── script.js           Theme toggle, mobile menu, preview tabs, active-section highlighting
├── assets/
│   ├── favicon.svg
│   └── fonts/          Self-hosted Sora + Figtree variable fonts (woff2)
└── README.md
```

No build step, framework, or backend. It is plain HTML, CSS, and JavaScript, ready for GitHub Pages.

## Features

- Light and dark themes using the FocusFlow app palette; the choice is saved in `localStorage` and follows the OS setting until the visitor picks one
- Desktop-first layout with tablet and mobile breakpoints (1080px and 760px)
- Accessible mobile menu (Escape closes it, focus is managed, `aria-expanded` is kept in sync)
- App preview built as an accessible tab interface (arrow keys, Home, End) with seven app screens recreated in HTML/CSS, so they follow the active theme
- Respects `prefers-reduced-motion`
- Semantic HTML, skip link, visible focus styles, SEO titles and meta descriptions
- No cookies, analytics, or third-party requests: fonts and icons are served locally

## Before publishing: complete the privacy policy

`privacy.html` is a **draft for review**. Anything that hasn't been confirmed about how the app actually handles data is marked with an orange **"To confirm"** box. Before treating the policy as final:

1. Search `privacy.html` for `To confirm` and `tbc` and fill in each item with FocusFlow's real practices (storage location, encryption, retention periods, third-party providers, contact details, jurisdiction, minimum age).
2. Check the app's own on-screen claims against the implementation, in particular:
   - the camera permission screen: "We do NOT record video", "Only gaze data is processed", "Your data is private & secure"
   - the upload screen: "Your document is encrypted and stored securely", "Files are never shared and are used only for verification"
3. Decide the minimum age. The current app design lets users pick an age from 10, which has legal consequences for consent.
4. Ideally, have the final text reviewed by someone qualified in privacy law.
5. Remove the "Draft for review before publishing" notice block (marked with an HTML comment) and fill in the effective date.
6. Replace the footer placeholder "Contact email to be added" on both pages with a real contact address.

## Run locally

Open `index.html` directly in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

1. Push the files to the `main` branch:
   ```bash
   git add .
   git commit -m "Add FocusFlow website"
   git push origin main
   ```
2. On GitHub, open the repository → **Settings** → **Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Set **Branch** to `main` and the folder to `/ (root)`, then click **Save**.
5. After a minute or two, the site is live at https://valerie-joy.github.io/focus_flowweb/.

## Credits

- Fonts: [Sora](https://github.com/sora-xor/sora-font) and [Figtree](https://github.com/erikdkennedy/figtree), SIL Open Font License 1.1 (via Fontsource)
- Icons: [Lucide](https://lucide.dev), ISC License
