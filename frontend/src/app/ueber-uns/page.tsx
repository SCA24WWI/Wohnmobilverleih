import { Navbar, Footer } from '@/components';
import Image from 'next/image';

export default function UeberUnsPage() {
    return (
        <>
            <Navbar />
            <section className="pt-36 pb-20 px-8 min-h-screen">
                <div className="container mx-auto">
                    {/* Hero Header */}
                    <div className="mb-20 text-center">
                        <h1 className="text-5xl font-bold mb-4 text-green-800">Über Vanlife Süd</h1>
                        <p className="mx-auto w-full px-4 text-xl font-medium text-black lg:w-8/12">
                            Seit 2019 ist Vanlife Süd Ihr vertrauensvoller Partner für unvergessliche Wohnmobilabenteuer
                            in ganz Europa.
                        </p>
                    </div>

                    {/* Unternehmensbeschreibung */}
                    <div className="mb-20">
                        <div className="overflow-hidden shadow-xl rounded-lg bg-white">
                            <div className="p-8 lg:p-12">
                                <div className="grid lg:grid-cols-2 gap-8 items-center">
                                    <div>
                                        <h2 className="text-3xl font-bold mb-6 text-green-800">Unsere Geschichte</h2>
                                        <p className="mb-4 font-medium text-black text-lg">
                                            Was als kleine Vision zweier Reiseenthusiasten begann, hat sich zu einem der
                                            führenden Wohnmobilverleiher in Süddeutschland entwickelt.
                                        </p>
                                        <p className="font-medium text-gray-600 mb-4">
                                            Mit Leidenschaft für das Reisen und einem tiefen Verständnis für die
                                            Bedürfnisse unserer Kunden haben wir eine Flotte von 20 hochwertigen
                                            Wohnmobilen aufgebaut, die keine Wünsche offen lässt.
                                        </p>
                                        <p className="font-medium text-gray-600">
                                            Von unserem Hauptsitz in München aus betreuen wir Kunden in ganz
                                            Deutschland, Österreich und der Schweiz. Unser erfahrenes Team aus
                                            Reiseexperten und Technikern sorgt dafür, dass jede Fahrt zum perfekten
                                            Erlebnis wird.
                                        </p>
                                    </div>
                                    <div className="relative h-80 lg:h-96">
                                        <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center shadow-lg">
                                            <Image
                                                src="https://www.dropbox.com/scl/fi/5m1ly7iqolqvoy0vj6x5c/geschichte.png?rlkey=1xn8lnn6j1k9r6alv7d1f9c04&st=glu7kwli&dl=1"
                                                alt="Unsere Geschichte"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-20">
                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            <div className="bg-white p-8 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-semibold mb-4 text-green-800">Unsere Mission</h2>
                                <p className="text-gray-600 mb-4">
                                    Wir glauben, dass Reisen mehr ist als nur von A nach B zu kommen. Es geht um
                                    Freiheit, Abenteuer und unvergessliche Momente. Deshalb stellen wir nicht nur
                                    Wohnmobile zur Verfügung, sondern schaffen die Grundlage für Ihre persönlichen
                                    Reiseträume.
                                </p>
                                <p className="text-gray-600">
                                    Jedes unserer Fahrzeuge wird mit größter Sorgfalt gewartet und ausgestattet, damit
                                    Sie sich ganz auf das Wesentliche konzentrieren können: das Entdecken neuer Orte und
                                    das Sammeln wertvoller Erinnerungen.
                                </p>
                            </div>
                            <div className="bg-white p-8 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-semibold mb-4 text-green-800">Unsere Werte</h2>
                                <ul className="space-y-3 text-gray-600">
                                    <li className="flex items-start">
                                        <span className="text-green-600 mr-2">✓</span>
                                        <span>
                                            <strong>Qualität:</strong> Nur modernste und bestgewartete Fahrzeuge
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-600 mr-2">✓</span>
                                        <span>
                                            <strong>Transparenz:</strong> Faire Preise ohne versteckte Kosten
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-600 mr-2">✓</span>
                                        <span>
                                            <strong>Service:</strong> Persönliche Betreuung von der Buchung bis zur
                                            Rückgabe
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-600 mr-2">✓</span>
                                        <span>
                                            <strong>Nachhaltigkeit:</strong> Umweltbewusstes Reisen mit modernen,
                                            effizienten Fahrzeugen
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Team Sektion */}
                    <div className="bg-white rounded-lg shadow-xl p-8">
                        <h2 className="text-4xl font-bold text-center mb-12 text-green-800">Unser Team</h2>
                        <div className="grid md:grid-cols-2 gap-12">
                            {/* Hai Viet Vu */}
                            <div className="text-center">
                                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
                                    <Image
                                        src="https://www.dropbox.com/scl/fi/qqk7cbw7ducmbubduuw4o/hai.jpg?rlkey=yjbi1bsogiaasin8xexts8tiw&st=uxhi53a8&dl=1"
                                        alt="Hai Viet Vu"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold mb-2 text-gray-800">Hai Viet Vu</h3>
                                <p className="text-lg text-green-600 font-semibold mb-4">Geschäftsführer & Gründer</p>
                                <div className="text-gray-600 text-left space-y-3">
                                    <p>
                                        Als Geschäftsführer und Mitgründer von Vanlife Süd bringt Hai über 10 Jahre
                                        Erfahrung in der Tourismusbranche mit. Seine Vision war es, das Wohnmobilreisen
                                        für jeden zugänglich und unvergesslich zu machen.
                                    </p>
                                    <p>
                                        <strong>Verantwortlichkeiten:</strong>
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>Strategische Unternehmensführung und Geschäftsentwicklung</li>
                                        <li>Partnerschaftsmanagement mit Herstellern und Zulieferern</li>
                                        <li>Kundenbeziehungen und Servicequalität</li>
                                        <li>Marketing und Markenentwicklung</li>
                                        <li>Finanzplanung und Investitionsstrategie</li>
                                        <li>Internationale Expansion und Kooperationen</li>
                                    </ul>
                                    <p>
                                        <strong>Hintergrund:</strong> Master in Betriebswirtschaftslehre an der
                                        Universität München mit Schwerpunkt auf Tourismusmanagement. Zusätzliche
                                        Ausbildung im Hospitality Management in der Schweiz. Hai spricht fließend
                                        Deutsch, Englisch, Französisch und Vietnamesisch und hat bereits über 30 Länder
                                        mit dem Wohnmobil bereist.
                                    </p>
                                    <p>
                                        <strong>Fun Fact:</strong> Hai ist leidenschaftlicher Fotograf und dokumentiert
                                        seine Reisen auf seinem Instagram-Account @vanlife_adventures_hv. Seine
                                        Lieblingsroute führt durch die norwegischen Fjorde.
                                    </p>
                                </div>
                            </div>

                            {/* Jannis Köllner */}
                            <div className="text-center">
                                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
                                    <Image
                                        src="https://www.dropbox.com/scl/fi/6j0e0deseorataatcqu01/jannis.jpg?rlkey=fzji5x7yd077mvmx4ya6k758g&st=ougkq89h&dl=1"
                                        alt="Jannis Köllner"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold mb-2 text-gray-800">Jannis Köllner</h3>
                                <p className="text-lg text-green-600 font-semibold mb-4">IT-Leiter & Mitgründer</p>
                                <div className="text-gray-600 text-left space-y-3">
                                    <p>
                                        Jannis ist das technische Herzstück von Vanlife Süd und verantwortlich für alle
                                        digitalen Innovationen. Als Mitgründer hat er die gesamte IT-Infrastruktur des
                                        Unternehmens von Grund auf entwickelt und dabei stets die neuesten Technologien
                                        im Blick.
                                    </p>
                                    <p>
                                        <strong>Verantwortlichkeiten:</strong>
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>Entwicklung und Wartung der Buchungsplattform</li>
                                        <li>IT-Infrastruktur und Cybersecurity</li>
                                        <li>Fahrzeug-Telematik und GPS-Tracking-Systeme</li>
                                        <li>Datenanalyse und Business Intelligence</li>
                                        <li>KI-basierte Routenoptimierung und Empfehlungssysteme</li>
                                        <li>Integration von IoT-Sensoren in Fahrzeuge</li>
                                    </ul>
                                    <p>
                                        <strong>Hintergrund:</strong> Master in Informatik an der TU München mit
                                        Spezialisierung auf Software Engineering und Machine Learning. Jannis hat 5
                                        Jahre als Senior Full-Stack Developer bei verschiedenen Tech-Startups gearbeitet
                                        und mehrere erfolgreiche Apps entwickelt, bevor er Vanlife Süd mitgründete.
                                    </p>
                                    <p>
                                        <strong>Expertise:</strong> React, Node.js, Python, AWS Cloud Architecture,
                                        Docker, Kubernetes, PostgreSQL, MongoDB. Zertifiziert als AWS Solutions
                                        Architect und Google Cloud Professional.
                                    </p>
                                    <p>
                                        <strong>Fun Fact:</strong> Jannis ist ein begeisterter Tech-Blogger und
                                        Open-Source-Contributor. In seiner Freizeit entwickelt er Smart-Home-Lösungen
                                        und testet die neuesten Gadgets in seinem eigenen umgebauten Wohnmobil.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Zusätzliche Firmeninfo */}
                        <div className="mt-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
                            <h3 className="text-3xl font-semibold mb-8 text-center text-green-800">
                                Warum Vanlife Süd?
                            </h3>
                            <div className="grid md:grid-cols-4 gap-6 text-center">
                                <div className="bg-white p-6 rounded-lg shadow-md">
                                    <div className="text-4xl mb-4">🚐</div>
                                    <h4 className="font-semibold mb-2 text-lg">20 Luxusvans</h4>
                                    <p className="text-sm text-gray-600">
                                        Moderne Flotte verschiedener Größen und Ausstattungen von Premium-Herstellern
                                    </p>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-md">
                                    <div className="text-4xl mb-4">⭐</div>
                                    <h4 className="font-semibold mb-2 text-lg">4.9/5 Bewertung</h4>
                                    <p className="text-sm text-gray-600">
                                        Über 3.500 zufriedene Kunden und 98% Weiterempfehlungsrate
                                    </p>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-md">
                                    <div className="text-4xl mb-4">🌍</div>
                                    <h4 className="font-semibold mb-2 text-lg">Europa-weit</h4>
                                    <p className="text-sm text-gray-600">
                                        Vollversicherung und 24/7 Pannenhilfe in 28 europäischen Ländern
                                    </p>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-md">
                                    <div className="text-4xl mb-4">🏆</div>
                                    <h4 className="font-semibold mb-2 text-lg">Ausgezeichnet</h4>
                                    <p className="text-sm text-gray-600">
                                        "Bester Wohnmobilverleih Süddeutschland 2023" - ADAC Reisemagazin
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Kontakt Sektion */}
                        <div className="mt-16 text-center">
                            <h3 className="text-2xl font-semibold mb-4 text-green-800">
                                Bereit für Ihr nächstes Abenteuer?
                            </h3>
                            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                                Unser Team steht Ihnen gerne zur Verfügung, um die perfekte Reise für Sie zu planen.
                                Kontaktieren Sie uns noch heute und lassen Sie uns gemeinsam Ihr unvergessliches
                                Wohnmobilabenteuer starten!
                            </p>
                            <div className="flex justify-center space-x-4">
                                <a
                                    href="/kontakt"
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                >
                                    Kontakt aufnehmen
                                </a>
                                <a
                                    href="/wohnmobile"
                                    className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                >
                                    Wohnmobile entdecken
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}
