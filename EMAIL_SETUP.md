# E-Mail Buchungsbestätigung - Implementierungsdokumentation

## Übersicht

Das E-Mail-System sendet automatisch Buchungsbestätigungen an Kunden nach einer erfolgreichen Buchung. Die E-Mails enthalten alle relevanten Buchungsdetails in einem professionellen HTML-Format.

## Implementierte Funktionen

### 1. Automatische Buchungsbestätigung

-   **Trigger**: Nach jeder erfolgreichen Buchung
-   **Empfänger**: E-Mail-Adresse des Kunden aus der Rechnungsadresse
-   **Inhalt**: Vollständige Buchungsdetails mit HTML-Formatierung

### 2. E-Mail-Template

-   **Format**: Professionelles HTML-Design
-   **Inhalte**:
    -   Buchungsnummer
    -   Fahrzeugdaten (Name, Modell)
    -   Zeitraum (Abhol- und Rückgabedatum)
    -   Anzahl Nächte
    -   Zusatzleistungen (Extras, Versicherung, Zahlungsmethode)
    -   Gesamtpreis
    -   Kontaktinformationen
    -   Wichtige Hinweise

### 3. Fehlerbehandlung

-   E-Mail-Fehler blockieren die Buchung **nicht**
-   Fehler werden in der Konsole protokolliert
-   Buchung wird erfolgreich abgeschlossen, auch wenn E-Mail fehlschlägt

## Setup-Anleitung

### Schritt 1: E-Mail-Provider konfigurieren

#### Gmail (empfohlen für Entwicklung)

1. Gehen Sie zu [Google-Konto Einstellungen](https://myaccount.google.com)
2. Navigieren Sie zu "Sicherheit"
3. Aktivieren Sie "Bestätigung in zwei Schritten"
4. Erstellen Sie ein "App-Passwort":
    - Suchen Sie nach "App-Passwörter"
    - Wählen Sie "Mail" als App
    - Kopieren Sie das 16-stellige Passwort

#### .env Datei aktualisieren

```env
# Gmail Konfiguration
EMAIL_USER=ihre-email@gmail.com
EMAIL_PASSWORD=ihr-16-stelliges-app-passwort
EMAIL_FROM=ihre-email@gmail.com
```

### Schritt 2: Alternative E-Mail-Provider

#### Outlook/Hotmail

```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=ihre-email@outlook.com
EMAIL_PASSWORD=ihr-passwort
```

#### Eigener SMTP-Server

```env
EMAIL_HOST=mail.ihredomain.de
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=buchungen@ihredomain.de
EMAIL_PASSWORD=ihr-passwort
```

### Schritt 3: E-Mail-Service anpassen

Bearbeiten Sie `src/utils/emailService.js` für:

-   **Firmenadresse** im Template
-   **Kontaktdaten** (Telefon, E-Mail)
-   **Öffnungszeiten**
-   **Corporate Design** (Farben, Logo)

## Test-Endpoints

### E-Mail-Konfiguration testen

```
GET /api/email/test-config
```

Prüft, ob alle E-Mail-Umgebungsvariablen gesetzt sind.

### Test-E-Mail versenden

```
POST /api/email/test-email
Content-Type: application/json

{
  "email": "test@example.com"
}
```

### Buchungsbestätigung erneut versenden

```
POST /api/email/resend-confirmation/123
```

Versendet die Buchungsbestätigung für Buchung ID 123 erneut.

## Sicherheitshinweise

### 1. E-Mail-Credentials

-   **Niemals** echte Passwörter im Code speichern
-   Verwenden Sie App-Passwörter für Gmail
-   Überprüfen Sie `.env` in `.gitignore`

### 2. Ratenbegrenzung

```javascript
// Für Produktionsumgebung empfohlen:
const rateLimit = require('express-rate-limit');

const emailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minuten
    max: 10, // max 10 E-Mails pro IP
    message: 'Zu viele E-Mail-Anfragen'
});

app.use('/api/email', emailLimiter);
```

## Troubleshooting

### Problem: E-Mails werden nicht versendet

#### 1. Konfiguration prüfen

```bash
GET /api/email/test-config
```

#### 2. Test-E-Mail senden

```bash
POST /api/email/test-email
{
  "email": "ihre-email@gmail.com"
}
```

#### 3. Häufige Fehler

-   **Gmail**: App-Passwort statt normalem Passwort verwenden
-   **Firmen-E-Mail**: SMTP-Einstellungen vom IT-Team erfragen
-   **Umlaute**: UTF-8 Encoding prüfen

### Problem: E-Mails landen im Spam

#### 1. SPF-Record hinzufügen

```dns
v=spf1 include:_spf.google.com ~all
```

#### 2. DKIM konfigurieren

Für eigene Domains SPF und DKIM-Records einrichten.

#### 3. E-Mail-Inhalte optimieren

-   Weniger Bilder verwenden
-   Spam-Keywords vermeiden
-   Text-zu-HTML-Verhältnis beachten

## Erweiterte Funktionen (optional)

### 1. E-Mail-Templates anpassen

Erstellen Sie verschiedene Templates:

-   Buchungsbestätigung
-   Buchungserinnerung (24h vor Abholung)
-   Rückgabeerinnerung
-   Stornierungsbestätigung

### 2. PDF-Anhang hinzufügen

```javascript
const PDFDocument = require('pdfkit');

// PDF-Rechnung erstellen und anhängen
const doc = new PDFDocument();
// ... PDF-Generierung
mailOptions.attachments = [
    {
        filename: 'buchungsbestaetigung.pdf',
        content: doc
    }
];
```

### 3. E-Mail-Status verfolgen

```javascript
// E-Mail-Status in Datenbank speichern
const emailLogResult = await pool.query(
    'INSERT INTO email_log (booking_id, email_type, status, sent_at) VALUES ($1, $2, $3, NOW())',
    [bookingId, 'confirmation', 'sent']
);
```

## Produktionshinweise

### 1. E-Mail-Queue implementieren

```javascript
const Queue = require('bull');
const emailQueue = new Queue('email processing');

emailQueue.process('confirmation', async (job) => {
    const { bookingData } = job.data;
    await emailService.sendBookingConfirmation(bookingData);
});
```

### 2. Monitoring

-   E-Mail-Erfolgsrate überwachen
-   Fehlerprotokollierung implementieren
-   Delivery-Berichte einrichten

### 3. Backup-Provider

Konfigurieren Sie einen Backup-E-Mail-Provider für Ausfälle:

```javascript
const primaryProvider = new EmailService();
const backupProvider = new BackupEmailService();

try {
    await primaryProvider.send(mailData);
} catch (error) {
    await backupProvider.send(mailData);
}
```

## Datenschutz (DSGVO)

### E-Mail-Speicherung

-   E-Mail-Inhalte nicht länger als nötig speichern
-   Kunden-Einwilligung für Marketing-E-Mails einholen
-   Abmeldefunktion implementieren

## Support

Bei Problemen:

1. Test-Endpoints verwenden
2. Logs in der Konsole prüfen
3. E-Mail-Provider-Dokumentation konsultieren
