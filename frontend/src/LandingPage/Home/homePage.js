import React from 'react';

import Hero from './hero';
import Demo from './Demo';
import Pgragh from './postSaleGraph';
import Features from './features';
import HowItWorks from './howItWorks';
// import Pricing from './pricing';
// import Education from './education';
// import OpenAccount from '../openAccount';


function homePage() {
    return (
        <>
            
            <Hero />
            <Demo/>
            <Pgragh />
            <Features />
            <HowItWorks/>
            
                
        </>
    );
}

export default homePage;