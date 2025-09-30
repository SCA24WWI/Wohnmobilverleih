// components
import { Navbar, Footer } from '@/components';

// sections
import Hero from './hero';
import Suggestions from './suggestions';

export default function Campaign() {
    return (
        <>
            <Navbar transparent={true} />
            <Hero />
            <Suggestions />
            <Footer />
        </>
    );
}
