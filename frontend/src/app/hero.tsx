'use client';

import Image from 'next/image';
import { Button, Typography, Card } from '@material-tailwind/react';

function Hero() {
    return (
        <div className="relative h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Hintergrundbild als Overlay */}
            <div className="absolute inset-0 opacity-10">
                <Image
                    width={1920}
                    height={1080}
                    src="/image/Background.png"
                    alt="Wohnmobil"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Hauptcontent zentriert */}
            <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
                <Typography
                    variant="h1"
                    color="blue-gray"
                    className="text-5xl lg:text-6xl xl:text-7xl font-light !leading-tight mb-8"
                >
                    Willkommen bei <span className="font-bold text-green-900">Wohnmobil Verleih</span>
                </Typography>

                <Typography
                    variant="lead"
                    color="gray"
                    className="text-xl lg:text-2xl font-light mb-12 max-w-2xl mx-auto leading-relaxed"
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
                        variant="outlined"
                        size="lg"
                        className="border-2 border-green-900 text-green-900 hover:bg-green-800 hover:text-white hover:border-green-800 px-8 py-4 text-base font-medium rounded-full transition-all duration-300"
                    >
                        Alle Fahrzeuge ansehen
                    </Button>
                </div>
            </div>

            {/* Scroll Indikator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
                </div>
            </div>
        </div>
    );
}
export default Hero;
