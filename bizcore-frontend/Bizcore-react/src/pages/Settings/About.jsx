import React from 'react';

const About = () => {
    return (
        <div className="bg-gradient-to-r from-blue-500 to-teal-400 py-10 overflow-x-auto h-166 custom-scrollbar">
            <div className="container mx-auto px-6 text-center text-white">
                <h1 className="text-5xl font-bold mb-4">About Our Web App</h1>
                <p className="text-lg mb-12 opacity-80">
                    Empowering businesses with an easy-to-use platform for seamless operations and management.
                </p>

                {/* About Section */}
                <section className="mb-16">
                    <div className="bg-white text-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto transform transition-all hover:scale-105 hover:shadow-2xl duration-300">
                        <h2 className="text-3xl font-semibold mb-4">Our Journey</h2>
                        <p className="text-lg">
                            Founded in <strong>2025</strong>, our web app started with a single goal: to simplify and streamline business processes. Since then, we've been continuously improving, adding new features, and making it more powerful every day.
                        </p>
                    </div>
                </section>

                {/* Owner Section */}
                <section className="mb-16">
                    <div className="bg-white text-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto transform transition-all hover:scale-105 hover:shadow-2xl duration-300">
                        <h2 className="text-3xl font-semibold mb-4">The Owner</h2>
                        <p className="text-lg">
                            The platform was created by <strong>Muhamad Rufaid</strong>, a tech enthusiast and entrepreneur with a vision to simplify business management for everyone, regardless of company size.
                        </p>
                    </div>
                </section>

                {/* Key Features Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-semibold mb-8">Key Features</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="feature-card bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:transform hover:scale-105 transition duration-300">
                            <h3 className="text-xl text-blue-500 font-semibold mb-2">Real-Time Tax and GST Calculation</h3>
                            <p className="text-gray-600">During bill creation, tax and GST are calculated in real time, providing instant feedback on the total cost. An estimated bill is also available for preview before finalizing.</p>
                        </div>
                        <div className="feature-card bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:transform hover:scale-105 transition duration-300">
                            <h3 className="text-xl text-blue-500 font-semibold mb-2">Automated Invoice and Payment Calculations</h3>
                            <p className="text-gray-600">The system automatically calculates the total tax, GST payable, amount paid, and outstanding balance for each invoice, ensuring accurate financial tracking and transparency.</p>
                        </div>
                        <div className="feature-card bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:transform hover:scale-105 transition duration-300">
                            <h3 className="text-xl text-blue-500 font-semibold mb-2">Sales and Purchase Management</h3>
                            <p className="text-gray-600">The platform offers comprehensive sales and purchase management , streamlining transactions and providing seamless inventory tracking and vendor relations.</p>
                        </div>
                        <div className="feature-card bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:transform hover:scale-105 transition duration-300">
                            <h3 className="text-xl text-blue-500 font-semibold mb-2">Invoice Modification and Draft Saving</h3>
                            <p className="text-gray-600">Users have the flexibility to modify invoices even after creation. Additionally, invoices can be saved as drafts for later completion, and once finalized, they are officially recorded.</p>
                        </div>
                        <div className="feature-card bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:transform hover:scale-105 transition duration-300">
                            <h3 className="text-xl text-blue-500 font-semibold mb-2">Flexible Payment System</h3>
                            <p className="text-gray-600">A robust payment system allows users to make partial payments towards an invoice. The invoice is marked as paid once the total payment equals the invoice amount.</p>
                        </div>
                        <div className="feature-card bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:transform hover:scale-105 transition duration-300">
                            <h3 className="text-xl text-blue-500  font-semibold mb-2">Product and Category Management</h3>
                            <p className="text-gray-600">Manage products efficiently, including categorization for better organization and easier tracking.</p>
                        </div>
                        <div className="feature-card bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:transform hover:scale-105 transition duration-300">
                            <h3 className="text-xl text-blue-500  font-semibold mb-2">Customer and Vendor Management</h3>
                            <p className="text-gray-600">Easily manage customer and vendor information, improving communication and streamlining order and payment processes.</p>
                        </div>
                        <div className="feature-card bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:transform hover:scale-105 transition duration-300">
                            <h3 className="text-xl text-blue-500  font-semibold mb-2">Business Analytics</h3>
                            <p className="text-gray-600">Gain valuable insights into your business operations with built-in analytics that help monitor performance and make informed decisions.</p>
                        </div>
                        <div className="feature-card bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:transform hover:scale-105 transition duration-300">
                            <h3 className="text-xl text-blue-500  font-semibold mb-2">Multiple Payment Methods</h3>
                            <p className="text-gray-600">Support for various payment methods, allowing dedicated payments to be applied to a single invoice based on the chosen mode of payment.</p>
                        </div>
                        <div className="feature-card bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:transform hover:scale-105 transition duration-300">
                            <h3 className="text-xl text-blue-500  font-semibold mb-2">Automated Inventory Management</h3>
                            <p className="text-gray-600">When a finalized invoice is updated, the system automatically adjusts the inventory levels, ensuring real-time stock tracking and preventing discrepancies.</p>
                        </div>
                    </div>
                </section>

                {/* Call to Action Section */}
                <section className="cta bg-teal-600 text-white py-8 mt-16 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-semibold mb-4">Want to Learn More?</h2>
                    <p className="text-lg mb-4">We are always happy to answer your questions and discuss how our app can help your business!</p>
                    <a href="" className="bg-white text-teal-600 font-semibold text-black py-2 px-6 rounded-full hover:bg-teal-700 transition duration-300">
                        Contact Us
                    </a>
                </section>
            </div>
        </div>
    );
};

export default About;
