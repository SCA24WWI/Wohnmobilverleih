'use client';

import React, { useState, useCallback, useRef } from 'react';
import { API_CONFIG, buildApiUrl } from '@/config/api';
import {
    Card,
    CardBody,
    Input,
    Button,
    Typography,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Checkbox
} from '@material-tailwind/react';
import {
    MagnifyingGlassIcon,
    UserGroupIcon,
    ChevronDownIcon,
    MapPinIcon,
    AdjustmentsHorizontalIcon,
    WifiIcon,
    HomeIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

// API Response Interfaces
interface Vehicle {
    id: number;
    name: string;
    type: string;
    guests: number;
    location: string;
    pricePerDay: number;
    image: string;
    galleryImages?: string[]; // Neu: Array für Galerie-Bilder
    features: string[];
    available: boolean;
    fuehrerschein?: string;
    beschreibung?: string;
    haustiere_erlaubt?: boolean;
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

// Basic search filters
interface SearchFilters {
    location: string;
    dateFrom: string;
    dateTo: string;
    guests: number;
    guestMode?: 'minimum' | 'exact'; // Neue Option für Gäste-Filter-Modus
}

// Extended search filters
interface ExtendedSearchFilters extends SearchFilters {
    pets?: boolean;
    kitchen?: boolean;
    wifi?: boolean;
    bathroom?: boolean;
    airConditioning?: boolean;
    transmission?: 'automatic' | 'manual' | '';
    priceRange?: {
        min: number;
        max: number;
    };
}

type AllSearchFilters = SearchFilters | ExtendedSearchFilters;

// API Functions
async function fetchVehicles(filters?: AllSearchFilters, page: number = 1): Promise<VehicleSearchResponse> {
    try {
        const queryParams = filters
            ? {
                  location: filters.location?.trim() || undefined,
                  guests: filters.guests > 0 ? filters.guests : undefined,
                  guestMode: filters.guestMode || undefined, // Neuer Parameter für Gäste-Modus
                  dateFrom: filters.dateFrom || undefined,
                  dateTo: filters.dateTo || undefined,
                  page: page.toString(),
                  limit: '6',
                  // Erweiterte Filter - Ausstattung
                  pets: (filters as any).pets ? 'true' : undefined,
                  kitchen: (filters as any).kitchen ? 'true' : undefined,
                  wifi: (filters as any).wifi ? 'true' : undefined,
                  bathroom: (filters as any).bathroom ? 'true' : undefined,
                  airConditioning: (filters as any).airConditioning ? 'true' : undefined,
                  transmission: (filters as any).transmission || undefined,
                  // Erweiterte Filter - Technische Daten
                  fuelConsumptionMin: (filters as any).fuelConsumption?.min?.toString() || undefined,
                  fuelConsumptionMax: (filters as any).fuelConsumption?.max?.toString() || undefined,
                  enginePowerMin: (filters as any).enginePower?.min?.toString() || undefined,
                  enginePowerMax: (filters as any).enginePower?.max?.toString() || undefined,
                  driveType: (filters as any).driveType || undefined,
                  emissionClass: (filters as any).emissionClass || undefined,
                  trailerLoadMin: (filters as any).towingCapacity?.min?.toString() || undefined,
                  trailerLoadMax: (filters as any).towingCapacity?.max?.toString() || undefined,
                  emptyWeightMin: (filters as any).emptyWeight?.min?.toString() || undefined,
                  emptyWeightMax: (filters as any).emptyWeight?.max?.toString() || undefined,
                  totalWeightMin: (filters as any).maxWeight?.min?.toString() || undefined,
                  totalWeightMax: (filters as any).maxWeight?.max?.toString() || undefined,
                  // Erweiterte Filter - Kosten
                  priceMin: (filters as any).priceRange?.min?.toString() || undefined,
                  priceMax: (filters as any).priceRange?.max?.toString() || undefined
              }
            : { page: page.toString(), limit: '6' };

        const url = buildApiUrl(API_CONFIG.ENDPOINTS.VEHICLES.SEARCH, queryParams);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch vehicles');
        }

        const apiData = await response.json();

        //TODO: Mapping anpassen wenn API steht
        // Bilder hier nur als Platzhalter
        const mappedVehicles = apiData.vehicles.map((vehicle: any, index: number) => {
            // Sichere Verarbeitung der Galerie-Bilder
            let galleryImages: string[] = [];
            if (vehicle.galerie_bilder) {
                try {
                    // Prüfen ob es bereits ein Array ist oder ein JSON-String
                    if (Array.isArray(vehicle.galerie_bilder)) {
                        galleryImages = vehicle.galerie_bilder;
                    } else if (typeof vehicle.galerie_bilder === 'string') {
                        galleryImages = JSON.parse(vehicle.galerie_bilder);
                    }
                } catch (parseError) {
                    galleryImages = [];
                }
            }

            // Sichere Verarbeitung der Features
            let features: string[] = [];
            if (vehicle.features) {
                try {
                    if (Array.isArray(vehicle.features)) {
                        features = vehicle.features;
                    } else if (typeof vehicle.features === 'string') {
                        features = JSON.parse(vehicle.features);
                    }
                } catch (parseError) {
                    console.warn('Fehler beim Parsen der Features:', parseError);
                    features = [];
                }
            }

            return {
                id: vehicle.id || index,
                name: vehicle.name || 'Unbekanntes Fahrzeug',
                type: vehicle.modell || 'Unbekannt',
                guests: vehicle.bettenzahl || 2,
                location: vehicle.ort || 'Unbekannt',
                pricePerDay: parseFloat(vehicle.preis_pro_tag) || 0,
                image: vehicle.hauptbild, // Hauptbild aus DB
                galleryImages: galleryImages, // Sicher geparste Galerie-Bilder
                features: features, // Features direkt aus der Datenbank
                available: true,
                fuehrerschein: vehicle.fuehrerschein || '',
                beschreibung: vehicle.beschreibung || null,
                haustiere_erlaubt: vehicle.haustiere_erlaubt || false
            };
        });

        return {
            vehicles: mappedVehicles,
            pagination: apiData.pagination
        };
    } catch (error) {
        throw error;
    }
}

// Vereinfachte Interfaces
interface SearchFormData {
    location: string;
    dateFrom: string;
    dateTo: string;
    guests: number;
    guestMode?: 'minimum' | 'exact'; // Neuer Parameter für Gäste-Modus
    // Erweiterte Filter (optional)
    // Ausstattung
    pets?: boolean;
    kitchen?: boolean;
    wifi?: boolean;
    bathroom?: boolean;
    airConditioning?: boolean;
    // Technische Daten
    transmission?: 'automatic' | 'manual' | '';
    fuelConsumption?: { min?: number; max?: number }; // l/100km
    enginePower?: { min?: number; max?: number }; // kW
    driveType?: 'front' | 'rear' | 'all' | ''; // Antriebsart
    emissionClass?: string; // Schadstoffklasse
    towingCapacity?: { min?: number; max?: number }; // kg
    emptyWeight?: { min?: number; max?: number }; // kg
    maxWeight?: { min?: number; max?: number }; // kg
    // Kosten
    priceRange?: { min: number; max: number };
}

interface SearchBarProps {
    quickbook?: boolean;
    onSearch?: (filters: SearchFormData) => void;
    onSearchResults?: (
        results: VehicleSearchResponse | null,
        isSearching: boolean,
        error: string | null,
        currentFilters?: any
    ) => void;
    initialFilters?: any;
}

export function SearchBar({ quickbook = true, onSearch, onSearchResults, initialFilters }: SearchBarProps) {
    // Ref für initialFilters um zu verfolgen ob bereits initialisiert
    const hasInitialized = useRef(false);

    // Ein einziger State für alle Daten
    const [formData, setFormData] = useState<SearchFormData>({
        location: '',
        dateFrom: '',
        dateTo: '',
        guests: 0, // 0 = keine Beschränkung
        guestMode: 'exact', // Standard auf "genau"
        pets: false,
        kitchen: false,
        wifi: false,
        bathroom: false,
        airConditioning: false,
        transmission: '',
        fuelConsumption: { min: 0, max: 50 },
        enginePower: { min: 0, max: 500 },
        driveType: '',
        emissionClass: '',
        towingCapacity: { min: 0, max: 5000 },
        emptyWeight: { min: 0, max: 10000 },
        maxWeight: { min: 0, max: 15000 },
        priceRange: { min: 0, max: 1000 }
    });

    // useEffect um initialFilters zu laden
    React.useEffect(() => {
        if (initialFilters && Object.keys(initialFilters).length > 0) {
            setFormData((prev) => ({
                ...prev,
                location: initialFilters.location || prev.location,
                dateFrom: initialFilters.dateFrom || prev.dateFrom,
                dateTo: initialFilters.dateTo || prev.dateTo,
                guests: initialFilters.guests || prev.guests,
                guestMode: initialFilters.guestMode || prev.guestMode,
                pets: initialFilters.pets || prev.pets,
                kitchen: initialFilters.kitchen || prev.kitchen,
                wifi: initialFilters.wifi || prev.wifi,
                bathroom: initialFilters.bathroom || prev.bathroom,
                airConditioning: initialFilters.airConditioning || prev.airConditioning,
                transmission: initialFilters.transmission || prev.transmission,
                priceRange: initialFilters.priceRange || prev.priceRange
            }));

            // Erweiterte Filter anzeigen, wenn sie gesetzt sind
            if (
                initialFilters.pets ||
                initialFilters.kitchen ||
                initialFilters.wifi ||
                initialFilters.bathroom ||
                initialFilters.airConditioning ||
                initialFilters.transmission
            ) {
                setShowAdvancedFilters(true);
            }
        }
    }, [initialFilters]);

    // Automatische Suche bei initialFilters - nur einmal ausführen
    React.useEffect(() => {
        if (
            initialFilters &&
            Object.keys(initialFilters).length > 0 &&
            !quickbook &&
            onSearchResults &&
            !hasInitialized.current
        ) {
            hasInitialized.current = true;
            handleSearch(initialFilters, 1);
        }
    }, [initialFilters, quickbook, onSearchResults]);

    const [guestMenuOpen, setGuestMenuOpen] = useState(false);
    const [transmissionMenuOpen, setTransmissionMenuOpen] = useState(false);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Search state
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    // handleSearch Funktion - verschoben von quicksearch.tsx
    const handleSearch = useCallback(
        async (filters: AllSearchFilters, page: number = 1) => {
            try {
                setIsSearching(true);
                setSearchError(null);

                const results = await fetchVehicles(filters, page);

                // Ergebnisse an Parent-Komponente weiterleiten
                if (onSearchResults) {
                    onSearchResults(results, false, null, filters);
                }
            } catch (err) {
                const error = 'Fehler bei der Suche. Bitte versuchen Sie es erneut.';
                setSearchError(error);

                // Fehler an Parent-Komponente weiterleiten
                if (onSearchResults) {
                    onSearchResults(null, false, error, filters);
                }
            } finally {
                setIsSearching(false);
            }
        },
        [onSearchResults]
    );

    // Vereinfachte Update-Funktion
    const updateField = (field: keyof SearchFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleGuestSelect = (count: number) => {
        updateField('guests', count);
        setGuestMenuOpen(false);
    };

    const handleTransmissionSelect = (transmission: 'automatic' | 'manual' | '') => {
        updateField('transmission', transmission);
        setTransmissionMenuOpen(false);
    };

    // Filter-Kategorien
    const equipmentFilters = [
        { key: 'kitchen', label: 'Küche', icon: HomeIcon },
        { key: 'wifi', label: 'WLAN', icon: WifiIcon },
        { key: 'bathroom', label: 'Bad/Dusche' },
        { key: 'airConditioning', label: 'Klimaanlage', icon: SparklesIcon },
        { key: 'pets', label: 'Haustiere erlaubt' }
    ];

    const transmissionOptions = [
        { value: '', label: 'Beliebig' },
        { value: 'automatic', label: 'Automatik' },
        { value: 'manual', label: 'Schaltgetriebe' }
    ];

    const driveTypeOptions = [
        { value: '', label: 'Beliebig' },
        { value: 'front', label: 'Frontantrieb' },
        { value: 'rear', label: 'Heckantrieb' },
        { value: 'all', label: 'Allradantrieb' }
    ];

    const emissionClassOptions = [
        { value: '', label: 'Beliebig' },
        { value: 'Euro 6', label: 'Euro 6' },
        { value: 'Euro 5', label: 'Euro 5' },
        { value: 'Euro 4', label: 'Euro 4' }
    ];

    return (
        <div className="w-full flex justify-center px-4 relative z-10">
            <Card className="w-fit shadow-2xl bg-white/95 backdrop-blur-sm">
                <CardBody className="pt-6 pb-6 px-10">
                    <form
                        className="space-y-6"
                        onSubmit={(e) => {
                            e.preventDefault();
                            // Wenn onSearch vorhanden ist (Hero-Modus), das verwenden
                            if (onSearch) {
                                onSearch(formData);
                            } else {
                                // Sonst direkte Suche ausführen (Wohnmobile-Seite)
                                handleSearch(formData, 1);
                            }
                        }}
                    >
                        <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-4 xl:gap-6 min-w-fit">
                            {/* Ort */}
                            <div className="flex-1 min-w-[200px] relative">
                                <MapPinIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                <Input
                                    placeholder="Wo startest du?"
                                    value={formData.location}
                                    onChange={(e) => updateField('location', e.target.value)}
                                    className="pl-10"
                                    containerProps={{ className: 'h-12' }}
                                    labelProps={{ className: 'hidden' }}
                                    crossOrigin={undefined}
                                />
                            </div>

                            {/* Datum */}
                            <div className="flex-1 flex gap-2">
                                <Input
                                    type="date"
                                    label="Von"
                                    value={formData.dateFrom}
                                    onChange={(e) => updateField('dateFrom', e.target.value)}
                                    containerProps={{ className: 'h-12' }}
                                    crossOrigin={undefined}
                                />
                                <Input
                                    type="date"
                                    label="Bis"
                                    value={formData.dateTo}
                                    onChange={(e) => updateField('dateTo', e.target.value)}
                                    containerProps={{ className: 'h-12' }}
                                    crossOrigin={undefined}
                                />
                            </div>

                            {/* Gäste */}
                            <div className="flex-shrink-0 ">
                                <Menu open={guestMenuOpen} handler={setGuestMenuOpen}>
                                    <MenuHandler>
                                        <div className="relative cursor-pointer">
                                            <UserGroupIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                            <div className="h-12 border border-gray-300 rounded-md flex items-center justify-between px-10 pr-8 bg-white hover:border-gray-400 transition-colors w-full">
                                                <Typography variant="small" className="text-gray-700">
                                                    {formData.guests === 0
                                                        ? 'Beliebige Anzahl Gäste'
                                                        : `${formData.guestMode === 'exact' ? 'Genau' : 'Mind.'} ${
                                                              formData.guests
                                                          } ${formData.guests === 1 ? 'Gast' : 'Gäste'}`}
                                                </Typography>
                                                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                                            </div>
                                        </div>
                                    </MenuHandler>
                                    <MenuList>
                                        {/* Gäste-Modus Auswahl */}
                                        <div className="px-3 py-2 border-b border-gray-200">
                                            <Typography variant="small" className="font-medium text-gray-700 mb-2">
                                                Filter-Modus:
                                            </Typography>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outlined"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateField('guestMode', 'minimum');
                                                    }}
                                                    className={`px-2 py-1 text-xs ${
                                                        formData.guestMode === 'minimum'
                                                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                                                            : 'border-gray-300 text-gray-600 hover:border-gray-400'
                                                    }`}
                                                >
                                                    Mindestens
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outlined"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateField('guestMode', 'exact');
                                                    }}
                                                    className={`px-2 py-1 text-xs ${
                                                        formData.guestMode === 'exact'
                                                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                                                            : 'border-gray-300 text-gray-600 hover:border-gray-400'
                                                    }`}
                                                >
                                                    Genau
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Gäste-Anzahl */}
                                        <MenuItem
                                            onClick={() => handleGuestSelect(0)}
                                            className={formData.guests === 0 ? 'bg-blue-50' : ''}
                                        >
                                            -
                                        </MenuItem>
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => (
                                            <MenuItem
                                                key={count}
                                                onClick={() => handleGuestSelect(count)}
                                                className={formData.guests === count ? 'bg-blue-50' : ''}
                                            >
                                                {count} {count === 1 ? 'Gast' : 'Gäste'}
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </Menu>
                            </div>

                            {/* Filter Toggle */}
                            {!quickbook && (
                                <Button
                                    type="button"
                                    variant="outlined"
                                    size="lg"
                                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                    className="flex-shrink-0 h-12 px-4 flex items-center justify-center gap-2 normal-case text-base font-semibold border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                    <AdjustmentsHorizontalIcon className="h-5 w-5" />
                                    {showAdvancedFilters ? 'Weniger Filter' : 'Mehr Filter'}
                                </Button>
                            )}

                            {/* Suchen Button */}
                            <Button
                                type="submit"
                                size="lg"
                                disabled={isSearching}
                                className="flex-shrink-0 bg-green-800 hover:bg-green-600 disabled:bg-gray-400 transition-colors duration-200 h-12 px-8 flex items-center justify-center gap-2 normal-case text-base font-semibold whitespace-nowrap"
                            >
                                <MagnifyingGlassIcon className="h-5 w-5" />
                                {isSearching ? 'Suche...' : 'Camper finden'}
                            </Button>
                        </div>

                        {/* Erweiterte Filter */}
                        {!quickbook && showAdvancedFilters && (
                            <div className="border-t pt-6 mt-6">
                                <Typography variant="h6" className="text-lg font-semibold text-gray-800 mb-6">
                                    Erweiterte Filter
                                </Typography>

                                <div className="space-y-8">
                                    {/* Ausstattung */}
                                    <div>
                                        <Typography variant="h6" className="text-base font-semibold text-gray-800 mb-4">
                                            Ausstattung
                                        </Typography>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                            {equipmentFilters.map(({ key, label, icon: Icon }) => (
                                                <div key={key} className="flex items-center gap-2">
                                                    <Checkbox
                                                        id={key}
                                                        checked={formData[key as keyof SearchFormData] as boolean}
                                                        onChange={(e) =>
                                                            updateField(key as keyof SearchFormData, e.target.checked)
                                                        }
                                                        crossOrigin={undefined}
                                                    />
                                                    <label
                                                        htmlFor={key}
                                                        className="text-sm text-gray-700 cursor-pointer flex items-center gap-1"
                                                    >
                                                        {Icon && <Icon className="h-4 w-4" />}
                                                        {label}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Technische Daten */}
                                    <div>
                                        <Typography variant="h6" className="text-base font-semibold text-gray-800 mb-4">
                                            Technische Daten
                                        </Typography>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {/* Getriebe */}
                                            <div className="min-w-0">
                                                <Typography
                                                    variant="small"
                                                    className="font-medium text-gray-700 mb-2 block"
                                                >
                                                    Getriebe
                                                </Typography>
                                                <Menu open={transmissionMenuOpen} handler={setTransmissionMenuOpen}>
                                                    <MenuHandler>
                                                        <div className="relative cursor-pointer">
                                                            <div className="h-10 border border-gray-300 rounded-md flex items-center justify-between px-3 bg-white hover:border-gray-400 transition-colors">
                                                                <Typography variant="small" className="text-gray-700">
                                                                    {transmissionOptions.find(
                                                                        (opt) => opt.value === formData.transmission
                                                                    )?.label || 'Beliebig'}
                                                                </Typography>
                                                                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                                                            </div>
                                                        </div>
                                                    </MenuHandler>
                                                    <MenuList>
                                                        {transmissionOptions.map(({ value, label }) => (
                                                            <MenuItem
                                                                key={value}
                                                                onClick={() => handleTransmissionSelect(value as any)}
                                                            >
                                                                {label}
                                                            </MenuItem>
                                                        ))}
                                                    </MenuList>
                                                </Menu>
                                            </div>

                                            {/* Kraftstoffverbrauch */}
                                            <div className="min-w-0">
                                                <Typography
                                                    variant="small"
                                                    className="font-medium text-gray-700 mb-2 block"
                                                >
                                                    Verbrauch (l/100km)
                                                </Typography>
                                                <div className="flex gap-2 min-w-0">
                                                    <div className="flex-1 min-w-0">
                                                        <Input
                                                            type="number"
                                                            placeholder="Min"
                                                            value={formData.fuelConsumption?.min || ''}
                                                            onChange={(e) =>
                                                                updateField('fuelConsumption', {
                                                                    ...formData.fuelConsumption,
                                                                    min: parseInt(e.target.value) || 0
                                                                })
                                                            }
                                                            containerProps={{ className: 'h-10' }}
                                                            crossOrigin={undefined}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <Input
                                                            type="number"
                                                            placeholder="Max"
                                                            value={formData.fuelConsumption?.max || ''}
                                                            onChange={(e) =>
                                                                updateField('fuelConsumption', {
                                                                    ...formData.fuelConsumption,
                                                                    max: parseInt(e.target.value) || 50
                                                                })
                                                            }
                                                            containerProps={{ className: 'h-10' }}
                                                            crossOrigin={undefined}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Motorleistung */}
                                            <div className="min-w-0">
                                                <Typography
                                                    variant="small"
                                                    className="font-medium text-gray-700 mb-2 block"
                                                >
                                                    Motorleistung (kW)
                                                </Typography>
                                                <div className="flex gap-2 min-w-0">
                                                    <div className="flex-1 min-w-0">
                                                        <Input
                                                            type="number"
                                                            placeholder="Min"
                                                            value={formData.enginePower?.min || ''}
                                                            onChange={(e) =>
                                                                updateField('enginePower', {
                                                                    ...formData.enginePower,
                                                                    min: parseInt(e.target.value) || 0
                                                                })
                                                            }
                                                            containerProps={{ className: 'h-10' }}
                                                            crossOrigin={undefined}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <Input
                                                            type="number"
                                                            placeholder="Max"
                                                            value={formData.enginePower?.max || ''}
                                                            onChange={(e) =>
                                                                updateField('enginePower', {
                                                                    ...formData.enginePower,
                                                                    max: parseInt(e.target.value) || 500
                                                                })
                                                            }
                                                            containerProps={{ className: 'h-10' }}
                                                            crossOrigin={undefined}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Kosten */}
                                    <div>
                                        <Typography variant="h6" className="text-base font-semibold text-gray-800 mb-4">
                                            Kosten
                                        </Typography>
                                        <div className="max-w-md">
                                            <Typography
                                                variant="small"
                                                className="font-medium text-gray-700 mb-2 block"
                                            >
                                                Preis pro Tag (€)
                                            </Typography>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="number"
                                                    placeholder="Min"
                                                    value={formData.priceRange?.min || ''}
                                                    onChange={(e) =>
                                                        updateField('priceRange', {
                                                            ...formData.priceRange,
                                                            min: parseInt(e.target.value) || 0
                                                        })
                                                    }
                                                    containerProps={{ className: 'h-10' }}
                                                    crossOrigin={undefined}
                                                />
                                                <Input
                                                    type="number"
                                                    placeholder="Max"
                                                    value={formData.priceRange?.max || ''}
                                                    onChange={(e) =>
                                                        updateField('priceRange', {
                                                            ...formData.priceRange,
                                                            max: parseInt(e.target.value) || 1000
                                                        })
                                                    }
                                                    containerProps={{ className: 'h-10' }}
                                                    crossOrigin={undefined}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}

// Export der handleSearch Funktion für externe Verwendung
export { fetchVehicles };
export default SearchBar;
