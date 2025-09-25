'use client';

import React from 'react';
import { Typography, Card, CardBody, CardHeader, Button } from '@material-tailwind/react';
import SuggestionCard from '@/components/suggestion-card';

const EVENTS = [
    {
        img: '/image/blogs/blog-1.svg',
        title: 'Camper für Familien',
        desc: 'Entdecken Sie die besten Wohnmobile für Familienurlaube.',
        buttonLabel: 'Jetzt buchen'
    },
    {
        img: '/image/blogs/blog2.svg',
        title: 'Camper mit Haustiererlaubnis',
        desc: 'Entdecken Sie die besten Wohnmobile, die Haustiere erlauben.',
        buttonLabel: 'Jetzt buchen'
    },
    {
        img: '/image/blogs/blog3.svg',
        title: 'kleine Camper für Paare',
        desc: 'Entdecken Sie die besten kleinen Camper für romantische Ausflüge zu zweit.',
        buttonLabel: 'Jetzt buchen'
    },
    {
        img: '/image/blogs/blog4.svg',
        title: 'günstige Camper für jedes Budget',
        desc: 'Entdecken Sie die besten Wohnmobile zu erschwinglichen Preisen.',
        buttonLabel: 'Jetzt buchen'
    }
];

export function Suggestions() {
    return (
        <section className="py-20 px-8">
            <div className="container mx-auto mb-20 text-center">
                <Typography variant="h2" color="blue-gray" className="mb-4">
                    Unsere Vorschläge
                </Typography>
                <Typography variant="lead" className="mx-auto w-full px-4 font-normal !text-gray-500 lg:w-6/12">
                    Entdecken Sie unsere Veranstaltungen im Bereich Webentwicklung, die darauf abzielen, Einblicke,
                    Trends und praktische Erfahrungen zu teilen.
                </Typography>
            </div>
            <div className="container mx-auto grid grid-cols-1 gap-x-10 gap-y-20 md:grid-cols-2 xl:grid-cols-4">
                {EVENTS.map((props, idx) => (
                    <SuggestionCard key={idx} {...props} />
                ))}
            </div>
        </section>
    );
}

export default Suggestions;
