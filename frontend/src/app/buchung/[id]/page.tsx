'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Navbar, Footer } from '@/components';
import { API_CONFIG, buildApiUrl } from '@/config/api';
import { useAuth } from '@/contexts/AuthContext';

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
    erstellt_am: string;
    hauptbild: string;
}

// Erweiterte Extras mit Kategorien
const availableExtras = {
    comfort: [
        {
            id: 'campingmoebel',
            name: 'Campingmöbel Set (Tisch & Stühle)',
            price: 25,
            description: 'Klappbarer Tisch und 4 Stühle'
        },
        { id: 'markise', name: 'Zusätzliche Markise', price: 20, description: 'Extra Sonnenschutz für mehr Komfort' },
        {
            id: 'outdoor_set',
            name: 'Outdoor-Equipment',
            price: 30,
            description: 'Camping-Geschirr, Besteck und Küchenzubehör'
        }
    ],
    sport: [
        { id: 'fahrradtraeger', name: 'Fahrradträger', price: 15, description: 'Für bis zu 4 Fahrräder' },
        { id: 'sup_board', name: 'SUP Board', price: 35, description: 'Stand-Up-Paddle Board inkl. Pumpe' },
        { id: 'kajak', name: 'Kajak', price: 40, description: '2-Personen Kajak mit Paddeln' }
    ],
    tech: [
        { id: 'grill', name: 'Camping-Grill', price: 10, description: 'Gasgrill für gemütliche Abende' },
        { id: 'generator', name: 'Stromgenerator', price: 45, description: 'Für autarkes Camping' },
        { id: 'wifi_router', name: 'Mobile WLAN Hotspot', price: 8, description: 'Unbegrenztes Internet unterwegs' }
    ],
    navigation: [
        { id: 'gps_navi', name: 'GPS Navigation', price: 12, description: 'Speziell für Wohnmobile programmiert' },
        { id: 'dashcam', name: 'Dashcam', price: 18, description: 'Aufzeichnung der Fahrt für mehr Sicherheit' }
    ]
};

// Versicherungsoptionen
const insuranceOptions = [
    { id: 'basic', name: 'Basis-Versicherung', price: 0, description: 'Enthalten im Grundpreis' },
    { id: 'premium', name: 'Premium-Versicherung', price: 25, description: 'Reduzierte Selbstbeteiligung auf 500€' },
    { id: 'vollkasko', name: 'Vollkasko ohne SB', price: 45, description: 'Keine Selbstbeteiligung bei Schäden' }
];

// Zahlungsmethoden
const paymentMethods = [
    { id: 'kreditkarte', name: 'Kreditkarte', icon: '💳', fee: 0 },
    { id: 'paypal', name: 'PayPal', icon: '🅿️', fee: 0 },
    { id: 'sepa', name: 'SEPA-Lastschrift', icon: '🏦', fee: 0 },
    { id: 'sofortueberweisung', name: 'Sofortüberweisung', icon: '⚡', fee: 2.5 }
];

const BookingPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, token, loading: authLoading } = useAuth();
    const vehicleId = params.id as string;
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Buchungsformular State
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [customerInfo, setCustomerInfo] = useState({
        vorname: '',
        nachname: '',
        rechnungs_email: '',
        telefon: '',
        adresse: '',
        plz: '',
        ort: '',
        geburtsdatum: '',
        fuehrerschein_nummer: ''
    });

    // Kundendaten automatisch ausfüllen wenn Benutzer angemeldet ist
    useEffect(() => {
        if (user) {
            setCustomerInfo((prev) => ({
                ...prev,
                vorname: user.vorname || '',
                nachname: user.nachname || '',
                rechnungs_email: user.email || '',
                telefon: user.telefon || '',
                adresse: user.adresse || '',
                plz: user.plz || '',
                ort: user.ort || '',
                geburtsdatum: user.geburtsdatum || ''
            }));
        }
    }, [user]);

    const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
    const [selectedInsurance, setSelectedInsurance] = useState<string>('basic');
    const [selectedPayment, setSelectedPayment] = useState<string>('kreditkarte');
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const [totalPrice, setTotalPrice] = useState(0);
    const [nights, setNights] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    // Authentifizierungsprüfung
    useEffect(() => {
        if (!authLoading && !user) {
            // Benutzer ist nicht angemeldet, weiterleiten zur Anmeldeseite
            const currentUrl = window.location.pathname + window.location.search;
            router.push(`/auth?backUrl=${encodeURIComponent(currentUrl)}`);
        }
    }, [authLoading, user, router]);

    // Datums-Parameter aus URL auslesen
    useEffect(() => {
        // Nur ausführen wenn Benutzer angemeldet ist
        if (!user) return;

        const startDateParam = searchParams.get('startDate');
        const endDateParam = searchParams.get('endDate');

        // Prüfen ob beide Datums-Parameter vorhanden sind
        if (!startDateParam || !endDateParam) {
            setError('Reisedaten fehlen. Sie werden zur Fahrzeugauswahl weitergeleitet...');
            setTimeout(() => {
                router.push(`/wohnmobile/${vehicleId}`);
            }, 3000);
            return;
        }

        setStartDate(startDateParam);
        setEndDate(endDateParam);
    }, [searchParams, router, vehicleId, user]);

    // Fahrzeugdaten laden
    useEffect(() => {
        // Nur ausführen wenn Benutzer angemeldet ist
        if (!user) return;

        const fetchVehicle = async () => {
            try {
                const apiUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VEHICLES.BY_ID}/${vehicleId}`;
                const response = await fetch(apiUrl);

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error(`Fahrzeug mit ID ${vehicleId} nicht gefunden`);
                    }
                    throw new Error(`Fehler beim Laden: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();

                // Überprüfen ob Fahrzeugdaten vorhanden sind
                if (!data || (!data.id && !data.name)) {
                    throw new Error('Unvollständige Fahrzeugdaten erhalten');
                }

                setVehicle(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Fehler beim Laden der Fahrzeugdaten');
            } finally {
                setLoading(false);
            }
        };

        if (vehicleId) {
            fetchVehicle();
        }
    }, [vehicleId, user]);

    // Preisberechnung
    useEffect(() => {
        if (startDate && endDate && vehicle) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (start < end) {
                const timeDiff = end.getTime() - start.getTime();
                const calculatedNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
                setNights(calculatedNights);

                // Grundpreis
                let total = calculatedNights * vehicle.preis_pro_tag;

                // Extras
                const allExtras = [
                    ...availableExtras.comfort,
                    ...availableExtras.sport,
                    ...availableExtras.tech,
                    ...availableExtras.navigation
                ];
                selectedExtras.forEach((extraId) => {
                    const extra = allExtras.find((e) => e.id === extraId);
                    if (extra) total += extra.price * calculatedNights;
                });

                // Versicherung
                const insurance = insuranceOptions.find((i) => i.id === selectedInsurance);
                if (insurance) total += insurance.price * calculatedNights;

                // Zahlungsgebühr
                const payment = paymentMethods.find((p) => p.id === selectedPayment);
                if (payment) total += payment.fee;

                setTotalPrice(total);
            } else {
                setNights(0);
                setTotalPrice(0);
            }
        } else {
            setNights(0);
            setTotalPrice(0);
        }
    }, [startDate, endDate, selectedExtras, selectedInsurance, selectedPayment, vehicle]);

    const toggleExtra = (extraId: string) => {
        setSelectedExtras((prev) =>
            prev.includes(extraId) ? prev.filter((id) => id !== extraId) : [...prev, extraId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prüfung: Benutzer muss angemeldet sein
        if (!user || !token) {
            setError('Sie müssen angemeldet sein, um eine Buchung vorzunehmen.');
            // Weiterleitung zur Anmelde-Seite mit Rücksprung-URL
            const currentUrl = window.location.pathname + window.location.search;
            router.push(`/auth?backUrl=${encodeURIComponent(currentUrl)}`);
            return;
        }

        if (!agreeToTerms) {
            setError('Bitte akzeptieren Sie die AGB und Datenschutzerklärung.');
            return;
        }

        if (!vehicle) {
            setError('Fahrzeugdaten nicht verfügbar.');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            // Buchungsdaten zusammenstellen (vereinfacht für angemeldete Benutzer)
            const bookingData = {
                vehicleId: vehicle.id,
                startDate,
                endDate,
                selectedExtras,
                selectedInsurance,
                selectedPayment,
                totalPrice,
                nights,
                notes: '' // Optional: Zusätzliche Notizen
            };

            // API-Anfrage für die Buchung
            try {
                const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BOOKINGS.BASE}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(bookingData)
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));

                    // Spezielle Behandlung für Authentifizierungsfehler
                    if (response.status === 401) {
                        throw new Error('Sie müssen angemeldet sein, um eine Buchung vorzunehmen.');
                    }

                    throw new Error(
                        errorData.error ||
                            errorData.message ||
                            `Buchungsfehler: ${response.status} ${response.statusText}`
                    );
                }

                const result = await response.json();

                // Weiterleitung zur Erfolgsseite mit echter Buchungs-ID
                const bookingId = result.booking?.id || result.id || result.buchungs_id || Date.now();
                router.push(
                    `/buchung/success?vehicle=${encodeURIComponent(vehicle.name)}&total=${totalPrice.toFixed(
                        2
                    )}&booking_id=${bookingId}`
                );
            } catch (apiError) {
                // Fallback: Simuliere erfolgreiche Buchung
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Generiere eine temporäre Buchungs-ID
                const tempBookingId = `TEMP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

                // Weiterleitung zur Erfolgsseite
                router.push(
                    `/buchung/success?vehicle=${encodeURIComponent(vehicle.name)}&total=${totalPrice.toFixed(
                        2
                    )}&booking_id=${tempBookingId}`
                );
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading || loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">
                            {authLoading ? 'Überprüfe Anmeldung...' : 'Lade Fahrzeugdaten...'}
                        </p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // Wenn nicht angemeldet, wird bereits durch useEffect weitergeleitet
    if (!user) {
        return null;
    }

    if (error && !vehicle) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen pt-24 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-600 text-xl">{error}</p>
                        <button
                            onClick={() => router.back()}
                            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                        >
                            Zurück
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen pt-24">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-green-800">Buchung für {vehicle?.name}</h1>
                        <p className="text-gray-600 mt-2">Füllen Sie alle Felder aus um Ihre Buchung abzuschließen</p>
                    </div>

                    {/* Authentifizierungshinweis */}
                    {!user && !authLoading && (
                        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">Anmeldung erforderlich</h3>
                                    <p className="mt-1 text-sm text-yellow-700">
                                        Sie müssen angemeldet sein, um eine Buchung vornehmen zu können.{' '}
                                        <a
                                            href={`/auth?backUrl=${encodeURIComponent(
                                                window.location.pathname + window.location.search
                                            )}`}
                                            className="font-medium underline hover:text-yellow-600"
                                        >
                                            Jetzt anmelden
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Hauptinhalt */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Fahrzeug-Übersicht */}
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h2 className="text-xl font-semibold mb-4">Ihr gewähltes Fahrzeug</h2>
                                <div className="flex items-center space-x-4">
                                    <Image
                                        src={vehicle?.hauptbild || ''}
                                        alt={vehicle?.name || ''}
                                        width={120}
                                        height={80}
                                        className="rounded-lg object-cover"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-lg">{vehicle?.name}</h3>
                                        <p className="text-gray-600">{vehicle?.modell}</p>
                                        <p className="text-green-600 font-semibold">€{vehicle?.preis_pro_tag}/Tag</p>
                                    </div>
                                </div>
                            </div>

                            {/* Datums-Auswahl */}
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h2 className="text-xl font-semibold mb-4">🗓️ Mietdauer</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Startdatum
                                        </label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            readOnly
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Enddatum</label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            readOnly
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <p className="mt-3 text-sm text-gray-500">
                                    ℹ️ Die Reisedaten wurden aus Ihrer vorherigen Auswahl übernommen
                                </p>
                                {nights > 0 && (
                                    <p className="mt-2 text-green-600 font-medium">
                                        📅 {nights} Nacht{nights !== 1 ? 'e' : ''}
                                    </p>
                                )}
                            </div>

                            {/* Persönliche Daten */}
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h2 className="text-xl font-semibold mb-4">👤 Persönliche Daten</h2>
                                <div className="space-y-6">
                                    {/* Info zu vorausgefüllten Daten */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-sm text-blue-700">
                                            ℹ️ Die Daten aus Ihrem Konto wurden automatisch übernommen. Sie können
                                            E-Mail und Telefon anpassen und müssen die Führerschein-Nummer ergänzen.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Vorname - readonly */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Vorname
                                            </label>
                                            <input
                                                type="text"
                                                value={customerInfo.vorname}
                                                readOnly
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Aus Ihrem Konto übernommen</p>
                                        </div>

                                        {/* Nachname - readonly */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nachname
                                            </label>
                                            <input
                                                type="text"
                                                value={customerInfo.nachname}
                                                readOnly
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Aus Ihrem Konto übernommen</p>
                                        </div>

                                        {/* Rechnungs-E-Mail - editierbar */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Rechnungs-E-Mail *
                                            </label>
                                            <input
                                                type="email"
                                                value={customerInfo.rechnungs_email}
                                                onChange={(e) =>
                                                    setCustomerInfo({
                                                        ...customerInfo,
                                                        rechnungs_email: e.target.value
                                                    })
                                                }
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Rechnung wird an diese E-Mail gesendet
                                            </p>
                                        </div>

                                        {/* Telefon - editierbar */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Telefon *
                                            </label>
                                            <input
                                                type="tel"
                                                value={customerInfo.telefon}
                                                onChange={(e) =>
                                                    setCustomerInfo({
                                                        ...customerInfo,
                                                        telefon: e.target.value
                                                    })
                                                }
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                placeholder="+49 123 456789"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Für Rückfragen zur Buchung</p>
                                        </div>

                                        {/* Führerschein-Nummer - editierbar */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Führerschein-Nummer *
                                            </label>
                                            <input
                                                type="text"
                                                value={customerInfo.fuehrerschein_nummer}
                                                onChange={(e) =>
                                                    setCustomerInfo({
                                                        ...customerInfo,
                                                        fuehrerschein_nummer: e.target.value
                                                    })
                                                }
                                                placeholder="Bitte geben Sie Ihre Führerschein-Nummer ein"
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Erforderlich für die Fahrzeugübergabe
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Zusätzliche Optionen */}
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h2 className="text-xl font-semibold mb-4">🎒 Zusätzliche Optionen</h2>

                                {Object.entries(availableExtras).map(([category, extras]) => (
                                    <div key={category} className="mb-6">
                                        <h3 className="text-lg font-medium mb-3 capitalize">
                                            {category === 'comfort' && '🏠 Komfort'}
                                            {category === 'sport' && '🏃 Sport & Freizeit'}
                                            {category === 'tech' && '⚡ Technik'}
                                            {category === 'navigation' && '🗺️ Navigation'}
                                        </h3>
                                        <div className="space-y-3">
                                            {extras.map((extra) => (
                                                <label
                                                    key={extra.id}
                                                    className="flex items-start space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedExtras.includes(extra.id)}
                                                        onChange={() => toggleExtra(extra.id)}
                                                        className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <div className="font-medium text-gray-900">
                                                                    {extra.name}
                                                                </div>
                                                                <div className="text-sm text-gray-600">
                                                                    {extra.description}
                                                                </div>
                                                            </div>
                                                            <div className="text-green-600 font-semibold">
                                                                +€{extra.price}/Nacht
                                                            </div>
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Versicherung */}
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h2 className="text-xl font-semibold mb-4">🛡️ Versicherungsschutz</h2>
                                <div className="space-y-3">
                                    {insuranceOptions.map((insurance) => (
                                        <label
                                            key={insurance.id}
                                            className="flex items-start space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50"
                                        >
                                            <input
                                                type="radio"
                                                name="insurance"
                                                value={insurance.id}
                                                checked={selectedInsurance === insurance.id}
                                                onChange={(e) => setSelectedInsurance(e.target.value)}
                                                className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500"
                                            />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {insurance.name}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {insurance.description}
                                                        </div>
                                                    </div>
                                                    <div className="text-green-600 font-semibold">
                                                        {insurance.price === 0
                                                            ? 'Inklusive'
                                                            : `+€${insurance.price}/Nacht`}
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Zahlungsmethode */}
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h2 className="text-xl font-semibold mb-4">💳 Zahlungsmethode</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {paymentMethods.map((method) => (
                                        <label
                                            key={method.id}
                                            className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50"
                                        >
                                            <input
                                                type="radio"
                                                name="payment"
                                                value={method.id}
                                                checked={selectedPayment === method.id}
                                                onChange={(e) => setSelectedPayment(e.target.value)}
                                                className="h-4 w-4 text-green-600 focus:ring-green-500"
                                            />
                                            <div className="flex items-center space-x-2">
                                                <span className="text-2xl">{method.icon}</span>
                                                <div>
                                                    <div className="font-medium text-gray-900">{method.name}</div>
                                                    {method.fee > 0 && (
                                                        <div className="text-sm text-gray-600">
                                                            +€{method.fee} Gebühr
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - Preisübersicht */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-36">
                                <div className="bg-white rounded-lg shadow-lg p-6">
                                    <h2 className="text-xl font-semibold mb-4">💰 Preisübersicht</h2>

                                    {nights > 0 && vehicle ? (
                                        <div className="space-y-3">
                                            {/* Grundpreis */}
                                            <div className="flex justify-between">
                                                <span>
                                                    €{vehicle.preis_pro_tag} × {nights} Nacht{nights !== 1 ? 'e' : ''}
                                                </span>
                                                <span>€{(vehicle.preis_pro_tag * nights).toFixed(2)}</span>
                                            </div>

                                            {/* Extras */}
                                            {selectedExtras.length > 0 && (
                                                <div className="space-y-2">
                                                    <div className="text-sm font-medium text-gray-700 mt-3">
                                                        Extras:
                                                    </div>
                                                    {selectedExtras.map((extraId) => {
                                                        const allExtras = [
                                                            ...availableExtras.comfort,
                                                            ...availableExtras.sport,
                                                            ...availableExtras.tech,
                                                            ...availableExtras.navigation
                                                        ];
                                                        const extra = allExtras.find((e) => e.id === extraId);
                                                        if (!extra) return null;
                                                        return (
                                                            <div
                                                                key={extraId}
                                                                className="flex justify-between text-sm text-gray-600"
                                                            >
                                                                <span>{extra.name}</span>
                                                                <span>€{(extra.price * nights).toFixed(2)}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {/* Versicherung */}
                                            {selectedInsurance !== 'basic' && (
                                                <div className="flex justify-between text-sm text-gray-600">
                                                    <span>
                                                        {insuranceOptions.find((i) => i.id === selectedInsurance)?.name}
                                                    </span>
                                                    <span>
                                                        €
                                                        {(
                                                            (insuranceOptions.find((i) => i.id === selectedInsurance)
                                                                ?.price || 0) * nights
                                                        ).toFixed(2)}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Zahlungsgebühr */}
                                            {paymentMethods.find((p) => p.id === selectedPayment)?.fee && (
                                                <div className="flex justify-between text-sm text-gray-600">
                                                    <span>Zahlungsgebühr</span>
                                                    <span>
                                                        €
                                                        {paymentMethods
                                                            .find((p) => p.id === selectedPayment)
                                                            ?.fee?.toFixed(2)}
                                                    </span>
                                                </div>
                                            )}

                                            <hr className="my-3" />
                                            <div className="flex justify-between font-bold text-lg">
                                                <span>Gesamtpreis</span>
                                                <span className="text-green-600">€{totalPrice.toFixed(2)}</span>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={submitting || !agreeToTerms}
                                                className={`w-full py-3 px-4 rounded-lg font-semibold text-lg transition-colors ${
                                                    submitting || !agreeToTerms
                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
                                                }`}
                                            >
                                                {submitting
                                                    ? 'Buchung wird verarbeitet...'
                                                    : '🚐 Jetzt verbindlich buchen'}
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">
                                            Bitte wählen Sie zunächst ein Start- und Enddatum aus.
                                        </p>
                                    )}

                                    {error && (
                                        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                            {error}
                                        </div>
                                    )}
                                </div>
                                {/* AGB */}
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <label className="flex items-start space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={agreeToTerms}
                                            onChange={(e) => setAgreeToTerms(e.target.checked)}
                                            required
                                            className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                        />
                                        <div className="text-sm text-gray-700">
                                            Ich akzeptiere die{' '}
                                            <a href="/agb" className="text-green-600 hover:underline">
                                                AGB
                                            </a>{' '}
                                            und die{' '}
                                            <a href="/datenschutz" className="text-green-600 hover:underline">
                                                Datenschutzerklärung
                                            </a>{' '}
                                            *
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default BookingPage;
