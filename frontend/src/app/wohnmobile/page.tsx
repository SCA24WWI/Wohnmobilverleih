import { Navbar, Footer } from '@/components';
import { Quickbook } from '../quickbook';

export default function WohnmobilePage() {
    return (
        <>
            <Navbar />
            <div className="pt-24 min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Alle Wohnmobile</h1>
                    <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                        Entdecken Sie unsere große Auswahl an hochwertigen Wohnmobilen für jeden Bedarf.
                    </p>
                    <Quickbook />
                </div>
            </div>
            <Footer />
        </>
    );
}
