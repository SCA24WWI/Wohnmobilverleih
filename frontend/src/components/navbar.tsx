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
                variant="paragraph"
                color="white"
                className="flex items-center gap-2 font-medium hover:text-gray-200 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-white/10"
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
                <Button variant="text" color="white" className="flex items-center gap-2 p-2">
                    <UserCircleIcon className="h-7 w-7" />
                    <ChevronDownIcon className="h-4 w-4" />
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
        <div className="px-10 top-4 z-50">
            <div className="mx-auto container">
                <MTNavbar className="z-50 mt-6 relative border-0 shadow-lg bg-green-900 !bg-opacity-100">
                    <div className="flex items-center justify-between">
                        <Typography variant="h5" color="white" className="font-bold">
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
                        <div className="hidden items-center gap-4 lg:flex">{authMenu}</div>
                        <IconButton
                            variant="text"
                            color="white"
                            size="lg"
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
                            <div className="mt-6 mb-4 flex items-center gap-4">{authMenu}</div>
                        </div>
                    </Collapse>
                </MTNavbar>
            </div>
        </div>
    );
}

export default Navbar;
