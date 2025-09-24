import React, { useState } from 'react';
import { Navbar as MTNavbar, Collapse, Button, IconButton, Typography, Input } from '@material-tailwind/react';
import {
    RectangleStackIcon,
    UserCircleIcon,
    CommandLineIcon,
    Squares2X2Icon,
    XMarkIcon,
    Bars3Icon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/solid';

const NAV_MENU = [
    {
        name: 'Wohnmobile',
        icon: RectangleStackIcon
    },
    {
        name: 'Über uns',
        icon: UserCircleIcon
    },
    {
        name: 'Kontakt',
        icon: CommandLineIcon
    }
];

interface NavItemProps {
    children: React.ReactNode;
    href?: string;
}

function NavItem({ children, href }: NavItemProps) {
    return (
        <li>
            <Typography
                as="a"
                href={href || '#'}
                target={href ? '_blank' : '_self'}
                variant="paragraph"
                color="gray"
                className="flex items-center gap-2 font-medium text-gray-900"
            >
                {children}
            </Typography>
        </li>
    );
}

export function Navbar() {
    const [open, setOpen] = React.useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Ersetze deine bisherige authLink-Definition hiermit:
    let authLink;

    if (isLoggedIn) {
        authLink = (
            <>
                <a href="/bookings">
                    <Button variant="text">Meine Buchungen</Button>
                </a>
                <a href="/profile">
                    <Button variant="text">Mein Profil</Button>
                </a>
                <Button color="gray" onClick={() => setIsLoggedIn(false)}>
                    Abmelden
                </Button>
            </>
        );
    } else {
        authLink = (
            <>
                <a href="/register">
                    <Button variant="text">Registrieren</Button>
                </a>
                <Button color="gray" onClick={() => setIsLoggedIn(true)}>
                    Anmelden
                </Button>
            </>
        );
    }

    function handleOpen() {
        setOpen((cur) => !cur);
    }

    React.useEffect(() => {
        window.addEventListener('resize', () => window.innerWidth >= 960 && setOpen(false));
    }, []);

    return (
        <div className="px-10 sticky top-4 z-50">
            <div className="mx-auto container">
                <MTNavbar blurred color="white" className="z-50 mt-6 relative border-0 pr-3 py-3 pl-6 bg-[#3d9948]">
                    <div className="flex items-center justify-between">
                        <Typography color="blue-gray" className="text-lg font-bold">
                            Wohnmobil Verleih
                        </Typography>

                        <ul className="ml-4 hidden items-center gap-6 lg:flex">
                            {NAV_MENU.map(({ name, icon: Icon }) => (
                                <NavItem key={name}>
                                    <Icon className="h-5 w-5" />
                                    {name}
                                </NavItem>
                            ))}
                        </ul>
                        <div className="hidden items-center gap-4 lg:flex">{authLink}</div>
                        <IconButton
                            variant="text"
                            color="gray"
                            onClick={handleOpen}
                            className="ml-auto inline-block lg:hidden"
                        >
                            {open ? (
                                <XMarkIcon strokeWidth={2} className="h-6 w-6" />
                            ) : (
                                <Bars3Icon strokeWidth={2} className="h-6 w-6" />
                            )}
                        </IconButton>
                    </div>
                    <Collapse open={open}>
                        <div className="container mx-auto mt-3 border-t border-gray-200 px-2 pt-4">
                            <ul className="flex flex-col gap-4">
                                {NAV_MENU.map(({ name, icon: Icon }) => (
                                    <NavItem key={name}>
                                        <Icon className="h-5 w-5" />
                                        {name}
                                    </NavItem>
                                ))}
                            </ul>
                            <div className="mt-6 mb-4 flex items-center gap-4">{authLink}</div>
                        </div>
                    </Collapse>
                </MTNavbar>
            </div>
        </div>
    );
}

export default Navbar;
