# 🚐 Vanlife Süd - Wohnmobil Buchungsplattform

Moderne Wohnmobil-Buchungsplattform mit Next.js Frontend, Express.js Backend und PostgreSQL Datenbank.

## ✨ Features

-   🔍 **Fahrzeugsuche** mit erweiterten Filtern
-   📅 **Online-Buchung** mit Verfügbarkeitsprüfung
-   👤 **Benutzeraccounts** mit JWT-Authentifizierung
-   📧 **E-Mail-System** für Buchungsbestätigungen
-   🔑 **Passwort-Reset** mit E-Mail-Versand
-   📱 **Responsive Design** für alle Geräte

## 🏗️ Tech Stack

**Frontend:** Next.js 13 + TypeScript + Tailwind CSS + Material Tailwind  
**Backend:** Node.js + Express.js + PostgreSQL  
**Auth:** JWT + bcrypt  
**E-Mail:** Nodemailer

## � Quick Start

### Mit Docker (empfohlen)

```bash
git clone https://github.com/SCA24WWI/Wohnmobilverleih.git
cd Wohnmobilverleih
docker-compose up -d
```

### Manuell

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev
```

**URLs:** Frontend: http://localhost:3000 | Backend: http://localhost:3001

## 📁 Projektstruktur

```
├── backend/           # Express.js API Server
│   ├── src/
│   │   ├── controllers/   # API Controller
│   │   ├── routes/       # Express Routes
│   │   ├── middleware/   # Auth & Error Handling
│   │   └── utils/        # E-Mail Service
│   └── server.js
├── frontend/          # Next.js React App
│   ├── src/
│   │   ├── app/          # App Router (Pages)
│   │   ├── components/   # React Komponenten
│   │   └── contexts/     # Auth Context
│   └── package.json
├── database/          # PostgreSQL Setup
│   └── init.sql
└── docker-compose.yml
```

## 🔗 API Endpunkte

### Authentifizierung

-   `POST /api/auth/login` - Benutzer anmelden
-   `POST /api/auth/register` - Benutzer registrieren
-   `POST /api/auth/change-password` - Passwort ändern
-   `POST /api/auth/request-password-reset` - Passwort-Reset anfordern

### Fahrzeuge & Buchungen

-   `GET /api/vehicles/search` - Fahrzeuge suchen
-   `GET /api/vehicles/:id` - Fahrzeug-Details
-   `POST /api/bookings` - Buchung erstellen
-   `GET /api/bookings/user/:userId` - Benutzer-Buchungen

## ⚙️ Konfiguration

### Backend (.env)

```env
PORT=3001
DB_HOST=localhost
DB_USER=app_user
DB_PASSWORD=sicheres_passwort
DB_NAME=wohnmobil_db
JWT_SECRET=your-jwt-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### E-Mail Setup

Für Gmail App-Passwort erforderlich. Siehe `EMAIL_SETUP.md` für Details.

## �️ Datenbank

**Haupttabellen:**

-   `benutzer` - User-Management mit Passwort-Hashing
-   `wohnmobile` - Fahrzeugdaten mit Bildern & Ausstattung
-   `buchungen` - Buchungen mit JSON-Extras

## 👥 Team

Entwickelt von **Jannis Köllner** und **Hai Viet Vu** im Rahmen des SCA24WWI Projekts.

## 📄 Lizenz

MIT License - siehe LICENSE für Details.

---

🚐 **Happy Camping!** 🏕️
