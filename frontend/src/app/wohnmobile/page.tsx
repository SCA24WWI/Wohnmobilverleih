'use client';

import { Navbar, Footer } from '@/components';
import { VehicleSearch } from '../vehiclesearch';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SearchFilters {
    location?: string;
    dateFrom?: string;
    dateTo?: string;
    guests?: number;
    guestMode?: 'minimum' | 'exact';
    // Ausstattung
    pets?: boolean;
    kitchen?: boolean;
    wifi?: boolean;
    bathroom?: boolean;
    airConditioning?: boolean;
    // Technische Daten
    transmission?: 'automatic' | 'manual' | '';
    fuelConsumption?: { min?: number; max?: number };
    enginePower?: { min?: number; max?: number };
    driveType?: 'front' | 'rear' | 'all' | '';
    emissionClass?: string;
    towingCapacity?: { min?: number; max?: number };
    emptyWeight?: { min?: number; max?: number };
    maxWeight?: { min?: number; max?: number };
    // Kosten
    priceRange?: { min?: number; max?: number };
}

export default function WohnmobilePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [initialFilters, setInitialFilters] = useState<SearchFilters | null>(null);
    const [hasSearchFromHero, setHasSearchFromHero] = useState(false);

    useEffect(() => {
        // URL-Parameter zu Filtern konvertieren
        const filters: SearchFilters = {};
        let hasFilters = false;

        if (searchParams.get('location')) {
            filters.location = searchParams.get('location') || undefined;
            hasFilters = true;
        }
        if (searchParams.get('dateFrom')) {
            filters.dateFrom = searchParams.get('dateFrom') || undefined;
            hasFilters = true;
        }
        if (searchParams.get('dateTo')) {
            filters.dateTo = searchParams.get('dateTo') || undefined;
            hasFilters = true;
        }
        if (searchParams.get('guests')) {
            filters.guests = parseInt(searchParams.get('guests') || '0') || undefined;
            hasFilters = true;
        }
        if (searchParams.get('guestMode')) {
            filters.guestMode = searchParams.get('guestMode') as 'minimum' | 'exact';
            hasFilters = true;
        }
        if (searchParams.get('pets') === 'true') {
            filters.pets = true;
            hasFilters = true;
        }
        if (searchParams.get('kitchen') === 'true') {
            filters.kitchen = true;
            hasFilters = true;
        }
        if (searchParams.get('wifi') === 'true') {
            filters.wifi = true;
            hasFilters = true;
        }
        if (searchParams.get('bathroom') === 'true') {
            filters.bathroom = true;
            hasFilters = true;
        }
        if (searchParams.get('airConditioning') === 'true') {
            filters.airConditioning = true;
            hasFilters = true;
        }
        if (searchParams.get('transmission')) {
            filters.transmission = searchParams.get('transmission') as 'automatic' | 'manual';
            hasFilters = true;
        }
        // Technische Datenfilter
        if (searchParams.get('fuelConsumptionMin') || searchParams.get('fuelConsumptionMax')) {
            filters.fuelConsumption = {
                min: parseFloat(searchParams.get('fuelConsumptionMin') || '0') || undefined,
                max: parseFloat(searchParams.get('fuelConsumptionMax') || '0') || undefined
            };
            hasFilters = true;
        }
        if (searchParams.get('enginePowerMin') || searchParams.get('enginePowerMax')) {
            filters.enginePower = {
                min: parseFloat(searchParams.get('enginePowerMin') || '0') || undefined,
                max: parseFloat(searchParams.get('enginePowerMax') || '0') || undefined
            };
            hasFilters = true;
        }
        if (searchParams.get('driveType')) {
            filters.driveType = searchParams.get('driveType') as 'front' | 'rear' | 'all';
            hasFilters = true;
        }
        if (searchParams.get('emissionClass')) {
            filters.emissionClass = searchParams.get('emissionClass') || undefined;
            hasFilters = true;
        }
        if (searchParams.get('trailerLoadMin') || searchParams.get('trailerLoadMax')) {
            filters.towingCapacity = {
                min: parseFloat(searchParams.get('trailerLoadMin') || '0') || undefined,
                max: parseFloat(searchParams.get('trailerLoadMax') || '0') || undefined
            };
            hasFilters = true;
        }
        if (searchParams.get('emptyWeightMin') || searchParams.get('emptyWeightMax')) {
            filters.emptyWeight = {
                min: parseFloat(searchParams.get('emptyWeightMin') || '0') || undefined,
                max: parseFloat(searchParams.get('emptyWeightMax') || '0') || undefined
            };
            hasFilters = true;
        }
        if (searchParams.get('totalWeightMin') || searchParams.get('totalWeightMax')) {
            filters.maxWeight = {
                min: parseFloat(searchParams.get('totalWeightMin') || '0') || undefined,
                max: parseFloat(searchParams.get('totalWeightMax') || '0') || undefined
            };
            hasFilters = true;
        }

        // Preisfilter
        if (searchParams.get('priceMin') || searchParams.get('priceMax')) {
            filters.priceRange = {
                min: parseInt(searchParams.get('priceMin') || '0') || undefined,
                max: parseInt(searchParams.get('priceMax') || '0') || undefined
            };
            hasFilters = true;
        }

        if (hasFilters) {
            setInitialFilters(filters);
            setHasSearchFromHero(true);

            // URL Parameter nach dem Laden entfernen für saubere URL
            router.replace('/wohnmobile');
        }
    }, [searchParams, router]);

    return (
        <>
            <Navbar />
            <div className="pt-24 min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-4xl font-bold text-center mb-8 text-green-800">Alle Wohnmobile</h1>
                    {hasSearchFromHero ? (
                        <p className="text-lg text-center text-green-600 mb-12 max-w-2xl mx-auto">
                            🔍 Suchergebnisse basierend auf Ihren Kriterien
                        </p>
                    ) : (
                        <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                            Entdecken Sie unsere große Auswahl an hochwertigen Wohnmobilen für jeden Bedarf.
                        </p>
                    )}
                    <VehicleSearch quickbook={false} initialFilters={initialFilters} />
                </div>
            </div>
            <Footer />
        </>
    );
}
