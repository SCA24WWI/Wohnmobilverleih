# 🚐 Vanlife Süd - Frontend

Next.js 13 Frontend mit TypeScript, Tailwind CSS und Material Tailwind für die Wohnmobil-Buchungsplattform.

## 🛠️ Tech Stack

-   **Next.js 13.4.0** - React Framework mit App Router
-   **TypeScript 5.x** - Type-safe JavaScript
-   **Tailwind CSS 3.x** - Utility-first CSS Framework
-   **Material Tailwind** - React UI Komponenten
-   **Heroicons** - SVG Icon Library

## 🚀 Development Setup

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Production Build
npm run build
npm run start
```

**URLs:** http://localhost:3000

## 📁 Projektstruktur

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentifizierung
│   │   └── reset-password/ # Passwort-Reset
│   ├── buchung/           # Buchungsprozess
│   ├── wohnmobile/        # Fahrzeug-Seiten
│   ├── profil/            # Benutzer-Profil
│   └── page.tsx           # Homepage
├── components/            # Wiederverwendbare Komponenten
│   ├── navbar.tsx         # Navigation
│   ├── footer.tsx         # Footer
│   ├── search-bar.tsx     # Suchfunktion
│   └── vehicle-card.tsx   # Fahrzeug-Karten
├── contexts/             # React Contexts
│   └── AuthContext.tsx   # Authentifizierung State
└── config/
    └── api.ts            # API Konfiguration
```

## 🔑 Key Features

### Authentifizierung

-   JWT-basierte Anmeldung/Registrierung
-   Passwort ändern & Reset per E-Mail
-   Geschützter Profil-Bereich

### Fahrzeug-Management

-   Erweiterte Suchfunktion mit Filtern
-   Detailansicht mit Bildergalerie
-   Verfügbarkeitsprüfung

### Buchungssystem

-   Mehrstufiger Buchungsprozess
-   Realtime-Preisberechnung
-   Buchungsbestätigung

### UI/UX

-   Responsive Design für alle Geräte
-   Material Tailwind Komponenten
-   Toast-Benachrichtigungen
-   Loading States

## 📦 Dependencies

```json
{
    "@heroicons/react": "^2.0.18",
    "@material-tailwind/react": "^2.1.2",
    "next": "^13.4.0",
    "react": "^18",
    "react-dom": "^18"
}
```

## 🔧 Konfiguration

### API Endpoints (src/config/api.ts)

```typescript
const API_BASE_URL = 'http://localhost:3001/api';
```

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🎨 Styling

Das Projekt verwendet **Tailwind CSS** mit **Material Tailwind** Komponenten:

-   Konsistente Blue-Gray Farbpalette
-   Responsive Grid-System
-   Custom Material Design Komponenten

## 📱 Browser Support

Unterstützt moderne Browser:

-   Chrome (letzte 2 Versionen)
-   Firefox (letzte 2 Versionen)
-   Safari (letzte 2 Versionen)
-   Edge (letzte 2 Versionen)

## 🚀 Deployment

```bash
# Production Build erstellen
npm run build

# Build testen
npm run start

# Statische Export (optional)
npm run export
```

---

Entwickelt mit ❤️ von **Jannis Köllner** und **Hai Viet Vu**

-   Documentation is [here](https://www.material-tailwind.com/docs/react/installation?ref=readme-ntpp)
-   [License Agreement](https://www.creative-tim.com/license?ref=readme-ntpp)
-   [Support](https://www.creative-tim.com/contact-us?ref=readme-ntpp)
-   Issues: [Github Issues Page](https://github.com/creativetimofficial/nextjs-tailwind-course-landing-page/issues)
-   [Nepcha Analytics](https://nepcha.com?ref=readme) - Analytics tool for your website

## Reporting Issues

We use GitHub Issues as the official bug tracker for the Nextjs Tailwind Course Landing Page. Here are some advices for our users that want to report an issue:

1. Make sure that you are using the latest version of the Nextjs Tailwind Course Landing Page. Check the CHANGELOG from your dashboard on our [website](https://www.creative-tim.com/product/nextjs-tailwind-course-landing-page?ref=readme-ntpp).
2. Providing us reproducible steps for the issue will shorten the time it takes for it to be fixed.
3. Some issues may be browser specific, so specifying in what browser you encountered the issue might help.

## Technical Support or Questions

If you have questions or need help integrating the product please [contact us](https://www.creative-tim.com/contact-us?ref=readme-ntpp) instead of opening an issue.

## Licensing

-   Copyright 2023 [Creative Tim](https://www.creative-tim.com?ref=readme-ntpp)
-   Creative Tim [license](https://www.creative-tim.com/license?ref=readme-ntpp)

## Useful Links

-   [More products](https://www.creative-tim.com/templates?ref=readme-ntpp) from Creative Tim

-   [Tutorials](https://www.youtube.com/channel/UCVyTG4sCw-rOvB9oHkzZD1w)

-   [Freebies](https://www.creative-tim.com/bootstrap-themes/free?ref=readme-ntpp) from Creative Tim

-   [Affiliate Program](https://www.creative-tim.com/affiliates/new?ref=readme-ntpp) (earn money)

##### Social Media

Twitter: <https://twitter.com/CreativeTim>

Facebook: <https://www.facebook.com/CreativeTim>

Dribbble: <https://dribbble.com/creativetim>

Google+: <https://plus.google.com/+CreativetimPage>

Instagram: <https://instagram.com/creativetimofficial>
