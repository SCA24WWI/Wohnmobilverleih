'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar, Footer } from '@/components';

const BookingSuccessPage: React.FC = () => {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('booking_id');
    const vehicle = searchParams.get('vehicle');
    const total = searchParams.get('total');

    if (!bookingId || !vehicle || !total) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="max-w-md mx-auto text-center">
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <div className="text-red-500 text-6xl mb-4">❌</div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">Fehler</h1>
                            <p className="text-gray-600 mb-6">Buchungsdaten konnten nicht gefunden werden.</p>
                            <Link
                                href="/"
                                className="inline-block bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
                            >
                                Zur Startseite
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 pt-24">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    {/* Success Header */}
                    <div className="text-center mb-8">
                        <div className="text-green-500 text-6xl mb-4">✅</div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Buchung erfolgreich!</h1>
                        <p className="text-lg text-gray-600">
                            Vielen Dank für Ihre Buchung. Sie erhalten in Kürze eine Bestätigung per E-Mail.
                        </p>
                    </div>

                    {/* Booking Details Card */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                        {/* Header */}
                        <div className="bg-green-600 text-white p-6">
                            <h2 className="text-2xl font-bold">Buchungsdetails</h2>
                            <p className="mt-2 opacity-90">Buchungs-Nr.: #{bookingId}</p>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Fahrzeug-Informationen */}
                                <div>
                                    <h3 className="text-xl font-semibold mb-4 text-gray-900">Fahrzeug</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-lg font-medium text-gray-800">
                                            {decodeURIComponent(vehicle)}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Weitere Details folgen in der Bestätigungs-E-Mail
                                        </p>
                                    </div>
                                </div>

                                {/* Preis-Informationen */}
                                <div>
                                    <h3 className="text-xl font-semibold mb-4 text-gray-900">Gesamtpreis</h3>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <p className="text-3xl font-bold text-green-600">€{total}</p>
                                        <p className="text-sm text-gray-600 mt-1">Inkl. aller gewählten Extras</p>
                                    </div>
                                </div>
                            </div>

                            {/* Nächste Schritte */}
                            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <h4 className="text-lg font-semibold text-blue-900 mb-2">Was passiert als nächstes?</h4>
                                <ul className="space-y-2 text-blue-800">
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2">1.</span>
                                        Sie erhalten eine Bestätigungs-E-Mail mit allen Details
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2">2.</span>
                                        Wir prüfen die Verfügbarkeit und bestätigen Ihre Buchung
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2">3.</span>
                                        Sie erhalten weitere Informationen zur Übergabe
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/"
                            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors text-center font-semibold"
                        >
                            Zur Startseite
                        </Link>
                        <Link
                            href="/wohnmobile"
                            className="bg-white text-green-600 border-2 border-green-600 px-8 py-3 rounded-lg hover:bg-green-50 transition-colors text-center font-semibold"
                        >
                            Weitere Wohnmobile
                        </Link>
                    </div>

                    {/* Kontakt */}
                    <div className="mt-12 text-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fragen zu Ihrer Buchung?</h3>
                        <p className="text-gray-600 mb-4">Unser Team steht Ihnen gerne zur Verfügung!</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                            <span className="text-gray-600">📧 info@wohnmobilverleih.de</span>
                            <span className="text-gray-600">📞 +49 (0) 123 456 789</span>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default BookingSuccessPage;
