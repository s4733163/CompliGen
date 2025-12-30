import React from 'react'
import '../styling/Home.css'
import Navbar from './Navbar'
import HeroSection from './HeroSection'
import Working from './Working'
import PowerfulFeatures from './PowerfulFeatures'
import Footer from './Footer'

const Home = () => {
    return (
        <div>
            <Navbar />

            {/* Hero Section */}
            <div>
                <HeroSection/>
            </div>

            {/* How It Works Section */}
            <div>
                <Working />
            </div>

            {/* Powerful Features */}
            <div>
                <PowerfulFeatures />
            </div>

            {/* Footer */}
            <Footer />
        </div>
    )
}

export default Home
