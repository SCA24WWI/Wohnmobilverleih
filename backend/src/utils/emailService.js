const nodemailer = require('nodemailer');

/**
 * E-Mail Service für Vanlife Süd
 * Versendet Buchungsbestätigungen und andere E-Mails
 */
class EmailService {
    constructor() {
        // Transporter für E-Mail-Versand konfigurieren
        this.transporter = nodemailer.createTransport({
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

            // Extras für die E-Mail formatieren - DIREKT IMPLEMENTIERT
            let extrasText = '';
            console.log('Debug - Rohe Extras-Daten:', extras);

            if (extras) {
                const parsedExtras = typeof extras === 'string' ? JSON.parse(extras) : extras;
                console.log('Debug - Geparste Extras:', JSON.stringify(parsedExtras, null, 2));

                // Zusatzleistungen verarbeiten
                if (parsedExtras.extras && Array.isArray(parsedExtras.extras) && parsedExtras.extras.length > 0) {
                    console.log('Debug - Verarbeite Zusatzleistungen:', parsedExtras.extras.length);
                    extrasText += '<h3>📋 Zusatzleistungen:</h3><ul>';
                    parsedExtras.extras.forEach((extra, index) => {
                        console.log(`Debug - Extra ${index}:`, extra);

                        // Behandle sowohl String als auch Objekt-Format
                        if (typeof extra === 'string') {
                            // String-Format: "campingmoebel" -> "Campingmöbel"
                            const extraName = this.formatExtraName(extra);
                            extrasText += `<li>${extraName}</li>`;
                            console.log(`Debug - Extra (String) hinzugefügt: ${extraName}`);
                        } else if (extra && (extra.name || extra.title)) {
                            // Objekt-Format: {name: "GPS", preis: 5}
                            const name = extra.name || extra.title;
                            const preis = extra.preis || extra.price || 0;
                            if (preis > 0) {
                                extrasText += `<li>${name} - ${preis}€</li>`;
                            } else {
                                extrasText += `<li>${name}</li>`;
                            }
                            console.log(`Debug - Extra (Objekt) hinzugefügt: ${name} - ${preis}€`);
                        }
                    });
                    extrasText += '</ul>';
                }

                // Versicherung verarbeiten
                if (parsedExtras.versicherung) {
                    console.log('Debug - Verarbeite Versicherung:', parsedExtras.versicherung);
                    if (typeof parsedExtras.versicherung === 'string') {
                        extrasText += `<h3>🛡️ Versicherung:</h3><p>${parsedExtras.versicherung}</p>`;
                    } else if (parsedExtras.versicherung.name || parsedExtras.versicherung.title) {
                        const name = parsedExtras.versicherung.name || parsedExtras.versicherung.title;
                        const preis = parsedExtras.versicherung.preis || parsedExtras.versicherung.price;
                        if (preis) {
                            extrasText += `<h3>🛡️ Versicherung:</h3><p>${name} - ${preis}€</p>`;
                        } else {
                            extrasText += `<h3>🛡️ Versicherung:</h3><p>${name}</p>`;
                        }
                    }
                }

                // Zahlungsmethode verarbeiten
                if (parsedExtras.zahlungsmethode) {
                    console.log('Debug - Verarbeite Zahlungsmethode:', parsedExtras.zahlungsmethode);
                    let zahlungsmethode = '';
                    if (typeof parsedExtras.zahlungsmethode === 'string') {
                        zahlungsmethode = parsedExtras.zahlungsmethode;
                    } else if (parsedExtras.zahlungsmethode.name || parsedExtras.zahlungsmethode.title) {
                        zahlungsmethode = parsedExtras.zahlungsmethode.name || parsedExtras.zahlungsmethode.title;
                    }
                    if (zahlungsmethode) {
                        extrasText += `<h3>💳 Zahlungsmethode:</h3><p>${zahlungsmethode}</p>`;
                    }
                }
            }

            console.log('Debug - Finaler extrasText:', extrasText);
            console.log('Debug - extrasText Länge:', extrasText.length);

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
                    <p><strong>Adresse:</strong> Coblitzallee 1-9, 68163 Mannheim</p>
                    <p><strong>Telefon:</strong> +49 (0) 123 456 789</p>
                    <p><strong>E-Mail:</strong> vanlife.sued@gmail.com</p>
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
                    <p>Ihr Vanlife Süd Team</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    /**
     * Formatiert Extra-Namen von technischen Bezeichnungen zu benutzerfreundlichen Namen
     */
    formatExtraName(extraKey) {
        const extraNames = {
            campingmoebel: 'Campingmöbel',
            fahrradtraeger: 'Fahrradträger',
            grill: 'Grill',
            gps_navi: 'GPS Navigation',
            satelliten_tv: 'Satelliten TV',
            markise: 'Markise',
            solaranlage: 'Solaranlage',
            hecktraeger: 'Heckträger',
            zusaetlicher_tank: 'Zusätzlicher Wassertank',
            generator: 'Generator',
            kuehltasche: 'Kühltasche',
            campingtisch_stuehle: 'Campingtisch & Stühle',
            bettwaesche: 'Bettwäsche',
            handtuecher: 'Handtücher'
        };

        return extraNames[extraKey] || extraKey.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    }

    /**
     * Generische E-Mail-Versendung
     */
    async sendEmail(to, subject, htmlContent) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                to: to,
                subject: subject,
                html: htmlContent
            };

            console.log('Sende E-Mail mit Optionen:', {
                from: mailOptions.from,
                to: mailOptions.to,
                subject: mailOptions.subject
            });

            const info = await this.transporter.sendMail(mailOptions);
            console.log('E-Mail erfolgreich gesendet:', info.messageId);

            return {
                success: true,
                messageId: info.messageId
            };
        } catch (error) {
            console.error('Fehler beim Versenden der E-Mail:', error);
            throw error;
        }
    }

    async sendTestEmail(recipientEmail) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                to: recipientEmail,
                subject: 'Test E-Mail - Vanlife Süd System',
                html: `
                    <h2>Test E-Mail</h2>
                    <p>Dies ist eine Test-E-Mail vom Vanlife Süd System.</p>
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
