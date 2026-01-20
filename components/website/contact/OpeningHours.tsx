"use client";

export default function HoursOfOperation() {
    return (
        <section className="w-full bg-gradient-to-r from-pink-600 to-pink-500 h-[550px] ms-15  lg:w-[92%] ">
            <div className=" mx-auto px-6 py-24 text-white">

                {/* Title */}
                <h2 className="text-center text-2xl font-semibold mb-12">
                    Hours of Operation:
                </h2>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

                    {/* Column 1 */}
                    <div className="px-6">
                        <h3 className="font-semibold mb-4">Customer Care:</h3>
                        <ul className="space-y-2 text-sm opacity-90">
                            <li>Monday - Friday: 8am - 8pm</li>
                            <li>Saturday: 10am - 5pm</li>
                            <li>Sunday: Closed</li>
                            <li>Public Holidays: Closed</li>
                        </ul>
                    </div>

                    {/* Column 2 */}
                    <div className="px-6 lg:border-l lg:border-white/40">
                        <h3 className="font-semibold mb-4">Sales:</h3>
                        <ul className="space-y-2 text-sm opacity-90">
                            <li>Monday - Friday: 9am - 6pm</li>
                            <li>Saturday: 11am - 4pm</li>
                            <li>Sunday: Closed</li>
                            <li>Public Holidays: Closed</li>
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div className="px-6 lg:border-l lg:border-white/40">
                        <h3 className="font-semibold mb-4">
                            Technical Support <span className="font-normal">(Standard)</span>
                        </h3>
                        <ul className="space-y-2 text-sm opacity-90">
                            <li>Monday - Friday: 8am - 10pm</li>
                            <li>Saturday: 9am - 8pm</li>
                            <li>Sunday: 11am - 7pm</li>
                            <li>Public Holidays: 10am - 7pm</li>
                        </ul>
                    </div>

                    {/* Column 4 */}
                    <div className="px-6 lg:border-l lg:border-white/40">
                        <h3 className="font-semibold mb-4">
                            Technical Support <span className="font-normal">(Platinum)</span>
                        </h3>
                        <ul className="space-y-2 text-sm opacity-90">
                            <li>Monday - Friday: 7am - 4am</li>
                            <li>Saturday: 8am - 2am</li>
                            <li>Sunday: 8am - 11pm</li>
                            <li>Public Holidays: 8am - 2am</li>
                        </ul>
                    </div>

                </div>
            </div>
        </section>
    );
}
