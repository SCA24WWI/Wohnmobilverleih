'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Navbar, Footer, ToastProvider, useToast } from '@/components';
import AvailabilityCalendar from '@/components/availability-calendar';
import { API_CONFIG, buildApiUrl } from '@/config/api';

// Interface für Wohnmobil-Daten
interface Vehicle {
    id: number;
    name: string;
    modell: string;
    beschreibung: string;
    bettenzahl: number;
    fuehrerschein: string;
    ort: string;
    preis_pro_tag: number;
    hauptbild?: string;
    galerie_bilder?: string; // JSON String
    erstellt_am: string;
}

// Beispiel-Ausstattungsmerkmale (können später dynamisch aus der DB geladen werden)
const sampleFeatures = [
    'Küche mit Kühlschrank',
    'Dusche und WC',
    'Sitzgruppe',
    'Betten für Personen',
    'Außensteckdose',
    'Markise',
    'Fahrradträger möglich',
    'Rückfahrkamera'
];

const VehicleDetailContent: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const vehicleId = params.id as string;
    const { showError, showWarning } = useToast();

    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [vehicleImages, setVehicleImages] = useState<string[]>([]);

    // Datums-State für die Vorauswahl
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [nights, setNights] = useState(0);

    // Fallback-Bilder falls keine Bilder in der DB vorhanden sind
    const fallbackImages = [
        '/image/blogs/camper_alle_budget.png',
        '/image/blogs/Camper_Family.png',
        '/image/blogs/Camper_paare.png',
        '/image/blogs/Camper_haustiererlaubnis.png'
    ];

    // Fahrzeugdaten laden
    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                setLoading(true);
                const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.VEHICLES.BY_ID}/${vehicleId}`));

                if (!response.ok) {
                    throw new Error('Fahrzeug nicht gefunden');
                }

                const data = await response.json();
                setVehicle(data);

                // Bilder aus Datenbank verarbeiten
                const allImages: string[] = [];

                // Hauptbild zuerst hinzufügen (falls vorhanden)
                if (data.hauptbild) {
                    allImages.push(data.hauptbild);
                }

                // Galerie-Bilder hinzufügen
                if (data.galerie_bilder) {
                    try {
                        let galleryImages;

                        // Prüfen ob es bereits ein Array ist oder ein JSON-String
                        if (Array.isArray(data.galerie_bilder)) {
                            galleryImages = data.galerie_bilder;
                        } else if (typeof data.galerie_bilder === 'string') {
                            galleryImages = JSON.parse(data.galerie_bilder);
                        }

                        if (Array.isArray(galleryImages)) {
                            galleryImages.forEach((img) => {
                                if (img && typeof img === 'string') {
                                    allImages.push(img);
                                }
                            });
                        }
                    } catch (parseError) {

                    }
                }

                const images = allImages;
                setVehicleImages(images.length > 0 ? images : fallbackImages);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Fehler beim Laden der Fahrzeugdaten');
                // Fallback-Bilder bei Fehler
                setVehicleImages(fallbackImages);
            } finally {
                setLoading(false);
            }
        };

        if (vehicleId) {
            fetchVehicle();
        }
    }, [vehicleId]);

    // Nächte berechnen
    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (start < end) {
                const timeDiff = end.getTime() - start.getTime();
                const calculatedNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
                setNights(calculatedNights);
            } else {
                setNights(0);
            }
        } else {
            setNights(0);
        }
    }, [startDate, endDate]);

    // API-Verfügbarkeitsprüfung
    const checkAvailability = async (startDate: string, endDate: string): Promise<boolean> => {
        try {
            const response = await fetch(
                buildApiUrl(API_CONFIG.ENDPOINTS.BOOKINGS.CHECK_AVAILABILITY, {
                    vehicle_id: vehicleId,
                    start_date: startDate,
                    end_date: endDate
                })
            );

            if (!response.ok) {

                return true;
            }

            const result = await response.json();
            return result.available;
        } catch (err) {

            return true;
        }
    };

    // Datumsfeld-Validierung
    const handleDateFieldChange = async (type: 'start' | 'end', newDate: string) => {
        if (type === 'start') {
            setStartDate(newDate);
            // Wenn bereits ein Enddatum ausgewählt ist, prüfe die Verfügbarkeit
            if (endDate && newDate) {
                const isAvailable = await checkAvailability(newDate, endDate);
                if (!isAvailable) {
                    showError(
                        'Zeitraum nicht verfügbar',
                        'Der gewählte Zeitraum ist bereits gebucht. Bitte wählen Sie andere Daten.'
                    );
                    setStartDate('');
                    return;
                }
            }
        } else {
            setEndDate(newDate);
            // Wenn bereits ein Startdatum ausgewählt ist, prüfe die Verfügbarkeit
            if (startDate && newDate) {
                const isAvailable = await checkAvailability(startDate, newDate);
                if (!isAvailable) {
                    showError(
                        'Zeitraum nicht verfügbar',
                        'Der gewählte Zeitraum ist bereits gebucht. Bitte wählen Sie andere Daten.'
                    );
                    setEndDate('');
                    return;
                }
            }
        }
    };

    // Kalender-Datumsauswahl behandeln
    const handleCalendarDateSelect = (start: string, end: string) => {
        setStartDate(start);
        setEndDate(end);
    };

    // Zur Buchungsseite mit Daten weiterleiten
    const handleBookingRedirect = () => {
        const bookingUrl = new URL(`/buchung/${vehicleId}`, window.location.origin);
        if (startDate) bookingUrl.searchParams.set('startDate', startDate);
        if (endDate) bookingUrl.searchParams.set('endDate', endDate);
        router.push(bookingUrl.toString());
    };

    // Bildergalerie Navigation
    const nextImage = () => {
        if (vehicleImages.length > 1) {
            setCurrentImageIndex((prev) => (prev + 1) % vehicleImages.length);
        }
    };

    const prevImage = () => {
        if (vehicleImages.length > 1) {
            setCurrentImageIndex((prev) => (prev - 1 + vehicleImages.length) % vehicleImages.length);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !vehicle) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Fehler</h1>
                    <p className="text-gray-600">{error || 'Fahrzeug nicht gefunden'}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 pt-24">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Linke Spalte: Bilder und Details */}
                        <div className="lg:col-span-2">
                            {/* Bildergalerie */}
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                                <div className="relative aspect-video">
                                    <Image
                                        src={vehicleImages[currentImageIndex]}
                                        alt={`${vehicle.name} - Bild ${currentImageIndex + 1}`}
                                        fill
                                        className="object-cover"
                                    />

                                    {/* Navigation Buttons - nur anzeigen wenn mehrere Bilder vorhanden */}
                                    {vehicleImages.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 text-white p-3 rounded-full hover:bg-opacity-90 transition-all duration-200 shadow-lg z-10 focus:outline-none focus:ring-2 focus:ring-white"
                                                title="Vorheriges Bild"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 19l-7-7 7-7"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 text-white p-3 rounded-full hover:bg-opacity-90 transition-all duration-200 shadow-lg z-10 focus:outline-none focus:ring-2 focus:ring-white"
                                                title="Nächstes Bild"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 5l7 7-7 7"
                                                    />
                                                </svg>
                                            </button>
                                        </>
                                    )}

                                    {/* Bild-Indikatoren - nur anzeigen wenn mehrere Bilder vorhanden */}
                                    {vehicleImages.length > 1 && (
                                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                                            {vehicleImages.map((_, index: number) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentImageIndex(index)}
                                                    className={`w-3 h-3 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white ${
                                                        index === currentImageIndex
                                                            ? 'bg-white shadow-lg'
                                                            : 'bg-gray-400 hover:bg-gray-300'
                                                    }`}
                                                    title={`Bild ${index + 1}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Fahrzeug-Informationen */}
                            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{vehicle.name}</h1>
                                        <p className="text-lg text-gray-600">{vehicle.modell}</p>
                                        <p className="text-sm text-gray-500 flex items-center mt-2">
                                            <span className="mr-2">📍</span> {vehicle.ort}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-blue-600">€{vehicle.preis_pro_tag}</p>
                                        <p className="text-sm text-gray-600">pro Nacht</p>
                                    </div>
                                </div>

                                {/* Beschreibung */}
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold mb-3">Beschreibung</h2>
                                    <p className="text-gray-700 leading-relaxed">
                                        {vehicle.beschreibung ||
                                            'Dieses komfortable Wohnmobil bietet alles, was Sie für einen unvergesslichen Urlaub benötigen. Perfekt ausgestattet für Ihre Reise mit Familie oder Freunden.'}
                                    </p>
                                </div>

                                {/* Grunddaten */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="text-2xl mb-2">👥</div>
                                        <div className="font-semibold">{vehicle.bettenzahl} Personen</div>
                                        <div className="text-sm text-gray-600">Schlafplätze</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="text-2xl mb-2">🚗</div>
                                        <div className="font-semibold">Klasse {vehicle.fuehrerschein}</div>
                                        <div className="text-sm text-gray-600">Führerschein</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="text-2xl mb-2">🏠</div>
                                        <div className="font-semibold">{vehicle.modell}</div>
                                        <div className="text-sm text-gray-600">Typ</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="text-2xl mb-2">📍</div>
                                        <div className="font-semibold">{vehicle.ort}</div>
                                        <div className="text-sm text-gray-600">Standort</div>
                                    </div>
                                </div>

                                {/* Ausstattung */}
                                <div>
                                    <h2 className="text-xl font-semibold mb-4">Ausstattung</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {sampleFeatures.map((feature, index) => (
                                            <div key={index} className="flex items-center">
                                                <span className="text-green-500 mr-3">✓</span>
                                                <span className="text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Verfügbarkeitskalender */}
                            <AvailabilityCalendar
                                vehicleId={vehicleId}
                                onDateSelect={handleCalendarDateSelect}
                                selectedStartDate={startDate}
                                selectedEndDate={endDate}
                            />
                        </div>

                        {/* Rechte Spalte: Zusätzliche Informationen */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-32">
                                {/* Datums-Auswahl */}
                                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                                    <h2 className="text-xl font-semibold mb-4">📅 Reisedaten wählen</h2>

                                    <div className="space-y-4">
                                        <div>
                                            <label
                                                htmlFor="start-date"
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                            >
                                                Anreise
                                            </label>
                                            <input
                                                type="date"
                                                id="start-date"
                                                value={startDate}
                                                onChange={(e) => handleDateFieldChange('start', e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="end-date"
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                            >
                                                Abreise
                                            </label>
                                            <input
                                                type="date"
                                                id="end-date"
                                                value={endDate}
                                                onChange={(e) => handleDateFieldChange('end', e.target.value)}
                                                min={startDate || new Date().toISOString().split('T')[0]}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        {nights > 0 && (
                                            <div className="bg-blue-50 p-3 rounded-lg">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        Reisedauer:
                                                    </span>
                                                    <span className="text-sm font-bold text-blue-600">
                                                        {nights} Nächte
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        Gesamtpreis:
                                                    </span>
                                                    <span className="text-xl font-bold text-green-600">
                                                        €{nights * vehicle.preis_pro_tag}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            onClick={handleBookingRedirect}
                                            disabled={!startDate || !endDate || nights <= 0}
                                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
                                        >
                                            {startDate && endDate && nights > 0 ? '🚐 Jetzt buchen' : '📅 Daten wählen'}
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-lg p-6">
                                    <h2 className="text-xl font-semibold mb-4">Fahrzeug-Übersicht</h2>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Preis pro Tag:</span>
                                            <span className="text-2xl font-bold text-green-600">
                                                €{vehicle.preis_pro_tag}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Schlafplätze:</span>
                                            <span className="font-semibold">{vehicle.bettenzahl} Personen</span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Führerschein:</span>
                                            <span className="font-semibold">Klasse {vehicle.fuehrerschein}</span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Standort:</span>
                                            <span className="font-semibold">{vehicle.ort}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

// Wrapper-Komponente für Toast-Provider
const VehicleDetailPage: React.FC = () => {
    return (
        <ToastProvider>
            <VehicleDetailContent />
        </ToastProvider>
    );
};

export default VehicleDetailPage;
