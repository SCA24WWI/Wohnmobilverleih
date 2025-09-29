'use client';

import React, { useState } from 'react';
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

// Vereinfachte Interfaces
interface SearchFormData {
    location: string;
    dateFrom: string;
    dateTo: string;
    guests: number;
    // Erweiterte Filter (optional)
    pets?: boolean;
    kitchen?: boolean;
    wifi?: boolean;
    bathroom?: boolean;
    airConditioning?: boolean;
    transmission?: 'automatic' | 'manual' | '';
    priceRange?: { min: number; max: number };
}

interface SearchBarProps {
    quickbook?: boolean;
    onSearch: (filters: SearchFormData) => void;
}

export function SearchBar({ quickbook = true, onSearch }: SearchBarProps) {
    // Ein einziger State für alle Daten
    const [formData, setFormData] = useState<SearchFormData>({
        location: '',
        dateFrom: '',
        dateTo: '',
        guests: 2,
        pets: false,
        kitchen: false,
        wifi: false,
        bathroom: false,
        airConditioning: false,
        transmission: '',
        priceRange: { min: 0, max: 1000 }
    });

    const [guestMenuOpen, setGuestMenuOpen] = useState(false);
    const [transmissionMenuOpen, setTransmissionMenuOpen] = useState(false);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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

    // Vereinfachte Filter-Definitionen
    const filters = [
        { key: 'pets', label: 'Haustiere erlaubt' },
        { key: 'kitchen', label: 'Küche', icon: HomeIcon },
        { key: 'wifi', label: 'WLAN', icon: WifiIcon },
        { key: 'bathroom', label: 'Bad/Dusche' },
        { key: 'airConditioning', label: 'Klimaanlage', icon: SparklesIcon }
    ];

    const transmissionOptions = [
        { value: '', label: 'Beliebig' },
        { value: 'automatic', label: 'Automatik' },
        { value: 'manual', label: 'Schaltgetriebe' }
    ];

    return (
        <div className="w-full flex justify-center px-4 relative z-10">
            <Card className="w-fit shadow-2xl bg-white/95 backdrop-blur-sm">
                <CardBody className="pt-6 pb-6 px-10">
                    <form
                        className="space-y-6"
                        onSubmit={(e) => {
                            e.preventDefault();
                            onSearch(formData);
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
                                                    {formData.guests} Gäste
                                                </Typography>
                                                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                                            </div>
                                        </div>
                                    </MenuHandler>
                                    <MenuList>
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
                                className="flex-shrink-0 bg-green-800 hover:bg-green-600 transition-colors duration-200 h-12 px-8 flex items-center justify-center gap-2 normal-case text-base font-semibold whitespace-nowrap"
                            >
                                <MagnifyingGlassIcon className="h-5 w-5" />
                                Camper finden
                            </Button>
                        </div>

                        {/* Erweiterte Filter */}
                        {!quickbook && showAdvancedFilters && (
                            <div className="border-t pt-6 mt-6">
                                <Typography variant="h6" className="text-lg font-semibold text-gray-800 mb-4">
                                    Erweiterte Filter
                                </Typography>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Ausstattung */}
                                    <div className="space-y-3">
                                        <Typography variant="h6" className="text-sm font-semibold text-gray-700 mb-2">
                                            Ausstattung
                                        </Typography>
                                        {filters.map(({ key, label, icon: Icon }) => (
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

                                    {/* Getriebe */}
                                    <div className="space-y-3">
                                        <Typography variant="h6" className="text-sm font-semibold text-gray-700 mb-2">
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

                                    {/* Preis */}
                                    <div className="space-y-3">
                                        <Typography variant="h6" className="text-sm font-semibold text-gray-700 mb-2">
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
                        )}
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}

export default SearchBar;
