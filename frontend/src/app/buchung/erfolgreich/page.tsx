'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { API_CONFIG, buildApiUrl } from '@/config/api';

// Interface für Buchungsdaten
interface BookingDetails {
  id: number;
  wohnmobil_id: number;
  kunde_id: number;
  start_datum: string;
  end_datum: string;
  gesamtpreis: number;
  status: string;
  gebucht_am: string;
  vehicle_name: string;
  modell: string;
  preis_pro_tag: number;
  vorname: string;
  nachname: string;
  email: string;
}

const BookingSuccessPage: React.FC = () => {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking_id');
  
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buchungsdetails laden
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setError('Keine Buchungs-ID gefunden');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.BOOKINGS.BASE}/${bookingId}`));
        
        if (!response.ok) {
          throw new Error('Buchung nicht gefunden');
        }
        
        const data = await response.json();
        setBooking(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fehler beim Laden der Buchungsdetails');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  // Hilfsfunktionen
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateNights = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Fehler</h1>
            <p className="text-gray-600 mb-6">{error || 'Buchungsdetails konnten nicht geladen werden'}</p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Zur Startseite
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const nights = calculateNights(booking.start_datum, booking.end_datum);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Buchungsanfrage erfolgreich gesendet!
          </h1>
          <p className="text-lg text-gray-600">
            Vielen Dank für Ihre Buchungsanfrage. Wir haben Ihnen eine Bestätigung per E-Mail gesendet.
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <h2 className="text-2xl font-bold">Buchungsdetails</h2>
            <p className="mt-2 opacity-90">Buchungs-Nr.: #{booking.id}</p>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Fahrzeug-Informationen */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Fahrzeug</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{booking.vehicle_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Modell:</span>
                    <span className="font-medium">{booking.modell}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Preis pro Nacht:</span>
                    <span className="font-medium">€{booking.preis_pro_tag}</span>
                  </div>
                </div>
              </div>

              {/* Buchungszeitraum */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Reisezeitraum</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in:</span>
                    <span className="font-medium">{formatDate(booking.start_datum)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out:</span>
                    <span className="font-medium">{formatDate(booking.end_datum)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Anzahl Nächte:</span>
                    <span className="font-medium">{nights} Nächte</span>
                  </div>
                </div>
              </div>

              {/* Gast-Informationen */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Kontaktdaten</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{booking.vorname} {booking.nachname}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">E-Mail:</span>
                    <span className="font-medium">{booking.email}</span>
                  </div>
                </div>
              </div>

              {/* Buchungsstatus */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === 'angefragt' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : booking.status === 'bestätigt'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status === 'angefragt' && 'Angefragt'}
                      {booking.status === 'bestätigt' && 'Bestätigt'}
                      {booking.status === 'storniert' && 'Storniert'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Angefragt am:</span>
                    <span className="font-medium">
                      {new Date(booking.gebucht_am).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Preisübersicht */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Preisübersicht</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>€{booking.preis_pro_tag} × {nights} Nächte</span>
                    <span>€{(booking.preis_pro_tag * nights).toFixed(2)}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Gesamtpreis</span>
                    <span>€{booking.gesamtpreis.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Wie geht es jetzt weiter?</h3>
          <div className="space-y-2 text-blue-800">
            <p>✓ Sie erhalten in Kürze eine E-Mail-Bestätigung mit allen Details</p>
            <p>✓ Der Vermieter wird Ihre Anfrage prüfen und sich binnen 24 Stunden bei Ihnen melden</p>
            <p>✓ Nach der Bestätigung erhalten Sie weitere Informationen zur Abholung</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors text-center"
          >
            Zur Startseite
          </Link>
          <Link
            href="/wohnmobile"
            className="bg-gray-200 text-gray-800 px-8 py-3 rounded-md hover:bg-gray-300 transition-colors text-center"
          >
            Weitere Wohnmobile entdecken
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            Fragen zu Ihrer Buchung? Kontaktieren Sie uns unter{' '}
            <a href="mailto:support@wohnmobilverleih.de" className="text-blue-600 hover:underline">
              support@wohnmobilverleih.de
            </a>{' '}
            oder telefonisch unter{' '}
            <a href="tel:+4901234567890" className="text-blue-600 hover:underline">
              +49 (0) 123 456 7890
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;