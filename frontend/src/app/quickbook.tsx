'use client';

import React, { useState, useEffect } from 'react';
import { Typography } from '@material-tailwind/react';
import { QuickbookSearchBar, VehicleCard } from '@/components';
import { API_CONFIG, buildApiUrl } from '@/config/api';

async function fetchVehicles(filters?: SearchFilters): Promise<Vehicle[]> {
    try {
        // Build query parameters object
        const queryParams = filters
            ? {
                  location: filters.location?.trim() || undefined,
                  guests: filters.guests > 0 ? filters.guests : undefined,
                  dateFrom: filters.dateFrom || undefined,
                  dateTo: filters.dateTo || undefined
              }
            : undefined;

        const url = buildApiUrl(API_CONFIG.ENDPOINTS.VEHICLES.SEARCH, queryParams);
        console.log('Fetching from URL:', url);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch vehicles');
        }
        const apiData = await response.json();

        return apiData.map((vehicle: any, index: number) => ({
            id: vehicle.id || index,
            name: vehicle.name || 'Unbekanntes Fahrzeug',
            type: vehicle.modell || 'Unbekannt',
            guests: vehicle.bettenzahl || 2,
            location: 'Deutschland', // Da keine Location in API-Response, setze default
            pricePerDay: parseFloat(vehicle.preis_pro_tag) || 0,
            image: `/image/books/RectangleBig${(index % 7) + 1}.svg`, // Verwende vorhandene Bilder rotierend
            features: getFeaturesByModel(vehicle.modell || '', vehicle.bettenzahl || 2), // Generiere Features basierend auf Modell
            available: true,
            fuehrerschein: vehicle.fuehrerschein || '',
            beschreibung: vehicle.beschreibung || null
        }));
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        throw error;
    }
}

// Hilfsfunktion um Features basierend auf Modell zu generieren
function getFeaturesByModel(modell: string, bettenzahl: number): string[] {
    const baseFeatures = ['Küche', 'Bett'];

    if (!modell) return baseFeatures;

    const modellLower = modell.toLowerCase();

    if (modellLower.includes('teilintegriert')) {
        return [...baseFeatures, 'Dusche', 'WC', 'Sitzgruppe'];
    } else if (modellLower.includes('alkoven')) {
        return [...baseFeatures, 'Dusche', 'WC', 'Sitzgruppe', 'Großer Stauraum'];
    } else if (modellLower.includes('vollintegriert')) {
        return [...baseFeatures, 'Dusche', 'WC', 'Sitzgruppe', 'Klimaanlage', 'Luxus-Ausstattung'];
    } else if (modellLower.includes('kastenwagen')) {
        return [...baseFeatures, 'Kompakt', 'Stadtfahrtauglich'];
    }

    return baseFeatures;
}

// Interfaces
interface Vehicle {
    id: number;
    name: string;
    type: string; // modell aus API
    guests: number; // bettenzahl aus API
    location: string;
    pricePerDay: number; // preis_pro_tag aus API
    image: string;
    features: string[];
    available: boolean;
    fuehrerschein?: string; // Zusätzlich aus API
    beschreibung?: string; // Zusätzlich aus API
}

interface SearchFilters {
    location: string;
    dateFrom: string;
    dateTo: string;
    guests: number;
}

export function Quickbook() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (filters: SearchFilters) => {
        try {
            setIsSearching(true);
            setHasSearched(true);
            setError(null);

            const results = await fetchVehicles(filters);
            setVehicles(results); // Store all vehicles for future filtering
            setFilteredVehicles(results);
        } catch (err) {
            setError('Fehler bei der Suche. Bitte versuchen Sie es erneut.');
            console.error('Error searching vehicles:', err);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Search Bar */}
            <div className="mb-12">
                <QuickbookSearchBar onSearch={handleSearch} />
            </div>

            {/* Error State */}
            {error && (
                <div className="text-center py-16 px-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                        <Typography variant="h5" className="text-red-800 mb-2 font-semibold">
                            Fehler
                        </Typography>
                        <Typography className="text-red-600 mb-4">{error}</Typography>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            Seite neu laden
                        </button>
                    </div>
                </div>
            )}

            {/* Search Loading State */}
            {isSearching && (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <Typography className="mt-4 text-gray-600">Suche Wohnmobile...</Typography>
                </div>
            )}

            {/* Results Header */}
            {!isSearching && hasSearched && !error && (
                <div className="mb-8 px-4">
                    <Typography variant="h4" className="text-2xl font-bold text-gray-900 mb-2">
                        Suchergebnisse
                    </Typography>
                    <Typography className="text-gray-600">
                        {filteredVehicles.length} {filteredVehicles.length === 1 ? 'Wohnmobil' : 'Wohnmobile'} gefunden
                    </Typography>
                </div>
            )}

            {/* Vehicle Grid */}
            {!isSearching && !error && hasSearched && (
                <div className="px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredVehicles.map((vehicle) => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} />
                        ))}
                    </div>
                </div>
            )}

            {/* No Results */}
            {!isSearching && hasSearched && filteredVehicles.length === 0 && !error && (
                <div className="text-center py-16 px-4">
                    <Typography variant="h4" className="text-2xl font-bold text-gray-900 mb-4">
                        Keine Wohnmobile gefunden
                    </Typography>
                    <Typography className="text-gray-600 max-w-md mx-auto">
                        Versuche deine Suchkriterien zu ändern oder durchstöbere alle verfügbaren Fahrzeuge.
                    </Typography>
                </div>
            )}
        </div>
    );
}

export default Quickbook;
