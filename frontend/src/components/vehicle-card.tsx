'use client';

import React from 'react';
import { useToast } from './toast-provider';

// Vehicle Interface
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

interface VehicleCardProps {
    vehicle: Vehicle;
    travelDates?: {
        startDate: string;
        endDate: string;
    };
}

export function VehicleCard({ vehicle, travelDates }: VehicleCardProps) {
    const { showWarning } = useToast();

    const handleBookingClick = (e: React.MouseEvent) => {
        if (!travelDates?.startDate || !travelDates?.endDate) {
            e.preventDefault();
            showWarning(
                '📅 Reisedatum erforderlich',
                'Bitte geben Sie zunächst in der Suchleiste ein Start- und Enddatum für Ihre Reise ein.'
            );
            return;
        }
    };
    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
            <div className="relative">
                <img src={vehicle.image} alt={vehicle.name} className="w-full h-48 object-cover" />
                {!vehicle.available && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        Nicht verfügbar
                    </div>
                )}
                <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    {vehicle.type}
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">{vehicle.name}</h3>
                    <div className="text-right ml-3 flex-shrink-0">
                        <div className="text-2xl font-bold text-green-600">€{vehicle.pricePerDay}</div>
                        <div className="text-sm text-gray-500">pro Tag</div>
                    </div>
                </div>

                <div className="flex items-center gap-6 mb-4 text-gray-600">
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="text-sm font-medium">{vehicle.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        <span className="text-sm">{vehicle.guests} Personen</span>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                        {vehicle.features &&
                            vehicle.features.map((feature, index) => (
                                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                                    {feature}
                                </span>
                            ))}
                    </div>
                </div>

                <div className="flex gap-3">
                    <a
                        href={
                            vehicle.available && travelDates?.startDate && travelDates?.endDate
                                ? `/buchung/${vehicle.id}?startDate=${travelDates.startDate}&endDate=${travelDates.endDate}`
                                : '#'
                        }
                        onClick={handleBookingClick}
                        className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors text-center ${
                            vehicle.available
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        style={!vehicle.available ? { pointerEvents: 'none' } : {}}
                    >
                        {vehicle.available ? 'Jetzt buchen' : 'Nicht verfügbar'}
                    </a>
                    <a
                        href={`/wohnmobile/${vehicle.id}`}
                        className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 hover:border-gray-400 text-center"
                    >
                        Details
                    </a>
                </div>
            </div>
        </div>
    );
}

export default VehicleCard;
