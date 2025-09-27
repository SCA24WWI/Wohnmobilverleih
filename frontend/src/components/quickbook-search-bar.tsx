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
    MenuItem
} from '@material-tailwind/react';
import {
    MagnifyingGlassIcon,
    CalendarDaysIcon,
    UserGroupIcon,
    ChevronDownIcon,
    MapPinIcon
} from '@heroicons/react/24/outline';

interface SearchFormData {
    location: string;
    dateFrom: string;
    dateTo: string;
    guests: number;
}

interface QuickbookSearchBarProps {
    onSearch: (filters: SearchFormData) => void;
}

export function QuickbookSearchBar({ onSearch }: QuickbookSearchBarProps) {
    const [formData, setFormData] = useState<SearchFormData>({
        location: '',
        dateFrom: '',
        dateTo: '',
        guests: 2
    });

    const [guestMenuOpen, setGuestMenuOpen] = useState(false);

    const handleGuestSelect = (count: number) => {
        setFormData((prev) => ({ ...prev, guests: count }));
        setGuestMenuOpen(false);
    };

    const formatDateRange = () => {
        if (!formData.dateFrom && !formData.dateTo) {
            return 'Von - bis';
        }
        if (formData.dateFrom && formData.dateTo) {
            const fromDate = new Date(formData.dateFrom).toLocaleDateString('de-DE', {
                day: 'numeric',
                month: 'short'
            });
            const toDate = new Date(formData.dateTo).toLocaleDateString('de-DE', {
                day: 'numeric',
                month: 'short'
            });
            return `${fromDate} - ${toDate}`;
        }
        return formData.dateFrom || formData.dateTo || 'Von - bis';
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 -mt-8 relative z-10">
            <Card className="w-full shadow-2xl">
                <CardBody className="pt-8 pb-6 px-6">
                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <Typography variant="h2" className="text-3xl lg:text-4xl font-bold text-green-800 mb-4">
                            Finde dein perfektes Wohnmobil
                        </Typography>
                        <Typography variant="lead" className="text-gray-600 max-w-2xl mx-auto text-base lg:text-lg">
                            Durchsuche unsere große Auswahl an Wohnmobilen und finde das perfekte Fahrzeug für deinen
                            nächsten Roadtrip.
                        </Typography>
                    </div>

                    {/* Search Form */}
                    <form
                        className="flex flex-col xl:flex-row items-stretch xl:items-center gap-3 xl:gap-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            onSearch(formData);
                        }}
                    >
                        {/* Standort Eingabe */}
                        <div className="flex-1">
                            <div className="relative">
                                <MapPinIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                <Input
                                    type="text"
                                    placeholder="Wo startest du?"
                                    value={formData.location}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                                    className="pl-10"
                                    containerProps={{
                                        className: 'h-12'
                                    }}
                                    labelProps={{
                                        className: 'hidden'
                                    }}
                                    crossOrigin={undefined}
                                />
                            </div>
                        </div>

                        {/* Datum Auswahl */}
                        <div className="flex-1">
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Input
                                        type="date"
                                        label="Von"
                                        value={formData.dateFrom}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, dateFrom: e.target.value }))}
                                        containerProps={{
                                            className: 'h-12'
                                        }}
                                        crossOrigin={undefined}
                                    />
                                </div>
                                <div className="flex-1">
                                    <Input
                                        type="date"
                                        label="Bis"
                                        value={formData.dateTo}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, dateTo: e.target.value }))}
                                        containerProps={{
                                            className: 'h-12'
                                        }}
                                        crossOrigin={undefined}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Gäste Auswahl */}
                        <div className="flex-1 xl:flex-initial xl:min-w-[180px]">
                            <Menu open={guestMenuOpen} handler={setGuestMenuOpen}>
                                <MenuHandler>
                                    <div className="relative cursor-pointer">
                                        <UserGroupIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                        <div className="h-12 border border-gray-300 rounded-md flex items-center justify-between px-10 pr-8 bg-white hover:border-gray-400 transition-colors">
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

                        {/* Suchen Button */}
                        <div className="xl:flex-initial xl:min-w-[160px]">
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full xl:w-auto bg-green-800 hover:bg-green-600 transition-colors duration-200 h-12 px-8 flex items-center justify-center gap-2 normal-case text-base font-semibold"
                            >
                                <MagnifyingGlassIcon className="h-5 w-5" />
                                Camper finden
                            </Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}

export default QuickbookSearchBar;
