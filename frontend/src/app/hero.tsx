'use client';

import Image from 'next/image';
import { Button, Typography, Card } from '@material-tailwind/react';

function Hero() {
    return (
        <div className="relative w-full flex items-center justify-center overflow-hidden" style={{ height: '100vh' }}>
            {/* Hintergrundbild */}
            <div className="absolute inset-0 w-full h-full -top-16 lg:-top-20" style={{ height: 'calc(100vh + 5rem)' }}>
                <Image
                    fill
                    src="/image/Background.png"
                    alt="Wohnmobil"
                    className="object-cover object-center w-full h-full"
                    sizes="100vw"
                    priority
                />
            </div>

            {/* Hauptcontent leicht nach oben verschoben */}
            <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
                <Typography
                    variant="h1"
                    color="blue-gray"
                    className="text-5xl lg:text-6xl xl:text-7xl font-medium !leading-tight mb-8 drop-shadow-2xl"
                >
                    Willkommen bei <span className="font-bold text-green-800">Wohnmobil Verleih</span>
                </Typography>

                <Typography
                    variant="lead"
                    className="text-xl text-white lg:text-2xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed"
                >
                    Entdecken Sie die Freiheit des Reisens. Unsere hochwertigen Wohnmobile bringen Sie zu
                    unvergesslichen Abenteuern.
                </Typography>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button
                        variant="filled"
                        size="lg"
                        className="bg-green-900 hover:bg-green-800 px-8 py-4 text-base font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        Jetzt Wohnmobil buchen
                    </Button>
                    <Button
                        variant="filled"
                        size="lg"
                        className="bg-green-900 hover:bg-green-800 px-8 py-4 text-base font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        Alle Fahrzeuge ansehen
                    </Button>
                </div>
            </div>
        </div>
    );
}
export default Hero;
