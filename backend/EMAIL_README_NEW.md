# 📧 E-Mail Backend - Vanlife Süd

Backend-Service für E-Mail-Versand mit Nodemailer und Gmail SMTP.

## 🚀 Quick Setup

### 1. Gmail App-Passwort

```bash
# Google Account → Sicherheit → 2-FA → App-Passwörter
```

### 2. Backend .env

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM="Vanlife Süd <noreply@vanlife-sued.de>"
```

### 3. Testen

```bash
# Konfiguration prüfen
curl http://localhost:3001/api/email/test-config

# Test-E-Mail
curl -X POST http://localhost:3001/api/email/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

## 📁 Code Struktur

```javascript
// utils/emailService.js - SMTP Service
class EmailService {
  async sendEmail(to, subject, text, html)
  async sendBookingConfirmation(booking, user)
  async sendPasswordResetEmail(email, resetToken)
}

// controllers/emailController.js - API Endpoints
app.get('/api/email/test-config')
app.post('/api/email/test-email')

// controllers/authController.js - Passwort Reset
app.post('/api/auth/request-password-reset')
```

## ✨ Features

-   ✅ **Buchungsbestätigungen** (automatisch bei neuer Buchung)
-   ✅ **Passwort-Reset** E-Mails mit sicheren Tokens
-   ✅ **Development Fallback** (Console-Output ohne SMTP)
-   ✅ **HTML Templates** mit responsive Design

## 🔧 Development

Ohne E-Mail-Konfiguration werden E-Mails in der Konsole ausgegeben:

```
📧 E-Mail würde gesendet werden an: user@example.com
Betreff: Buchungsbestätigung
```

## 🐛 Troubleshooting

| Problem               | Lösung                               |
| --------------------- | ------------------------------------ |
| "Invalid credentials" | App-Passwort statt normales Passwort |
| E-Mails im Spam       | SPF/DKIM Records einrichten          |
| "Connection timeout"  | Firewall/Port 587 prüfen             |

---

📧 **E-Mail Service ready!**
