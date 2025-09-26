// components
import { Navbar, Footer } from '@/components';

// sections
import Hero from './hero';
import OutImpressiveStats from './out-impressive-stats';
import CoursesCategories from './courses-categories';
import ExploreCourses from './explore-courses';
import Testimonial from './testimonial';
import Suggestions from './suggestions';
import StudentsFeedback from './students-feedback';
import TrustedCompany from './trusted-companies';
import { Quickbook } from './quickbook';

export default function Campaign() {
    return (
        <>
            <Navbar />
            <Hero />
            <Suggestions />
            <Quickbook />
            <OutImpressiveStats />
            <CoursesCategories />
            <ExploreCourses />
            <Testimonial />
            <StudentsFeedback />
            <TrustedCompany />
            <Footer />
        </>
    );
}
