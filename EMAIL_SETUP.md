# 📧 E-Mail System - Vanlife Süd

E-Mail-Service für Buchungsbestätigungen und Passwort-Reset mit Gmail SMTP Integration.

## ✨ Features

-   📤 **Buchungsbestätigungen** per E-Mail
-   🔑 **Passwort-Reset** Links per E-Mail
-   🧪 **E-Mail Testing** Endpunkte
-   🔄 **Fallback-Logging** für Development

## 🚀 Setup

### 1. Gmail App-Passwort erstellen

1. Google Account → **2-Faktor-Authentifizierung** aktivieren
2. **App-Passwörter** → Neues App-Passwort generieren
3. App-Passwort kopieren (16 Zeichen)

### 2. Environment Variablen (.env)

```env
# E-Mail Konfiguration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM="Vanlife Süd <noreply@vanlife-sued.de>"
```

## 📁 Projektstruktur

```
backend/src/
├── controllers/
│   ├── emailController.js     # E-Mail API Controller
│   └── authController.js      # Passwort-Reset Integration
├── utils/
│   └── emailService.js        # Gmail SMTP Service
├── routes/
│   └── emailRoutes.js         # E-Mail Test Endpunkte
└── server.js
```

## 🔗 API Endpunkte

### Test E-Mail Konfiguration

```http
GET /api/email/test-config
```

### Test E-Mail versenden

```http
POST /api/email/test-email
Content-Type: application/json

{
  "to": "test@example.com",
  "subject": "Test E-Mail",
  "text": "Test Nachricht"
}
```

### Buchungsbestätigung versenden

Automatisch beim Erstellen einer Buchung über `/api/bookings`

### Passwort-Reset E-Mail

```http
POST /api/auth/request-password-reset
Content-Type: application/json

{
  "email": "user@example.com"
}
```

## 🛠️ Development

### Fallback für lokale Entwicklung

Ohne E-Mail-Konfiguration werden E-Mails in der Konsole ausgegeben:

```
📧 E-Mail würde gesendet werden an: user@example.com
Betreff: Passwort zurücksetzen
Inhalt: [E-Mail HTML Content]
```

### E-Mail Templates

-   **Buchungsbestätigung**: Vollständige Buchungsdetails mit Kundeninformationen
-   **Passwort-Reset**: Sicherer Link mit 1h Gültigkeit

## 🔧 Troubleshooting

### Häufige Probleme

-   **"Invalid credentials"** → App-Passwort statt normalem Passwort verwenden
-   **"Less secure apps"** → 2-Faktor-Auth + App-Passwort erforderlich
-   **E-Mails kommen nicht an** → Spam-Ordner prüfen

### Debug-Modus

```env
NODE_ENV=development
```

Zeigt detaillierte E-Mail-Logs in der Konsole.

---

Entwickelt mit ❤️ von **Jannis Köllner** und **Hai Viet Vu**
