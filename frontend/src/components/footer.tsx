import { Typography } from '@material-tailwind/react';

const LINKS = [
    {
        title: 'Unternehmen',
        items: [
            { label: 'Über uns', href: '/ueber-uns' },
            { label: 'Kontakt', href: '/kontakt' },
            { label: 'Standorte', href: '/kontakt#standorte' }
        ]
    },
    {
        title: 'Service',
        items: [
            { label: 'Wohnmobile', href: '/wohnmobile' },
            { label: 'Meine Buchungen', href: '/my-bookings' },
            { label: 'Anmeldung', href: '/auth' }
        ]
    },
    {
        title: 'Legal',
        items: [
            { label: 'Impressum', href: '#' },
            { label: 'Datenschutz', href: '#' },
            { label: 'AGB', href: '#' }
        ]
    }
];

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
    return (
        <footer className="px-8 pt-24 pb-8 bg-blue-gray-800">
            <div className="container max-w-6xl flex flex-col mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 !w-full">
                    <div className="flex col-span-2 items-start gap-10 mb-10 lg:mb-0 md:gap-36">
                        {LINKS.map(({ title, items }) => (
                            <ul key={title}>
                                <Typography variant="h6" color="white" className="mb-4">
                                    {title}
                                </Typography>
                                {items.map(({ label, href }) => (
                                    <li key={label}>
                                        <Typography
                                            as="a"
                                            href={href}
                                            className="py-1 font-normal !text-blue-gray-300 transition-colors hover:!text-white"
                                        >
                                            {label}
                                        </Typography>
                                    </li>
                                ))}
                            </ul>
                        ))}
                    </div>
                    <div>
                        <Typography variant="h6" className="mb-3 text-left text-white">
                            Kontakt
                        </Typography>
                        <Typography className="!text-blue-gray-300 font-normal mb-4 text-base">
                            Vanlife Süd - Ihr Partner für unvergessliche Wohnmobil-Abenteuer seit 2019.
                        </Typography>
                        <div className="space-y-2">
                            <Typography className="!text-blue-gray-300 font-normal text-sm">
                                📍 München, Deutschland
                            </Typography>
                            <Typography className="!text-blue-gray-300 font-normal text-sm">
                                📞 +49 89 123 456 789
                            </Typography>
                            <Typography className="!text-blue-gray-300 font-normal text-sm">
                                ✉️ info@vanlife-sued.de
                            </Typography>
                            <Typography className="!text-blue-gray-300 font-normal text-sm">
                                🕒 Mo-Fr: 8:00-19:00, Sa: 9:00-17:00
                            </Typography>
                        </div>
                    </div>
                </div>
                <Typography color="blue-gray" className="md:text-center mt-16 font-normal !text-blue-gray-300">
                    &copy; {CURRENT_YEAR} Vanlife Süd. Entwickelt von Jannis Köllner und Hai Viet Vu.
                </Typography>
            </div>
        </footer>
    );
}

export default Footer;
