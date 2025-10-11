'use client';

import React from 'react';
import { Typography, Card, CardBody, CardHeader, Button } from '@material-tailwind/react';
import SuggestionCard from '@/components/suggestion-card';

const SUGGESTIONS = [
    {
        img: '/image/blogs/Camper_family.png',
        title: 'Camper für Familien',
        desc: 'Entdecken Sie die besten Wohnmobile für Familienurlaube.',
        href: '/wohnmobile?guests=4&guestMode=minimum' // Filter für 4+ Gäste (Familien)
    },
    {
        img: '/image/blogs/Camper_haustiererlaubnis.png',
        title: 'Camper mit Haustiererlaubnis',
        desc: 'Entdecken Sie die besten Wohnmobile, die Haustiere erlauben.',
        href: '/wohnmobile?pets=true' // Filter für haustierfreundliche Wohnmobile
    },
    {
        img: '/image/blogs/Camper_paare.png',
        title: 'kleine Camper für Paare',
        desc: 'Entdecken Sie die besten kleinen Camper für romantische Ausflüge zu zweit.',
        href: '/wohnmobile?guests=2&guestMode=exact' // Filter für genau 2 Gäste
    },
    {
        img: '/image/blogs/camper_alle_budget.png',
        title: 'günstige Camper für jedes Budget',
        desc: 'Entdecken Sie die besten Wohnmobile zu erschwinglichen Preisen.',
        href: '/wohnmobile?priceMax=100' // Filter für günstigere Wohnmobile (unter 100€/Tag)
    }
];

export function Suggestions() {
    return (
        <section className="py-20 px-8">
            <div className="container mx-auto mb-20 text-center">
                <Typography variant="h2" className="mb-4 text-green-800">
                    Unsere Vorschläge
                </Typography>
                <Typography variant="lead" className="mx-auto w-full px-4 font-medium text-black lg:w-6/12">
                    Entdecken Sie unsere Veranstaltungen im Bereich Webentwicklung, die darauf abzielen, Einblicke,
                    Trends und praktische Erfahrungen zu teilen.
                </Typography>
            </div>
            <div className="container mx-auto grid grid-cols-1 gap-x-10 gap-y-20 md:grid-cols-2 xl:grid-cols-4">
                {SUGGESTIONS.map((props, idx) => (
                    <SuggestionCard key={idx} {...props} />
                ))}
            </div>
        </section>
    );
}

export default Suggestions;
