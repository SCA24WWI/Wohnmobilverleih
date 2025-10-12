import { Navbar, Footer } from '@/components';

export default function KontaktPage() {
    return (
        <>
            <Navbar />
            <section className="pt-24 pb-20 px-8 min-h-screen">
                <div className="container mx-auto">
                    {/* Hero Header */}
                    <div className="mb-20 text-center">
                        <h1 className="text-5xl font-bold mb-4 text-green-800">Kontakt</h1>
                        <p className="mx-auto w-full px-4 text-xl font-medium text-black lg:w-8/12">
                            Haben Sie Fragen oder möchten Sie Ihr nächstes Wohnmobil-Abenteuer buchen? Wir sind für Sie
                            da!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* Kontaktinformationen */}
                        <div className="bg-white rounded-lg shadow-xl p-8">
                            <h2 className="text-3xl font-bold mb-8 text-green-800">Unsere Standorte</h2>

                            {/* Hauptstandort München */}
                            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                                <h3 className="text-xl font-semibold mb-4 text-green-700">🏢 Hauptstandort München</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                            <svg
                                                className="h-5 w-5 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">Adresse</p>
                                            <p className="text-gray-600">
                                                Vanlife Süd GmbH
                                                <br />
                                                Leopoldstraße 245
                                                <br />
                                                80807 München
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                                            <svg
                                                className="h-5 w-5 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">Telefon</p>
                                            <p className="text-gray-600">+49 89 123 456 789</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                                            <svg
                                                className="h-5 w-5 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">Öffnungszeiten</p>
                                            <p className="text-gray-600">
                                                Mo-Fr: 8:00 - 19:00
                                                <br />
                                                Sa: 9:00 - 17:00
                                                <br />
                                                So: 10:00 - 16:00
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Abholstationen */}
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-4 text-green-700">🚐 Weitere Abholstationen</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <span className="font-medium">Flughafen München</span>
                                        <span className="text-sm text-gray-600">Terminal 2, Parkhaus P20</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <span className="font-medium">Stuttgart</span>
                                        <span className="text-sm text-gray-600">Wilhelmsplatz 11</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <span className="font-medium">Nürnberg</span>
                                        <span className="text-sm text-gray-600">Bahnhofsplatz 9</span>
                                    </div>
                                </div>
                            </div>

                            {/* Soziale Medien */}
                            <div>
                                <h3 className="text-xl font-semibold mb-4 text-green-700">📱 Folgen Sie uns</h3>
                                <div className="flex space-x-4">
                                    <a
                                        href="#"
                                        className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                                    >
                                        <span className="font-bold">f</span>
                                    </a>
                                    <a
                                        href="#"
                                        className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-colors"
                                    >
                                        <span className="font-bold">📷</span>
                                    </a>
                                    <a
                                        href="#"
                                        className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors"
                                    >
                                        <span className="font-bold">▶</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Kontaktformular */}
                        <div className="bg-white rounded-lg shadow-xl p-8">
                            <h2 className="text-3xl font-bold mb-6 text-green-800">Nachricht senden</h2>
                            <p className="text-gray-600 mb-8">
                                Haben Sie spezielle Wünsche oder Fragen? Schreiben Sie uns - wir melden uns innerhalb
                                von 2 Stunden bei Ihnen zurück!
                            </p>

                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Vorname *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                            placeholder="Ihr Vorname"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nachname *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                            placeholder="Ihr Nachname"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        E-Mail Adresse *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                        placeholder="ihre@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Telefonnummer
                                    </label>
                                    <input
                                        type="tel"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                        placeholder="+49 123 456 789"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Anfrage-Art</label>
                                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors">
                                        <option value="">Bitte wählen...</option>
                                        <option value="booking">Buchungsanfrage</option>
                                        <option value="information">Allgemeine Information</option>
                                        <option value="support">Support</option>
                                        <option value="complaint">Reklamation</option>
                                        <option value="partnership">Partnerschaft</option>
                                        <option value="other">Sonstiges</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ihre Nachricht *
                                    </label>
                                    <textarea
                                        rows={5}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                        placeholder="Beschreiben Sie Ihr Anliegen oder Ihre Wünsche..."
                                    />
                                </div>

                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        id="privacy"
                                        required
                                        className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="privacy" className="ml-2 text-sm text-gray-600">
                                        Ich stimme der Verarbeitung meiner Daten gemäß der{' '}
                                        <a href="/datenschutz" className="text-green-600 hover:underline">
                                            Datenschutzerklärung
                                        </a>{' '}
                                        zu. *
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-300 transform hover:scale-105"
                                >
                                    🚀 Nachricht senden
                                </button>
                            </form>

                            <div className="mt-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                                <p className="text-sm text-green-700">
                                    <strong>Schnelle Antwort garantiert:</strong> Wir antworten auf alle Anfragen
                                    innerhalb von 2 Stunden während unserer Geschäftszeiten.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-20 bg-white rounded-lg shadow-xl p-8">
                        <h2 className="text-3xl font-bold text-center mb-12 text-green-800">Häufige Fragen</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-green-700">
                                    🕒 Wie flexibel sind die Abholzeiten?
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Unser Standard-Service ist Mo-So von 8:00-20:00 verfügbar. Für frühere oder spätere
                                    Abholungen berechnen wir eine kleine Servicegebühr von 29€.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-green-700">
                                    🚐 Kann ich verschiedene Fahrzeuge vor Ort anschauen?
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Ja! Vereinbaren Sie gerne einen Termin für eine Besichtigung. Wir zeigen Ihnen
                                    verschiedene Modelle und beraten Sie individuell.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-green-700">
                                    💰 Welche Zahlungsmöglichkeiten gibt es?
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Wir akzeptieren EC-Karte, Kreditkarte, Überweisung und PayPal. Die Kaution kann per
                                    Kreditkarte oder in bar hinterlegt werden.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-green-700">
                                    📍 Ist eine Einwegmiete möglich?
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Ja, zwischen unseren Standorten München, Stuttgart und Nürnberg ist eine Einwegmiete
                                    gegen Aufpreis möglich. Sprechen Sie uns an!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="mt-16 text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-12">
                        <h3 className="text-3xl font-semibold mb-4 text-green-800">Bereit für Ihr Abenteuer?</h3>
                        <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
                            Lassen Sie uns gemeinsam Ihre perfekte Reise planen! Unser Team freut sich darauf, Ihnen bei
                            der Auswahl des idealen Wohnmobils zu helfen.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a
                                href="tel:+4989123456789"
                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
                            >
                                📞 Jetzt anrufen
                            </a>
                            <a
                                href="/wohnmobile"
                                className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 rounded-lg font-semibold transition-colors"
                            >
                                🚐 Wohnmobile ansehen
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}
