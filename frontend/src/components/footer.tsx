import { Typography, Button, Input } from '@material-tailwind/react';

const LINKS = [
    {
        title: 'Company',
        items: ['About Us', 'Careers', 'Premium Tools', 'Blog']
    },
    {
        title: 'Pages',
        items: ['Login', 'Register', 'Add List', 'Contact']
    },
    {
        title: 'Legal',
        items: ['Terms', 'Privacy', 'Team', 'About Us']
    }
];

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
    return (
        <footer className="px-8 pt-24 pb-8 bg-blue-gray-800">
            <div className="container max-w-6xl flex flex-col mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 !w-full ">
                    <div className="flex col-span-2 items-center gap-10 mb-10 lg:mb-0 md:gap-36">
                        {LINKS.map(({ title, items }) => (
                            <ul key={title}>
                                <Typography variant="h6" color="white" className="mb-4">
                                    {title}
                                </Typography>
                                {items.map((link) => (
                                    <li key={link}>
                                        <Typography
                                            as="a"
                                            href="#"
                                            className="py-1 font-normal !text-blue-gray-300 transition-colors hover:!text-white"
                                        >
                                            {link}
                                        </Typography>
                                    </li>
                                ))}
                            </ul>
                        ))}
                    </div>
                    <div className="">
                        <Typography variant="h6" className="mb-3 text-left text-white">
                            Subscribe
                        </Typography>
                        <Typography className="!text-blue-gray-300 font-normal mb-4 text-base">
                            Get access to subscriber exclusive deals and be the first who gets informed about fresh
                            sales.
                        </Typography>
                        <Typography variant="small" className="font-medium mb-2 text-left text-white">
                            Your Email
                        </Typography>
                        <div className="flex mb-3 flex-col lg:flex-row items-start gap-4">
                            <div className="w-full">
                                {/* @ts-ignore */}
                                <Input label="Email" color="gray" />
                                <Typography className="font-medium mt-3 !text-sm !text-blue-gray-300 text-left">
                                    I agree the{' '}
                                    <a href="#" className="font-bold underline hover:text-white transition-colors">
                                        Terms and Conditions{' '}
                                    </a>
                                </Typography>
                            </div>
                            <Button color="white" className="w-full lg:w-fit" size="md">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>
                <Typography color="blue-gray" className="md:text-center mt-16 font-normal !text-blue-gray-300">
                    &copy; {CURRENT_YEAR} Made with{' '}
                    <a
                        href="https://www.material-tailwind.com"
                        target="_blank"
                        className="text-white hover:text-blue-gray-100"
                    >
                        Material Tailwind
                    </a>{' '}
                    by{' '}
                    <a
                        href="https://www.creative-tim.com"
                        target="_blank"
                        className="text-white hover:text-blue-gray-100"
                    >
                        Creative Tim
                    </a>
                    .
                </Typography>
            </div>
        </footer>
    );
}

export default Footer;
