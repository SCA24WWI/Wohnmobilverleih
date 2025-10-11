const nodemailer = require('nodemailer');

/**
 * E-Mail Service für Wohnmobil-Verleih
 * Versendet Buchungsbestätigungen und andere E-Mails
 */
class EmailService {
    constructor() {
        // Transporter für E-Mail-Versand konfigurieren
        this.transporter = nodemailer.createTransport({
            // Gmail-Konfiguration (kann für andere Provider angepasst werden)
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    /**
     * Buchungsbestätigung per E-Mail versenden
     */
    async sendBookingConfirmation(bookingData) {
        try {
            const {
                email,
                vorname,
                nachname,
                vehicle_name,
                modell,
                start_datum,
                end_datum,
                anzahl_naechte,
                gesamtpreis,
                extras,
                id: buchungId
            } = bookingData;

            const startDate = new Date(start_datum).toLocaleDateString('de-DE');
            const endDate = new Date(end_datum).toLocaleDateString('de-DE');

            // Extras für die E-Mail formatieren
            const extrasText = this.formatExtrasForEmail(extras);

            const htmlContent = this.generateBookingConfirmationHTML({
                vorname,
                nachname,
                buchungId,
                vehicle_name,
                modell,
                startDate,
                endDate,
                anzahl_naechte,
                gesamtpreis,
                extrasText
            });

            const mailOptions = {
                from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                to: email,
                subject: `Buchungsbestätigung - ${vehicle_name} (Buchung #${buchungId})`,
                html: htmlContent,
                attachments: []
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Buchungsbestätigung versendet:', info.messageId);

            return {
                success: true,
                messageId: info.messageId
            };
        } catch (error) {
            console.error('Fehler beim Versenden der Buchungsbestätigung:', error);
            throw new Error('E-Mail konnte nicht versendet werden: ' + error.message);
        }
    }

    /**
     * HTML-Template für Buchungsbestätigung generieren
     */
    generateBookingConfirmationHTML(data) {
        return `
        <!DOCTYPE html>
        <html lang="de">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Buchungsbestätigung</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    background-color: #2563eb;
                    color: white;
                    padding: 20px;
                    text-align: center;
                    border-radius: 8px 8px 0 0;
                }
                .content {
                    background-color: #f9fafb;
                    padding: 30px;
                    border: 1px solid #e5e7eb;
                    border-radius: 0 0 8px 8px;
                }
                .booking-details {
                    background-color: white;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 6px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }
                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #f3f4f6;
                }
                .detail-label {
                    font-weight: bold;
                    color: #4b5563;
                }
                .total-price {
                    font-size: 1.2em;
                    font-weight: bold;
                    color: #059669;
                    text-align: center;
                    margin-top: 15px;
                    padding: 10px;
                    background-color: #ecfdf5;
                    border-radius: 4px;
                }
                .footer {
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #e5e7eb;
                    color: #6b7280;
                    font-size: 0.9em;
                }
                .contact-info {
                    background-color: #eff6ff;
                    padding: 15px;
                    border-radius: 4px;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🚐 Buchungsbestätigung</h1>
                <p>Vielen Dank für Ihre Buchung!</p>
            </div>
            
            <div class="content">
                <h2>Hallo ${data.vorname} ${data.nachname}!</h2>
                
                <p>Ihre Buchung wurde erfolgreich bestätigt. Hier sind alle Details:</p>
                
                <div class="booking-details">
                    <h3>📋 Buchungsdetails</h3>
                    
                    <div class="detail-row">
                        <span class="detail-label">Buchungsnummer:</span>
                        <span>#${data.buchungId}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Fahrzeug:</span>
                        <span>${data.vehicle_name} ${data.modell}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Abholdatum:</span>
                        <span>${data.startDate}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Rückgabedatum:</span>
                        <span>${data.endDate}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Anzahl Nächte:</span>
                        <span>${data.anzahl_naechte}</span>
                    </div>
                    
                    ${data.extrasText}
                    
                    <div class="total-price">
                        Gesamtpreis: ${data.gesamtpreis}€
                    </div>
                </div>
                
                <div class="contact-info">
                    <h3>📞 Kontakt & Abholung</h3>
                    <p><strong>Abholzeit:</strong> Montag-Freitag: 9:00-18:00 Uhr, Samstag: 9:00-16:00 Uhr</p>
                    <p><strong>Adresse:</strong> [Ihre Firmenadresse hier einfügen]</p>
                    <p><strong>Telefon:</strong> [Ihre Telefonnummer]</p>
                    <p><strong>E-Mail:</strong> [Ihre E-Mail-Adresse]</p>
                </div>
                
                <p><strong>Wichtige Hinweise:</strong></p>
                <ul>
                    <li>Bringen Sie bitte einen gültigen Führerschein und Ausweis zur Abholung mit</li>
                    <li>Das Fahrzeug wird vollgetankt übergeben und sollte vollgetankt zurückgegeben werden</li>
                    <li>Bei Fragen können Sie uns jederzeit kontaktieren</li>
                </ul>
                
                <div class="footer">
                    <p>Diese E-Mail wurde automatisch generiert. Bei Fragen wenden Sie sich gerne an unser Team.</p>
                    <p>Wir freuen uns auf Ihren Besuch!</p>
                    <p>Ihr Wohnmobil-Verleih Team</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    /**
     * Extras für E-Mail formatieren (Hilfsmethode)
     */
    formatExtrasForEmail(extras) {
        let extrasText = '';
        if (extras) {
            const parsedExtras = typeof extras === 'string' ? JSON.parse(extras) : extras;

            if (parsedExtras.extras && parsedExtras.extras.length > 0) {
                extrasText += '<h3>Zusatzleistungen:</h3><ul>';
                parsedExtras.extras.forEach((extra) => {
                    extrasText += `<li>${extra.name} - ${extra.preis}€</li>`;
                });
                extrasText += '</ul>';
            }

            if (parsedExtras.versicherung) {
                extrasText += `<h3>Versicherung:</h3><p>${parsedExtras.versicherung.name} - ${parsedExtras.versicherung.preis}€</p>`;
            }

            if (parsedExtras.zahlungsmethode) {
                extrasText += `<h3>Zahlungsmethode:</h3><p>${parsedExtras.zahlungsmethode}</p>`;
            }
        }
        return extrasText;
    }

    /**
     * Test-E-Mail versenden (für Debugging)
     */
    async sendTestEmail(recipientEmail) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                to: recipientEmail,
                subject: 'Test E-Mail - Wohnmobil-Verleih System',
                html: `
                    <h2>Test E-Mail</h2>
                    <p>Dies ist eine Test-E-Mail vom Wohnmobil-Verleih System.</p>
                    <p>Wenn Sie diese E-Mail erhalten, funktioniert der E-Mail-Service korrekt.</p>
                    <p>Zeitstempel: ${new Date().toLocaleString('de-DE')}</p>
                `
            };

            const info = await this.transporter.sendMail(mailOptions);
            return {
                success: true,
                messageId: info.messageId
            };
        } catch (error) {
            console.error('Fehler beim Versenden der Test-E-Mail:', error);
            throw error;
        }
    }
}

module.exports = EmailService;
