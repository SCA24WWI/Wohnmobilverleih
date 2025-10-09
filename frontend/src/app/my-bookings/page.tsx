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
    status: 'angefragt' | 'bestätigt' | 'storniert' | 'abgeschlossen' | 'abgelehnt';
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

const statusColors = {
    angefragt: 'bg-yellow-100 text-yellow-800',
    bestätigt: 'bg-green-100 text-green-800',
    storniert: 'bg-red-100 text-red-800',
    abgeschlossen: 'bg-blue-100 text-blue-800',
    abgelehnt: 'bg-gray-100 text-gray-800'
};

const statusLabels = {
    angefragt: 'Angefragt',
    bestätigt: 'Bestätigt',
    storniert: 'Storniert',
    abgeschlossen: 'Abgeschlossen',
    abgelehnt: 'Abgelehnt'
};

const MyBookingsPage: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('alle');

    // Get display text for empty state
    const getEmptyStateText = (currentFilter: string) => {
        if (currentFilter === 'alle') {
            return {
                title: 'Keine Buchungen gefunden',
                description: 'Sie haben noch keine Buchungen vorgenommen.'
            };
        }

        const statusLabel = statusLabels[currentFilter as keyof typeof statusLabels];
        if (statusLabel) {
            return {
                title: `Keine ${statusLabel.toLowerCase()}en Buchungen`,
                description: `Sie haben keine Buchungen mit dem Status "${statusLabel}".`
            };
        }

        return {
            title: 'Keine Buchungen gefunden',
            description: 'Für diesen Filter wurden keine Buchungen gefunden.'
        };
    };

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
                setError(`Fehler beim Laden der Buchungen: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchBookings();
        }
    }, [user]);

    // Filtered bookings
    const filteredBookings = bookings.filter((booking) => {
        if (filter === 'alle') return true;
        return booking.status === filter;
    });

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

    if (authLoading || loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
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

    if (!user) {
        return null;
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 pt-24">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Meine Buchungen</h1>
                        <p className="text-gray-600 mt-2">Hier finden Sie alle Ihre Wohnmobil-Buchungen im Überblick</p>
                    </div>

                    {/* Filter */}
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                            {['alle', 'angefragt', 'bestätigt', 'abgeschlossen', 'storniert'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        filter === status
                                            ? 'bg-green-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                    }`}
                                >
                                    {status === 'alle' ? 'Alle' : statusLabels[status as keyof typeof statusLabels]}
                                    {status !== 'alle' && (
                                        <span className="ml-2 text-xs opacity-75">
                                            ({bookings.filter((b) => b.status === status).length})
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Error handling */}
                    {error && (
                        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    {/* Bookings list */}
                    {filteredBookings.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                            <div className="text-gray-400 text-6xl mb-4">🚐</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {getEmptyStateText(filter).title}
                            </h3>
                            <p className="text-gray-600 mb-6">{getEmptyStateText(filter).description}</p>
                            <a
                                href="/wohnmobile"
                                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Wohnmobile entdecken
                            </a>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredBookings.map((booking) => (
                                <div key={booking.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                            <div className="mb-2 md:mb-0">
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    {booking.vehicle_name || `Wohnmobil #${booking.wohnmobil_id}`}
                                                </h3>
                                                <p className="text-gray-600">{booking.modell}</p>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                        statusColors[booking.status]
                                                    }`}
                                                >
                                                    {statusLabels[booking.status]}
                                                </span>
                                                <span className="text-sm text-gray-500">Buchung #{booking.id}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {/* Vehicle image */}
                                            <div className="md:col-span-1">
                                                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                                                    {booking.hauptbild ? (
                                                        <Image
                                                            src={booking.hauptbild}
                                                            alt={booking.vehicle_name || 'Motorhome'}
                                                            width={300}
                                                            height={200}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <span className="text-4xl">🚐</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Booking details */}
                                            <div className="md:col-span-2">
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                                    <div>
                                                        <span className="font-medium text-gray-700">Anreise:</span>
                                                        <p className="text-gray-900">
                                                            {formatDate(booking.start_datum)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-gray-700">Abreise:</span>
                                                        <p className="text-gray-900">{formatDate(booking.end_datum)}</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-gray-700">Nächte:</span>
                                                        <p className="text-gray-900">
                                                            {booking.anzahl_naechte || 'N/A'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-gray-700">Gesamtpreis:</span>
                                                        <p className="text-gray-900 font-semibold">
                                                            {formatPrice(booking.gesamtpreis)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-gray-700">Gebucht am:</span>
                                                        <p className="text-gray-900">
                                                            {formatDate(booking.gebucht_am)}
                                                        </p>
                                                    </div>
                                                    {booking.preis_pro_tag && (
                                                        <div>
                                                            <span className="font-medium text-gray-700">
                                                                Preis/Tag:
                                                            </span>
                                                            <p className="text-gray-900">
                                                                {formatPrice(booking.preis_pro_tag)}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Extras */}
                                                {booking.extras && booking.extras.length > 0 && (
                                                    <div className="mt-4">
                                                        <span className="font-medium text-gray-700">Extras:</span>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {booking.extras.map((extra, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                                                                >
                                                                    {extra}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Notes */}
                                                {booking.notizen && (
                                                    <div className="mt-4">
                                                        <span className="font-medium text-gray-700">Notizen:</span>
                                                        <p className="text-gray-600 text-sm mt-1">{booking.notizen}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-6 flex flex-wrap gap-3 border-t pt-4">
                                            <a
                                                href={`/wohnmobile/${booking.wohnmobil_id}`}
                                                className="text-green-600 hover:text-green-700 text-sm font-medium"
                                            >
                                                Fahrzeug ansehen
                                            </a>
                                            {booking.status === 'bestätigt' && (
                                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                                    Buchungsdetails
                                                </button>
                                            )}
                                            {(booking.status === 'angefragt' || booking.status === 'bestätigt') && (
                                                <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                                                    Stornieren
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination could be added here */}
                    {filteredBookings.length > 0 && (
                        <div className="mt-8 text-center">
                            <p className="text-gray-600">
                                {filteredBookings.length} von {bookings.length} Buchungen angezeigt
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MyBookingsPage;
