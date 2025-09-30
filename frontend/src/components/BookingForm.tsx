'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  erstellt_am: string;
}

// Interface für Buchungsdaten
interface BookingData {
  vehicle_id: number;
  user_id: number;
  start_date: string;
  end_date: string;
  total_price: number;
  customer_info: {
    vorname: string;
    nachname: string;
    email: string;
  };
  extras: string[];
}

// Interface für Props
interface BookingFormProps {
  vehicle: Vehicle;
}

// Zusätzliche Extras mit Preisen
const availableExtras = [
  { id: 'fahrradtraeger', name: 'Fahrradträger', price: 15 },
  { id: 'campingmoebel', name: 'Campingmöbel Set', price: 25 },
  { id: 'grill', name: 'Camping-Grill', price: 10 },
  { id: 'markise', name: 'Zusätzliche Markise', price: 20 },
  { id: 'outdoor_set', name: 'Outdoor-Equipment', price: 30 },
];

const BookingForm: React.FC<BookingFormProps> = ({ vehicle }) => {
  const router = useRouter();
  
  // State für Formulardaten
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [customerInfo, setCustomerInfo] = useState({
    vorname: '',
    nachname: '',
    email: ''
  });
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Preisberechnung
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start < end) {
        const timeDiff = end.getTime() - start.getTime();
        const calculatedNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
        setNights(calculatedNights);
        
        // Grundpreis berechnen
        const basePrice = calculatedNights * vehicle.preis_pro_tag;
        
        // Extras-Preis berechnen
        const extrasPrice = selectedExtras.reduce((sum, extraId) => {
          const extra = availableExtras.find(e => e.id === extraId);
          return sum + (extra ? extra.price * calculatedNights : 0);
        }, 0);
        
        setTotalPrice(basePrice + extrasPrice);
      } else {
        setNights(0);
        setTotalPrice(0);
      }
    } else {
      setNights(0);
      setTotalPrice(0);
    }
  }, [startDate, endDate, selectedExtras, vehicle.preis_pro_tag]);

  // Extra auswählen/abwählen
  const toggleExtra = (extraId: string) => {
    setSelectedExtras(prev => 
      prev.includes(extraId) 
        ? prev.filter(id => id !== extraId)
        : [...prev, extraId]
    );
  };

  // Formular-Validierung
  const validateForm = (): boolean => {
    if (!startDate || !endDate) {
      setError('Bitte wählen Sie Start- und Enddatum aus.');
      return false;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      setError('Das Enddatum muss nach dem Startdatum liegen.');
      return false;
    }

    if (start < new Date(new Date().toDateString())) {
      setError('Das Startdatum darf nicht in der Vergangenheit liegen.');
      return false;
    }

    if (!customerInfo.vorname || !customerInfo.nachname || !customerInfo.email) {
      setError('Bitte füllen Sie alle persönlichen Daten aus.');
      return false;
    }

    // E-Mail-Validierung
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      setError('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return false;
    }

    return true;
  };

  // Verfügbarkeit prüfen
  const checkAvailability = async (): Promise<boolean> => {
    try {
      const response = await fetch(
        buildApiUrl(API_CONFIG.ENDPOINTS.BOOKINGS.CHECK_AVAILABILITY, {
          vehicle_id: vehicle.id.toString(),
          start_date: startDate,
          end_date: endDate
        })
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fehler bei der Verfügbarkeitsprüfung');
      }

      const data = await response.json();
      return data.available;
    } catch (err) {
      console.error('Availability check error:', err);
      throw err;
    }
  };

  // Buchung absenden
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Verfügbarkeit prüfen
      const isAvailable = await checkAvailability();
      if (!isAvailable) {
        throw new Error('Das Fahrzeug ist im gewählten Zeitraum nicht verfügbar.');
      }

      // Buchungsdaten vorbereiten
      const bookingData: BookingData = {
        vehicle_id: vehicle.id,
        user_id: 1, // Temporär hardcodiert - später aus Auth-Context nehmen
        start_date: startDate,
        end_date: endDate,
        total_price: totalPrice,
        customer_info: customerInfo,
        extras: selectedExtras
      };

      // Buchung erstellen
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.BOOKINGS.BASE), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Fehler beim Erstellen der Buchung');
      }

      const booking = await response.json();
      
      // Weiterleitung zur Bestätigungsseite
      router.push(`/buchung/erfolgreich?booking_id=${booking.id}`);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Buchung anfragen</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datums-Auswahl */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Startdatum
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              max={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enddatum
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || new Date().toISOString().split('T')[0]}
              max={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Persönliche Daten */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Persönliche Daten</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vorname *
            </label>
            <input
              type="text"
              value={customerInfo.vorname}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, vorname: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ihr Vorname"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nachname *
            </label>
            <input
              type="text"
              value={customerInfo.nachname}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, nachname: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ihr Nachname"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-Mail *
            </label>
            <input
              type="email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ihre.email@beispiel.de"
            />
          </div>
        </div>

        {/* Zusätzliche Optionen */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Zusätzliche Optionen</h3>
          <div className="space-y-3">
            {availableExtras.map((extra) => (
              <label key={extra.id} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedExtras.includes(extra.id)}
                  onChange={() => toggleExtra(extra.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm text-gray-700">
                  {extra.name} (+€{extra.price}/Nacht)
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Preisübersicht */}
        {nights > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Preisübersicht</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>€{vehicle.preis_pro_tag} × {nights} Nächte</span>
                <span>€{(vehicle.preis_pro_tag * nights).toFixed(2)}</span>
              </div>
              
              {selectedExtras.length > 0 && (
                <div className="space-y-1">
                  {selectedExtras.map(extraId => {
                    const extra = availableExtras.find(e => e.id === extraId);
                    if (!extra) return null;
                    return (
                      <div key={extraId} className="flex justify-between text-gray-600">
                        <span>{extra.name} × {nights} Nächte</span>
                        <span>€{(extra.price * nights).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Gesamtpreis</span>
                <span>€{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || nights === 0}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            loading || nights === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }`}
        >
          {loading ? 'Buchung wird geprüft...' : 'Buchung anfragen'}
        </button>
      </form>
      
      <p className="text-xs text-gray-500 mt-4">
        * Pflichtfelder. Ihre Buchung wird zunächst als Anfrage behandelt und muss vom Vermieter bestätigt werden.
      </p>
    </div>
  );
};

export default BookingForm;