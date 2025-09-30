# 🚐 Wohnmobilverleih Platform

Eine moderne, vollständige Wohnmobilverleih-Webapplikation mit Next.js Frontend und Express.js Backend.

## 📋 Projektübersicht

Diese Anwendung ermöglicht es Nutzern, Wohnmobile zu suchen, Details anzuzeigen und Buchungen durchzuführen. Die Plattform bietet eine intuitive Benutzeroberfläche für die Fahrzeugsuche mit erweiterten Filtern und einen kompletten Buchungsprozess.

## ✨ Features

-   **🔍 Erweiterte Fahrzeugsuche** mit Filtern (Ort, Datum, Personenanzahl)
-   **📱 Responsive Design** für alle Geräte
-   **🏠 Fahrzeug-Detailseiten** mit Bildergalerie und Ausstattungsübersicht
-   **📅 Buchungsprozess** mit Verfügbarkeitsprüfung
-   **💰 Realtime-Preisberechnung** mit Extras
-   **✅ Buchungsbestätigung** mit vollständiger Übersicht
-   **🗄️ PostgreSQL Datenbank** für sichere Datenspeicherung
-   **🔒 API-Validierung** und Fehlerbehandlung

## 🏗️ Technologie-Stack

### Frontend

-   **Framework:** Next.js 13.4.0 (React 18)
-   **Styling:** Tailwind CSS 3.x + Material Tailwind
-   **Sprache:** TypeScript 5.x
-   **Icons:** Heroicons 2.0.18

### Backend

-   **Runtime:** Node.js
-   **Framework:** Express.js 5.1.0
-   **Datenbank:** PostgreSQL
-   **Authentifizierung:** JWT (bcryptjs 3.0.2)
-   **Environment:** dotenv 17.2.2

### Datenbank

-   **System:** PostgreSQL
-   **ORM/Client:** node-postgres (pg 8.16.3)

## 📦 Installation & Setup

### Voraussetzungen

-   Node.js (Version 16 oder höher)
-   PostgreSQL
-   npm oder yarn

### 1. Repository klonen

```bash
git clone https://github.com/SCA24WWI/Wohnmobilverleih.git
cd Wohnmobilverleih
```

### 2. Backend Setup

```bash
cd backend

# Dependencies installieren
npm install

# Umgebungsvariablen konfigurieren
cp .env.example .env
# .env Datei mit Ihren Datenbankdaten anpassen
```

#### Backend Dependencies

```json
{
    "bcryptjs": "^3.0.2", // Passwort-Hashing
    "cors": "^2.8.5", // Cross-Origin Resource Sharing
    "dotenv": "^17.2.2", // Umgebungsvariablen
    "express": "^5.1.0", // Web-Framework
    "jsonwebtoken": "^9.0.2", // JWT Authentifizierung
    "pg": "^8.16.3" // PostgreSQL Client
}
```

### 3. Datenbank Setup

```bash
# PostgreSQL Datenbank erstellen
createdb wohnmobil_db

# Schema und Testdaten importieren
psql wohnmobil_db < database/init.sql
```

### 4. Frontend Setup

```bash
cd ../frontend

# Dependencies installieren
npm install
```

#### Frontend Dependencies

```json
{
    "dependencies": {
        "@heroicons/react": "2.0.18", // Icon-Sammlung
        "@material-tailwind/react": "2.1.2", // UI-Komponenten
        "next": "13.4.0", // React Framework
        "react": "18", // React Library
        "react-dom": "18" // React DOM
    },
    "devDependencies": {
        "@types/node": "20", // Node.js Typen
        "@types/react": "18.2.42", // React TypeScript Typen
        "@types/react-dom": "18", // React DOM Typen
        "autoprefixer": "10", // CSS Autoprefixer
        "eslint": "8", // Code Linting
        "eslint-config-next": "13.5.4", // Next.js ESLint Config
        "postcss": "8", // CSS Processing
        "tailwindcss": "3", // CSS Framework
        "typescript": "5" // TypeScript Compiler
    }
}
```

## 🚀 Entwicklung starten

### Backend starten (Port 3001)

```bash
cd backend
npm start
# oder für Development mit Auto-Reload:
npm run dev
```

### Frontend starten (Port 3000)

```bash
cd frontend
npm run dev
```

### Anwendung öffnen

-   **Frontend:** http://localhost:3000
-   **Backend API:** http://localhost:3001/api

## 📁 Projektstruktur

```
Wohnmobilverleih/
├── backend/
│   ├── src/
│   │   ├── config/          # Datenbank-Konfiguration
│   │   ├── controllers/     # API-Controller
│   │   ├── middleware/      # Express Middleware
│   │   ├── models/          # Datenmodelle
│   │   ├── routes/          # API-Routen
│   │   ├── utils/           # Hilfsfunktionen
│   │   └── server.js        # Server-Einstiegspunkt
│   ├── .env                 # Umgebungsvariablen
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   │   ├── wohnmobile/  # Fahrzeug-Seiten
│   │   │   ├── buchung/     # Buchungs-Seiten
│   │   │   └── globals.css  # Globale Styles
│   │   ├── components/      # React Komponenten
│   │   └── config/          # API-Konfiguration
│   └── package.json
├── database/
│   └── init.sql            # Datenbank-Schema & Testdaten
└── docker-compose.yml      # Docker-Konfiguration
```

## 🔗 API-Endpunkte

### Fahrzeuge

-   `GET /api/vehicles/search` - Fahrzeuge suchen mit Filtern
-   `GET /api/vehicles/:id` - Einzelnes Fahrzeug abrufen

### Buchungen

-   `POST /api/bookings` - Neue Buchung erstellen
-   `GET /api/bookings/check-availability` - Verfügbarkeit prüfen
-   `GET /api/bookings/:id` - Buchungsdetails abrufen

### Benutzer

-   `POST /api/auth/register` - Benutzer registrieren
-   `POST /api/auth/login` - Benutzer anmelden

## 🌍 Umgebungsvariablen

### Backend (.env)

```env
# Server
PORT=3001
NODE_ENV=development

# Datenbank
DB_HOST=localhost
DB_PORT=5432
DB_USER=app_user
DB_PASSWORD=sicheres_passwort
DB_NAME=wohnmobil_db

# JWT
JWT_SECRET=dein-super-sicherer-secret-key
JWT_EXPIRES_IN=90d
```

## 🎯 Verwendung

1. **Fahrzeuge durchsuchen:** Besuchen Sie die Startseite und nutzen Sie die Suchfunktion
2. **Details anzeigen:** Klicken Sie auf "Details" bei einem Fahrzeug
3. **Buchung durchführen:** Füllen Sie das Buchungsformular aus
4. **Bestätigung erhalten:** Nach erfolgreicher Buchung erhalten Sie eine Bestätigungsseite

## 🧪 Testing

```bash
# Frontend Tests
cd frontend
npm run lint

# Backend Tests
cd backend
npm test
```

## 📊 Datenbank-Schema

### Haupttabellen:

-   **benutzer** - Benutzerdaten und Authentifizierung
-   **wohnmobile** - Fahrzeuginformationen
-   **buchungen** - Buchungsdetails mit JSONB für Extras

## 🤝 Beitrag leisten

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.

## 👥 Team

-   **Entwicklung:** SCA24WWI Team
-   **Frontend:** Next.js & TypeScript
-   **Backend:** Node.js & Express
-   **Datenbank:** PostgreSQL

## 🆘 Support

Bei Fragen oder Problemen:

1. Überprüfen Sie die [Issues](https://github.com/SCA24WWI/Wohnmobilverleih/issues)
2. Erstellen Sie ein neues Issue
3. Kontaktieren Sie das Entwicklungsteam

---

**🚐 Happy Camping! 🏕️**
