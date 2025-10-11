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
    haustiere_erlaubt?: boolean; // Zusätzlich aus API
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
                <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1.5">
                    <span>{vehicle.type}</span>
                    {vehicle.haustiere_erlaubt && (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 512 512">
                            <g>
                                <path d="M378.608,290.994C344.16,249.402,300.618,226.496,256,226.496s-88.161,22.906-122.607,64.498c-30.963,37.385-49.448,84.501-49.448,126.035c0,20.176,6.168,35.544,18.332,45.679c12.006,10.004,27.857,13.388,45.541,13.387c18.817,0,39.711-3.832,60.24-7.598c17.939-3.291,34.883-6.399,47.943-6.399c11.272,0,27.165,2.95,43.988,6.073c39.317,7.3,83.881,15.572,109.624-5.832c12.238-10.175,18.443-25.42,18.443-45.31C428.057,375.495,409.572,328.379,378.608,290.994z" />
                                <path d="M382.13,65.146c-12.604-18.583-30.652-29.24-49.517-29.24c-18.866,0-36.913,10.658-49.517,29.24c-11.578,17.071-17.955,39.489-17.955,63.125c0,23.636,6.376,46.054,17.955,63.125c12.604,18.582,30.652,29.24,49.517,29.24c18.866,0,36.913-10.658,49.517-29.24c11.578-17.071,17.955-39.489,17.955-63.125C400.085,104.635,393.709,82.216,382.13,65.146z" />
                                <path d="M228.905,65.145c-12.604-18.583-30.651-29.24-49.517-29.24s-36.914,10.658-49.517,29.24c-11.578,17.071-17.955,39.489-17.955,63.125s6.376,46.054,17.955,63.125c12.604,18.583,30.651,29.241,49.517,29.241s36.913-10.658,49.517-29.241c11.578-17.071,17.955-39.488,17.955-63.125C246.859,104.634,240.483,82.215,228.905,65.145z" />
                                <path d="M509.019,210.133c-5.081-17.284-15.972-29.843-30.665-35.362c-11.824-4.441-25.171-3.688-37.583,2.121c-17.105,8.004-31.086,24.532-38.356,45.345c-5.941,17.008-6.682,34.985-2.085,50.622c5.081,17.284,15.972,29.843,30.666,35.362c5.085,1.91,10.45,2.859,15.902,2.859c7.227,0,14.607-1.669,21.682-4.98c17.105-8.004,31.086-24.532,38.356-45.344v-0.001C512.876,243.748,513.617,225.77,509.019,210.133z" />
                                <path d="M109.587,222.235c-7.271-20.813-21.252-37.34-38.356-45.344c-12.413-5.809-25.761-6.561-37.584-2.121c-14.694,5.52-25.585,18.079-30.666,35.362c-4.597,15.637-3.856,33.615,2.085,50.622v0.001c7.272,20.813,21.252,37.34,38.356,45.344c7.076,3.311,14.455,4.98,21.682,4.98c5.452,0,10.818-0.95,15.902-2.859c14.696-5.52,25.586-18.079,30.667-35.362C116.268,257.222,115.527,239.244,109.587,222.235z" />
                            </g>
                        </svg>
                    )}
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
                    <div className="features-container relative">
                        {vehicle.features && vehicle.features.length > 0 && (
                            <div
                                className="features-grid"
                                style={{
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 2,
                                    overflow: 'hidden',
                                    lineHeight: '1.75rem',
                                    maxHeight: '3.5rem'
                                }}
                            >
                                <div className="flex flex-wrap gap-2">
                                    {vehicle.features.map((feature, index) => {
                                        // Kürze Features wenn sie zu lang sind
                                        const displayFeature =
                                            feature.length > 15 ? `${feature.substring(0, 15)}...` : feature;

                                        return (
                                            <span
                                                key={index}
                                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs inline-block"
                                                style={{
                                                    maxWidth: '8rem', // Begrenze Breite
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {displayFeature}
                                            </span>
                                        );
                                    })}
                                </div>

                                {/* Zeige "+X weitere" wenn Features abgeschnitten werden */}
                                <div className="absolute bottom-0 right-0 bg-gradient-to-l from-white via-white to-transparent pl-6">
                                    {vehicle.features.length > 8 && (
                                        <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">
                                            +{Math.max(0, vehicle.features.length - 8)} weitere
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
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
