'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import BookingForm from '@/components/BookingForm';
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

const VehicleDetailPage: React.FC = () => {
  const params = useParams();
  const vehicleId = params.id as string;
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Beispiel-Bilder (später dynamisch aus der Datenbank laden)
  const sampleImages = [
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fehler beim Laden der Fahrzeugdaten');
      } finally {
        setLoading(false);
      }
    };

    if (vehicleId) {
      fetchVehicle();
    }
  }, [vehicleId]);

  // Bildergalerie Navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % sampleImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + sampleImages.length) % sampleImages.length);
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><a href="/" className="hover:text-blue-600">Home</a></li>
            <li className="before:content-['/'] before:mx-2">
              <a href="/wohnmobile" className="hover:text-blue-600">Wohnmobile</a>
            </li>
            <li className="before:content-['/'] before:mx-2 text-gray-900 font-medium">
              {vehicle.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Linke Spalte: Bilder und Details */}
          <div className="lg:col-span-2">
            {/* Bildergalerie */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="relative aspect-video">
                <Image
                  src={sampleImages[currentImageIndex]}
                  alt={`${vehicle.name} - Bild ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                />
                
                {/* Navigation Buttons */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                >
                  ←
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                >
                  →
                </button>
                
                {/* Bild-Indikatoren */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {sampleImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
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
                  {vehicle.beschreibung || 'Dieses komfortable Wohnmobil bietet alles, was Sie für einen unvergesslichen Urlaub benötigen. Perfekt ausgestattet für Ihre Reise mit Familie oder Freunden.'}
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

            {/* Verfügbarkeitskalender Platzhalter */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Verfügbarkeitskalender</h2>
              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <p className="text-gray-600">
                  📅 Kalender wird hier implementiert
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Zeigt verfügbare und gebuchte Tage an
                </p>
              </div>
            </div>
          </div>

          {/* Rechte Spalte: Buchungsformular */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BookingForm vehicle={vehicle} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailPage;