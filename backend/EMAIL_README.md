# E-Mail System - Backend Dokumentation

## Überblick

Das E-Mail-System für Buchungsbestätigungen wurde vollständig implementiert mit einer sauberen Controller-Struktur.

## Projektstruktur

```
backend/src/
├── controllers/
│   ├── emailController.js          # E-Mail Controller (NEU)
│   └── bookingController.js        # Erweitert um E-Mail-Versand
├── utils/
│   └── emailService.js             # E-Mail Service Klasse
├── routes/
│   └── emailRoutes.js              # E-Mail API Endpunkte
└── server.js                       # Erweitert um E-Mail Routes
```

## API Endpunkte

### E-Mail Konfiguration testen

```http
GET /api/email/test-config
```

**Response:**

```json
{
    "success": true,
    "message": "E-Mail-Konfiguration überprüft",
    "config": {
        "emailUser": true,
        "emailPassword": true,
        "emailFrom": true,
        "nodeEnv": "development"
    },
    "ready": true
}
```

### Test-E-Mail versenden

```http
POST /api/email/test-email
Content-Type: application/json

{
  "email": "test@example.com"
}
```

### Buchungsbestätigung erneut versenden

```http
POST /api/email/resend-confirmation/123
```

### E-Mail Vorschau anzeigen (NEU)

```http
GET /api/email/preview-confirmation/123
```

Zeigt die HTML-Vorschau der Buchungsbestätigung im Browser an.

## Setup

### 1. E-Mail-Konfiguration

Bearbeiten Sie die `.env` Datei im Backend:

#### Gmail Setup (empfohlen)

```env
# Gmail Konfiguration
EMAIL_USER=ihre-email@gmail.com
EMAIL_PASSWORD=ihr-16-stelliges-app-passwort
EMAIL_FROM=ihre-email@gmail.com
```

**Gmail App-Passwort erstellen:**

1. Gehen Sie zu [myaccount.google.com](https://myaccount.google.com)
2. Klicken Sie auf "Sicherheit"
3. Aktivieren Sie "Bestätigung in zwei Schritten"
4. Suchen Sie nach "App-Passwörter"
5. Wählen Sie "Mail" als App aus
6. Kopieren Sie das 16-stellige Passwort

#### Andere E-Mail Provider

Auskommentieren und anpassen:

```env
# Outlook
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=ihre-email@outlook.com
EMAIL_PASSWORD=ihr-passwort
```

### 2. Server starten

```bash
cd backend
npm run dev
```

### 3. System testen

```bash
# Konfiguration prüfen
curl http://localhost:3001/api/email/test-config

# Test-E-Mail senden
curl -X POST http://localhost:3001/api/email/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "ihre-email@gmail.com"}'
```

## Funktionsweise

### Automatischer E-Mail-Versand

1. **Buchung erstellt** → `BookingController.createBooking()`
2. **Daten gespeichert** → Buchung in PostgreSQL gespeichert
3. **E-Mail versendet** → `EmailService.sendBookingConfirmation()`
4. **Fehlerbehandlung** → E-Mail-Fehler blockieren Buchung nicht

### E-Mail-Template

-   **Responsive HTML-Design**
-   **Vollständige Buchungsdetails**
-   **Corporate Branding** (anpassbar)
-   **Kontaktinformationen**
-   **Wichtige Hinweise**

## Anpassungen

### Template personalisieren

In `src/utils/emailService.js`:

-   Firmenlogo hinzufügen
-   Farben anpassen
-   Kontaktdaten aktualisieren
-   Rechtliche Hinweise ergänzen

### Zusätzliche E-Mail-Typen

Erweitern Sie den `EmailController` für:

-   Buchungserinnerungen
-   Stornierungsbestätigungen
-   Marketing-E-Mails

## Sicherheit

### Produktionsempfehlungen

1. **Ratenbegrenzung** implementieren
2. **SMTP-Authentifizierung** verwenden
3. **SSL/TLS** aktivieren
4. **E-Mail-Logs** überwachen

### Datenschutz (DSGVO)

-   E-Mail-Adressen sicher speichern
-   Einwilligungen dokumentieren
-   Abmeldefunktion bereitstellen

## Troubleshooting

### Häufige Probleme

#### "Authentication failed"

-   Gmail: App-Passwort statt normales Passwort verwenden
-   Andere Provider: SMTP-Einstellungen prüfen

#### E-Mails landen im Spam

-   SPF/DKIM Records einrichten
-   Absender-Reputation prüfen
-   E-Mail-Inhalt optimieren

#### "Connection timeout"

-   Firewall-Einstellungen prüfen
-   SMTP-Port und Sicherheit prüfen
-   Provider-spezifische Einstellungen

### Debug-Modus

```env
NODE_ENV=development
```

Aktiviert detaillierte Logs in der Konsole.

## Support

Bei Problemen:

1. **Test-Endpoints** verwenden
2. **Console-Logs** prüfen
3. **Provider-Dokumentation** konsultieren
