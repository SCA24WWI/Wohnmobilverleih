// components
import { Navbar, Footer } from '@/components';

// sections
import Hero from './hero';
import Suggestions from './suggestions';
import Quickbook from './quickbook';

export default function Campaign() {
    return (
        <>
            <Navbar />
            <Hero />
            <Suggestions />
            <Quickbook />
            <Footer />
        </>
    );
}
