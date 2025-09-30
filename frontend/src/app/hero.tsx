'use client';

import Image from 'next/image';
import { Button, Typography, Card } from '@material-tailwind/react';
import { SearchBar } from '@/components';

function Hero() {
    return (
        <div
            className="relative w-full flex items-center justify-center overflow-hidden"
            style={{
                height: 'max(100vh, 700px)'
            }}
        >
            {/* Hintergrundbild */}
            <div
                className="absolute inset-0 w-full h-full -top-16 lg:-top-20"
                style={{
                    height: 'calc(max(100vh, 700px) + 5rem)',
                    minHeight: 'calc(100vh + 5rem)'
                }}
            >
                <Image
                    fill
                    src="/image/Background.png"
                    alt="Wohnmobil"
                    className="object-cover object-center w-full h-full"
                    sizes="100vw"
                    priority
                />
            </div>

            {/* Hauptcontent - responsiv und lesbar */}
            <div className="relative z-10 text-center max-w-4xl mx-auto px-6 py-8 sm:py-12">
                <Typography
                    variant="h1"
                    color="blue-gray"
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium !leading-tight mb-4 sm:mb-6 md:mb-8 drop-shadow-2xl"
                >
                    Willkommen bei <span className="font-bold text-green-800">Wohnmobil Verleih</span>
                </Typography>

                {/* SearchBar direkt im Hero-Bereich */}
                <div className="w-full max-w-5xl mx-auto mt-10 ">
                    <SearchBar
                        quickbook={true}
                        onSearch={(filters) => {
                            // Filter in URL-Parameter konvertieren
                            const searchParams = new URLSearchParams();

                            if (filters.location?.trim()) {
                                searchParams.set('location', filters.location.trim());
                            }
                            if (filters.dateFrom) {
                                searchParams.set('dateFrom', filters.dateFrom);
                            }
                            if (filters.dateTo) {
                                searchParams.set('dateTo', filters.dateTo);
                            }
                            if (filters.guests > 0) {
                                searchParams.set('guests', filters.guests.toString());
                            }

                            // Erweiterte Filter werden im Hero-Bereich nicht verwendet,
                            // da sie dort nicht angezeigt werden (quickbook=true)

                            // Zur Wohnmobile-Seite mit Suchparametern navigieren
                            const url = `/wohnmobile?${searchParams.toString()}`;
                            window.location.href = url;
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
export default Hero;
