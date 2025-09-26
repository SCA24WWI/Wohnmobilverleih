import React from 'react';
import Image from 'next/image';
import { Typography, Card, CardBody, CardHeader, Button } from '@material-tailwind/react';

interface SuggestionCardProps {
    img: string;
    title: string;
    desc: string;
}

export function SuggestionCard({ img, title, desc }: SuggestionCardProps) {
    return (
        <Card color="transparent" shadow={false}>
            <a href="#">
                <CardHeader floated={false} className="mx-0 mt-0 mb-6 h-48">
                    <Image width={768} height={768} src={img} alt={title} className="h-full w-full object-cover" />
                </CardHeader>
                <CardBody className="p-0">
                    <Typography variant="h5" className="mb-2 text-green-800 hover:text-green-600">
                        {title}
                    </Typography>
                    <Typography className="mb-6 font-medium !text-black">{desc}</Typography>
                </CardBody>
            </a>
        </Card>
    );
}

export default SuggestionCard;
