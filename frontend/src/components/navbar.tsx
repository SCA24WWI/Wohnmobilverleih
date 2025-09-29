'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
    Navbar as MTNavbar,
    Collapse,
    Button,
    IconButton,
    Typography,
    Input,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem
} from '@material-tailwind/react';
import {
    TruckIcon,
    InformationCircleIcon,
    PhoneIcon,
    XMarkIcon,
    Bars3Icon,
    MagnifyingGlassIcon,
    UserCircleIcon,
    ChevronDownIcon
} from '@heroicons/react/24/solid';

const NAV_MENU = [
    {
        name: 'Wohnmobile',
        icon: TruckIcon,
        href: '/wohnmobile'
    },
    {
        name: 'Über uns',
        icon: InformationCircleIcon,
        href: '/ueber-uns'
    },
    {
        name: 'Kontakt',
        icon: PhoneIcon,
        href: '/kontakt'
    }
];

interface NavItemProps {
    children: React.ReactNode;
    href?: string;
    transparent?: boolean;
}

interface NavbarProps {
    transparent?: boolean;
}

function NavItem({ children, href, transparent = false }: NavItemProps) {
    return (
        <li>
            <Typography
                as="a"
                href={href || '#'}
                target="_self"
                variant="lead"
                className={`flex items-center gap-3 font-bold hover:text-gray-200 transition-colors duration-200 px-4 py-3 rounded-lg hover:bg-white/10 text-white text-lg ${
                    transparent ? 'drop-shadow-md' : ''
                }`}
            >
                {children}
            </Typography>
        </li>
    );
}

export function Navbar({ transparent = false }: NavbarProps) {
    const [open, setOpen] = React.useState(false);
    const { user, logout } = useAuth();

    const authMenu = (
        <Menu>
            <MenuHandler>
                <Button variant="text" className="flex items-center gap-2 p-2 text-white">
                    <UserCircleIcon className={`h-10 w-10 ${transparent ? 'drop-shadow-md' : ''}`} />
                    <ChevronDownIcon className={`h-8 w-8 ${transparent ? 'drop-shadow-md' : ''}`} />
                </Button>
            </MenuHandler>
            <MenuList>
                {user ? (
                    <>
                        <MenuItem>
                            <div className="px-2 py-1 text-sm text-gray-600">Hallo, {user.vorname}!</div>
                        </MenuItem>
                        <MenuItem>
                            <a href="/bookings" className="w-full">
                                Meine Buchungen
                            </a>
                        </MenuItem>
                        <MenuItem>
                            <a href="/profile" className="w-full">
                                Mein Profil
                            </a>
                        </MenuItem>
                        <MenuItem onClick={logout}>Abmelden</MenuItem>
                    </>
                ) : (
                    <>
                        <MenuItem>
                            <a href="/auth" className="w-full">
                                Registrieren
                            </a>
                        </MenuItem>
                        <MenuItem>
                            <a href="/auth" className="w-full">
                                Anmelden
                            </a>
                        </MenuItem>
                    </>
                )}
            </MenuList>
        </Menu>
    );

    function handleOpen() {
        setOpen((cur) => !cur);
    }

    React.useEffect(() => {
        window.addEventListener('resize', () => window.innerWidth >= 960 && setOpen(false));
    }, []);

    return (
        <div
            className={`${transparent ? 'absolute' : 'fixed'} top-0 left-0 right-0 px-10 z-50 ${
                !transparent ? 'bg-green-800 shadow-lg' : ''
            }`}
        >
            <div className="max-w-full">
                <div className="flex items-center justify-between py-4">
                    <Typography
                        as="a"
                        href="/"
                        variant="h4"
                        className={`font-bold text-2xl lg:text-3xl cursor-pointer hover:opacity-80 transition-opacity duration-300 ${
                            transparent ? 'text-white drop-shadow-lg' : 'text-white'
                        }`}
                    >
                        Wohnmobil
                        <br /> Verleih
                    </Typography>

                    {/* Absolut zentrierte NavMenu */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 hidden lg:block">
                        <ul className="flex items-center gap-8">
                            {NAV_MENU.map(({ name, icon: Icon, href }) => (
                                <NavItem key={name} href={href} transparent={transparent}>
                                    <Icon className={`h-6 w-6 ${transparent ? 'drop-shadow-md' : ''}`} />
                                    {name}
                                </NavItem>
                            ))}
                        </ul>
                    </div>

                    <div className="hidden items-center gap-4 lg:flex">{authMenu}</div>
                    <IconButton
                        variant="text"
                        color="white"
                        size="lg"
                        onClick={handleOpen}
                        className={`ml-auto inline-block lg:hidden text-white ${transparent ? 'drop-shadow-md' : ''}`}
                    >
                        {open ? (
                            <XMarkIcon strokeWidth={2} className={`h-6 w-6 ${transparent ? 'drop-shadow-md' : ''}`} />
                        ) : (
                            <Bars3Icon strokeWidth={2} className={`h-6 w-6 ${transparent ? 'drop-shadow-md' : ''}`} />
                        )}
                    </IconButton>
                </div>
                <Collapse open={open}>
                    <div className="container mx-auto mt-3 border-t border-gray-200 px-2 pt-4">
                        <ul className="flex flex-col gap-4">
                            {NAV_MENU.map(({ name, icon: Icon, href }) => (
                                <NavItem key={name} href={href} transparent={transparent}>
                                    <Icon className="h-5 w-5" />
                                    {name}
                                </NavItem>
                            ))}
                        </ul>
                        <div className="mt-6 mb-4 flex items-center gap-4">{authMenu}</div>
                    </div>
                </Collapse>
            </div>
        </div>
    );
}

export default Navbar;
