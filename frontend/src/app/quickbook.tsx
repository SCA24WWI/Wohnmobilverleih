'use client';

import React, { useState, useEffect } from 'react';
import { Typography } from '@material-tailwind/react';
import { QuickbookSearchBar, VehicleCard } from '@/components';
import { API_CONFIG, buildApiUrl } from '@/config/api';

async function fetchVehicles(filters?: SearchFilters, page: number = 1): Promise<VehicleSearchResponse> {
    try {
        const queryParams = filters
            ? {
                  location: filters.location?.trim() || undefined,
                  guests: filters.guests > 0 ? filters.guests : undefined,
                  dateFrom: filters.dateFrom || undefined,
                  dateTo: filters.dateTo || undefined,
                  page: page.toString(),
                  limit: '6'
              }
            : { page: page.toString(), limit: '6' };

        const url = buildApiUrl(API_CONFIG.ENDPOINTS.VEHICLES.SEARCH, queryParams);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch vehicles');
        }

        const apiData = await response.json();

        const mappedVehicles = apiData.vehicles.map((vehicle: any, index: number) => ({
            id: vehicle.id || index,
            name: vehicle.name || 'Unbekanntes Fahrzeug',
            type: vehicle.modell || 'Unbekannt',
            guests: vehicle.bettenzahl || 2,
            location: vehicle.ort || 'Unbekannt',
            pricePerDay: parseFloat(vehicle.preis_pro_tag) || 0,
            image: `/image/books/RectangleBig${(index % 7) + 1}.svg`,
            features: getFeaturesByModel(vehicle.modell || '', vehicle.bettenzahl || 2),
            available: true,
            fuehrerschein: vehicle.fuehrerschein || '',
            beschreibung: vehicle.beschreibung || null
        }));

        return {
            vehicles: mappedVehicles,
            pagination: apiData.pagination
        };
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        throw error;
    }
}

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

interface Vehicle {
    id: number;
    name: string;
    type: string;
    guests: number;
    location: string;
    pricePerDay: number;
    image: string;
    features: string[];
    available: boolean;
    fuehrerschein?: string;
    beschreibung?: string;
}

interface SearchFilters {
    location: string;
    dateFrom: string;
    dateTo: string;
    guests: number;
}

interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalVehicles: number;
    vehiclesPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

interface VehicleSearchResponse {
    vehicles: Vehicle[];
    pagination: PaginationInfo;
}

export function Quickbook() {
    const [vehicleData, setVehicleData] = useState<VehicleSearchResponse | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentFilters, setCurrentFilters] = useState<SearchFilters | null>(null);

    const handleSearch = async (filters: SearchFilters, page: number = 1) => {
        try {
            setIsSearching(true);
            setHasSearched(true);
            setError(null);

            if (page === 1) {
                setCurrentFilters(filters);
            }

            const results = await fetchVehicles(filters, page);
            setVehicleData(results);
        } catch (err) {
            setError('Fehler bei der Suche. Bitte versuchen Sie es erneut.');
            console.error('Error searching vehicles:', err);
        } finally {
            setIsSearching(false);
        }
    };

    const handlePageChange = async (newPage: number) => {
        if (currentFilters && !isSearching) {
            await handleSearch(currentFilters, newPage);
        }
    };

    const renderPaginationButtons = () => {
        if (!vehicleData?.pagination || vehicleData.pagination.totalPages <= 1) {
            return null;
        }

        const { currentPage, totalPages, hasPreviousPage, hasNextPage } = vehicleData.pagination;
        const buttons = [];

        buttons.push(
            <button
                key="prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPreviousPage || isSearching}
                className={`px-4 py-2 mx-1 rounded-lg font-medium transition-colors ${
                    !hasPreviousPage || isSearching
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
            >
                Zurück
            </button>
        );

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                buttons.push(
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        disabled={isSearching}
                        className={`px-4 py-2 mx-1 rounded-lg font-medium transition-colors ${
                            i === currentPage
                                ? 'bg-green-600 text-white'
                                : isSearching
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {i}
                    </button>
                );
            } else if (
                (i === currentPage - 2 && currentPage > 3) ||
                (i === currentPage + 2 && currentPage < totalPages - 2)
            ) {
                buttons.push(
                    <span key={`ellipsis-${i}`} className="px-2 py-2 text-gray-500">
                        ...
                    </span>
                );
            }
        }

        buttons.push(
            <button
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage || isSearching}
                className={`px-4 py-2 mx-1 rounded-lg font-medium transition-colors ${
                    !hasNextPage || isSearching
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
            >
                Weiter
            </button>
        );

        return buttons;
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-12">
                <QuickbookSearchBar onSearch={(filters) => handleSearch(filters, 1)} />
            </div>

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

            {isSearching && (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <Typography className="mt-4 text-gray-600">Suche Wohnmobile...</Typography>
                </div>
            )}

            {!isSearching && hasSearched && !error && vehicleData && (
                <div className="mb-8 px-4">
                    <Typography variant="h4" className="text-2xl font-bold text-gray-900 mb-2">
                        Suchergebnisse
                    </Typography>
                    <Typography className="text-gray-600">
                        {vehicleData.pagination.totalVehicles}{' '}
                        {vehicleData.pagination.totalVehicles === 1 ? 'Wohnmobil' : 'Wohnmobile'} gefunden
                        {vehicleData.pagination.totalPages > 1 && (
                            <span>
                                {' '}
                                (Seite {vehicleData.pagination.currentPage} von {vehicleData.pagination.totalPages})
                            </span>
                        )}
                    </Typography>
                </div>
            )}

            {!isSearching && !error && hasSearched && vehicleData?.vehicles && (
                <div className="px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {vehicleData.vehicles.map((vehicle) => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} />
                        ))}
                    </div>
                </div>
            )}

            {!isSearching &&
                !error &&
                hasSearched &&
                vehicleData?.pagination &&
                vehicleData.pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center mt-12 px-4">
                        <div className="flex items-center">{renderPaginationButtons()}</div>
                    </div>
                )}

            {!isSearching && hasSearched && vehicleData?.vehicles?.length === 0 && !error && (
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
