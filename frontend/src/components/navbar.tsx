import React, { useState } from 'react';
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
        icon: TruckIcon
    },
    {
        name: 'Über uns',
        icon: InformationCircleIcon
    },
    {
        name: 'Kontakt',
        icon: PhoneIcon
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
                variant="lead"
                className="flex items-center gap-3 font-bold hover:text-gray-200 transition-colors duration-200 px-4 py-3 rounded-lg hover:bg-white/10 text-white text-lg drop-shadow-md"
            >
                {children}
            </Typography>
        </li>
    );
}

export function Navbar() {
    const [open, setOpen] = React.useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const authMenu = (
        <Menu>
            <MenuHandler>
                <Button variant="text" className="flex items-center gap-2 p-2 text-white">
                    <UserCircleIcon className="h-10 w-10 drop-shadow-md" />
                    <ChevronDownIcon className="h-8 w-8 drop-shadow-md" />
                </Button>
            </MenuHandler>
            <MenuList>
                {isLoggedIn ? (
                    <>
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
                        <MenuItem onClick={() => setIsLoggedIn(false)}>Abmelden</MenuItem>
                    </>
                ) : (
                    <>
                        <MenuItem>
                            <a href="/register" className="w-full">
                                Registrieren
                            </a>
                        </MenuItem>
                        <MenuItem onClick={() => setIsLoggedIn(true)}>Anmelden</MenuItem>
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
        <div className="absolute top-0 left-0 right-0 px-10 z-50">
            <div className="max-w-full">
                <div className="flex items-center justify-between">
                    <Typography variant="h4" className="font-bold text-white text-2xl lg:text-3xl drop-shadow-lg">
                        Wohnmobil Verleih
                    </Typography>

                    {/* Absolut zentrierte NavMenu */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 hidden lg:block">
                        <ul className="flex items-center gap-8">
                            {NAV_MENU.map(({ name, icon: Icon }) => (
                                <NavItem key={name}>
                                    <Icon className="h-6 w-6 drop-shadow-md" />
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
                        className="ml-auto inline-block lg:hidden text-white drop-shadow-md"
                    >
                        {open ? (
                            <XMarkIcon strokeWidth={2} className="h-6 w-6 drop-shadow-md" />
                        ) : (
                            <Bars3Icon strokeWidth={2} className="h-6 w-6 drop-shadow-md" />
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
                        <div className="mt-6 mb-4 flex items-center gap-4">{authMenu}</div>
                    </div>
                </Collapse>
            </div>
        </div>
    );
}

export default Navbar;
