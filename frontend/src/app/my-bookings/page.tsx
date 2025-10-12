'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Navbar, Footer } from '@/components';
import { API_CONFIG, buildApiUrl } from '@/config/api';
import { useAuth } from '@/contexts/AuthContext';

// Interface for booking data
interface Booking {
    id: number;
    wohnmobil_id: number;
    kunde_id: number;
    start_datum: string;
    end_datum: string;
    anzahl_naechte: number;
    gesamtpreis: number;
    extras: string[] | null;
    notizen: string | null;
    gebucht_am: string;
    geaendert_am: string;
    // Vehicle data (from JOIN)
    vehicle_name?: string;
    modell?: string;
    preis_pro_tag?: number;
    hauptbild?: string;
}

const MyBookingsPage: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Authentication check
    useEffect(() => {
        if (!authLoading && !user) {
            const currentUrl = window.location.pathname + window.location.search;
            router.push(`/auth?backUrl=${encodeURIComponent(currentUrl)}`);
        }
    }, [authLoading, user, router]);

    // Load bookings
    useEffect(() => {
        const fetchBookings = async () => {
            if (!user?.id) {
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.USERS?.BASE || '/api/users'}/${user.id}/bookings`);
                const response = await fetch(url);

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP ${response.status}: ${errorText}`);
                }

                const data = await response.json();

                if (Array.isArray(data)) {
                    setBookings(data);
                } else {
                    setError('Unerwartetes Datenformat vom Server');
                }
            } catch (err) {
                setError(
                    `Fehler beim Laden der Buchungen: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`
                );
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchBookings();
        }
    }, [user]);

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Format price
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    };

    // Determine booking status based on dates (simple logic)
    const getBookingStatus = (booking: Booking) => {
        const today = new Date();
        const startDate = new Date(booking.start_datum);
        const endDate = new Date(booking.end_datum);

        if (endDate < today) {
            return { label: 'Abgeschlossen', color: 'bg-gray-100 text-gray-800' };
        } else if (startDate <= today && endDate >= today) {
            return { label: 'Aktiv', color: 'bg-green-100 text-green-800' };
        } else {
            return { label: 'Geplant', color: 'bg-blue-100 text-blue-800' };
        }
    };

    if (authLoading || loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen pt-24 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">
                            {authLoading ? 'Überprüfe Anmeldung...' : 'Lade Buchungen...'}
                        </p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen pt-24">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-green-800 mb-2">Meine Buchungen</h1>
                        <p className="text-gray-600">Hier finden Sie eine Übersicht all Ihrer Buchungen.</p>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            <p className="font-medium">Fehler beim Laden der Buchungen</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Alle Buchungen ({bookings.length})
                                </h2>
                            </div>
                        </div>

                        {bookings.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl">🚐</span>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Buchungen gefunden</h3>
                                <p className="text-gray-600 mb-6">Sie haben noch keine Buchungen vorgenommen.</p>
                                <button
                                    onClick={() => router.push('/wohnmobile')}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Wohnmobile entdecken
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {bookings.map((booking) => {
                                    const status = getBookingStatus(booking);
                                    return (
                                        <div key={booking.id} className="px-6 py-6">
                                            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                                {/* Vehicle Image */}
                                                <div className="w-full lg:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                    {booking.hauptbild ? (
                                                        <Image
                                                            src={booking.hauptbild}
                                                            alt={booking.vehicle_name || 'Wohnmobil'}
                                                            width={192}
                                                            height={128}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <span className="text-4xl">🚐</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Booking Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                                    {booking.vehicle_name || 'Unbekanntes Fahrzeug'}
                                                                </h3>
                                                                <span
                                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                                                                >
                                                                    {status.label}
                                                                </span>
                                                            </div>

                                                            {booking.modell && (
                                                                <p className="text-sm text-gray-600 mb-3">
                                                                    {booking.modell}
                                                                </p>
                                                            )}

                                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                                <div>
                                                                    <p className="text-gray-500">Anreise:</p>
                                                                    <p className="font-medium">
                                                                        {formatDate(booking.start_datum)}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-500">Abreise:</p>
                                                                    <p className="font-medium">
                                                                        {formatDate(booking.end_datum)}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-500">Dauer:</p>
                                                                    <p className="font-medium">
                                                                        {booking.anzahl_naechte} Nächte
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-500">Gebucht am:</p>
                                                                    <p className="font-medium">
                                                                        {formatDate(booking.gebucht_am)}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {booking.notizen && (
                                                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                                    <p className="text-sm text-gray-600">
                                                                        <span className="font-medium">Notizen: </span>
                                                                        {booking.notizen}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex flex-col items-end gap-3">
                                                            <div className="text-right">
                                                                <p className="text-2xl font-bold text-green-600">
                                                                    {formatPrice(booking.gesamtpreis)}
                                                                </p>
                                                                <p className="text-sm text-gray-500">Gesamtpreis</p>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() =>
                                                                        router.push(
                                                                            `/wohnmobile/${booking.wohnmobil_id}`
                                                                        )
                                                                    }
                                                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                                                                >
                                                                    Details ansehen
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MyBookingsPage;
