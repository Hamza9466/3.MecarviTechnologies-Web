import React from 'react';

const CallToAction: React.FC = () => {
    return (
        <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-16">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-bold mb-4">
                    Ready to Get Started?
                </h2>
                <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
                    Let's discuss how our services can help transform your business and achieve your goals.
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200 shadow-lg">
                    Contact Us Today
                </button>
            </div>
        </section>
    );
};

export default CallToAction;
