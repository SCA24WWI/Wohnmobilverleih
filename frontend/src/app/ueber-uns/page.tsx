import { Navbar, Footer } from '@/components';

export default function UeberUnsPage() {
    return (
        <>
            <Navbar />
            <div className="pt-20 min-h-screen bg-white">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
                            Über uns
                        </h1>
                        <div className="prose prose-lg mx-auto">
                            <p className="text-xl text-gray-600 mb-8">
                                Willkommen bei Wohnmobil Verleih - Ihrem zuverlässigen Partner für unvergessliche Reiseerlebnisse.
                            </p>
                            
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Unsere Mission</h2>
                            <p className="text-gray-600 mb-6">
                                Wir ermöglichen es Menschen, die Freiheit des Reisens zu entdecken und unvergessliche 
                                Abenteuer zu erleben. Mit unserer modernen Flotte hochwertiger Wohnmobile bieten wir 
                                Komfort und Sicherheit für Ihre Reisen.
                            </p>

                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Warum uns wählen?</h2>
                            <ul className="list-disc pl-6 text-gray-600 mb-6">
                                <li>Moderne und gepflegte Wohnmobile</li>
                                <li>24/7 Kundenservice</li>
                                <li>Transparente Preise ohne versteckte Kosten</li>
                                <li>Flexible Buchungsoptionen</li>
                                <li>Umfassende Versicherung</li>
                            </ul>

                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Unser Team</h2>
                            <p className="text-gray-600 mb-6">
                                Unser erfahrenes Team steht Ihnen von der ersten Beratung bis zur Rückgabe 
                                Ihres Wohnmobils zur Seite. Wir kennen unsere Fahrzeuge in- und auswendig 
                                und teilen gerne unser Wissen über die schönsten Reiseziele mit Ihnen.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}