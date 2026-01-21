"use client";

import { useState } from "react";

interface QuoteRequest {
    id: number;
    name: string;
    email: string;
    phone: string;
    company: string;
    service: string;
    project_description: string;
    budget: string;
    timeline: string;
    message: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    created_at: string;
    updated_at: string;
}

interface PrimaryContact {
    id: number;
    full_name: string;
    job_title: string;
    company_name: string;
    email: string;
    phone_number: string;
    preferred_contact_method: string;
}

export default function QuoteEditor() {
    const [activeTab, setActiveTab] = useState("businessInfo");
    const [primaryContacts, setPrimaryContacts] = useState<PrimaryContact[]>([
        {
            id: 1,
            full_name: "John Doe",
            job_title: "CEO",
            company_name: "Acme Corp",
            email: "john.doe@example.com",
            phone_number: "+1-234-567-8900",
            preferred_contact_method: "Email"
        },
        {
            id: 2,
            full_name: "Jane Smith",
            job_title: "Project Manager",
            company_name: "Tech Solutions",
            email: "jane.smith@example.com",
            phone_number: "+1-987-654-3210",
            preferred_contact_method: "Phone"
        }
    ]);
    const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([
        {
            id: 1,
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "+1-234-567-8900",
            company: "Acme Corp",
            service: "Web Design",
            project_description: "Need a new website for our business",
            budget: "$5,000 - $10,000",
            timeline: "2-3 months",
            message: "Looking for a modern, responsive website with e-commerce functionality",
            status: "pending",
            created_at: "2024-01-20T10:30:00.000000Z",
            updated_at: "2024-01-20T10:30:00.000000Z",
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane.smith@example.com",
            phone: "+1-987-654-3210",
            company: "Tech Solutions",
            service: "Mobile App",
            project_description: "iOS and Android app for our service",
            budget: "$10,000 - $20,000",
            timeline: "4-6 months",
            message: "Need cross-platform mobile application with real-time features",
            status: "in_progress",
            created_at: "2024-01-19T14:15:00.000000Z",
            updated_at: "2024-01-20T09:45:00.000000Z",
        },
    ]);

    const [selectedRequest, setSelectedRequest] = useState<QuoteRequest | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const statusColors = {
        pending: "bg-yellow-100 text-yellow-800",
        in_progress: "bg-blue-100 text-blue-800",
        completed: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
    };

    const updateStatus = async (id: number, newStatus: QuoteRequest['status']) => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setQuoteRequests(prev =>
                prev.map(request =>
                    request.id === id
                        ? { ...request, status: newStatus, updated_at: new Date().toISOString() }
                        : request
                )
            );

            setSuccess("Status updated successfully!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError("Failed to update status");
            setTimeout(() => setError(""), 3000);
        } finally {
            setLoading(false);
        }
    };

    const deleteRequest = async (id: number) => {
        if (!confirm("Are you sure you want to delete this quote request?")) {
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setQuoteRequests(prev => prev.filter(request => request.id !== id));
            setSelectedRequest(null);

            setSuccess("Quote request deleted successfully!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError("Failed to delete quote request");
            setTimeout(() => setError(""), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Success/Error Messages */}
            {success && (
                <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                    {success}
                </div>
            )}
            {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-2 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab("businessInfo")}
                        className={`py-2 px-3 border-b-2 font-medium text-xs whitespace-nowrap ${activeTab === "businessInfo"
                            ? "border-pink-500 text-pink-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        2. Business Info
                    </button>
                    <button
                        onClick={() => setActiveTab("services")}
                        className={`py-2 px-3 border-b-2 font-medium text-xs whitespace-nowrap ${activeTab === "services"
                            ? "border-pink-500 text-pink-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        3. Services
                    </button>
                    <button
                        onClick={() => setActiveTab("technology")}
                        className={`py-2 px-3 border-b-2 font-medium text-xs whitespace-nowrap ${activeTab === "technology"
                            ? "border-pink-500 text-pink-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        4. Technology
                    </button>
                    <button
                        onClick={() => setActiveTab("domainHosting")}
                        className={`py-2 px-3 border-b-2 font-medium text-xs whitespace-nowrap ${activeTab === "domainHosting"
                            ? "border-pink-500 text-pink-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        5. Domain & Hosting
                    </button>
                    <button
                        onClick={() => setActiveTab("products")}
                        className={`py-2 px-3 border-b-2 font-medium text-xs whitespace-nowrap ${activeTab === "products"
                            ? "border-pink-500 text-pink-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        6. Products
                    </button>
                    <button
                        onClick={() => setActiveTab("customDev")}
                        className={`py-2 px-3 border-b-2 font-medium text-xs whitespace-nowrap ${activeTab === "customDev"
                            ? "border-pink-500 text-pink-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        7. Custom Dev
                    </button>
                    <button
                        onClick={() => setActiveTab("projectScope")}
                        className={`py-2 px-3 border-b-2 font-medium text-xs whitespace-nowrap ${activeTab === "projectScope"
                            ? "border-pink-500 text-pink-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        8. Project Scope
                    </button>
                    <button
                        onClick={() => setActiveTab("technical")}
                        className={`py-2 px-3 border-b-2 font-medium text-xs whitespace-nowrap ${activeTab === "technical"
                            ? "border-pink-500 text-pink-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        9. Technical
                    </button>
                    <button
                        onClick={() => setActiveTab("postLaunch")}
                        className={`py-2 px-3 border-b-2 font-medium text-xs whitespace-nowrap ${activeTab === "postLaunch"
                            ? "border-pink-500 text-pink-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        10. Post-Launch
                    </button>
                    <button
                        onClick={() => setActiveTab("additional")}
                        className={`py-2 px-3 border-b-2 font-medium text-xs whitespace-nowrap ${activeTab === "additional"
                            ? "border-pink-500 text-pink-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        11. Additional
                    </button>
                    <button
                        onClick={() => setActiveTab("confirmation")}
                        className={`py-2 px-3 border-b-2 font-medium text-xs whitespace-nowrap ${activeTab === "confirmation"
                            ? "border-pink-500 text-pink-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        12. Confirmation
                    </button>
                </nav>
            </div>

            {/* Business Info Tab */}
            {activeTab === "businessInfo" && (
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Business Information</h3>
                        <p className="text-sm text-gray-500 mt-1">Manage business details and company information</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Acme Corp</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Technology</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">100-500</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">New York, USA</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Services Tab */}
            {activeTab === "services" && (
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Services</h3>
                        <p className="text-sm text-gray-500 mt-1">Manage available services and offerings</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Range</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Web Design</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Design</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$5,000 - $20,000</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">4-8 weeks</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Available</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Technology Tab */}
            {activeTab === "technology" && (
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Technology Stack</h3>
                        <p className="text-sm text-gray-500 mt-1">Manage technology frameworks and tools</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technology</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proficiency</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">React</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Frontend</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">18.x</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Expert</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Domain & Hosting Tab */}
            {activeTab === "domainHosting" && (
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Domain & Hosting</h3>
                        <p className="text-sm text-gray-500 mt-1">Manage domain names and hosting services</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hosting Plan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renewal Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">example.com</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Premium</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2024-12-15</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Products Tab */}
            {activeTab === "products" && (
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Products</h3>
                        <p className="text-sm text-gray-500 mt-1">Manage product catalog and inventory</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Premium Package</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Service</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$999</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Unlimited</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Available</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Custom Dev Tab */}
            {activeTab === "customDev" && (
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Custom Development</h3>
                        <p className="text-sm text-gray-500 mt-1">Manage custom development projects</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeline</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Custom CRM</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Tech Solutions</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$25,000</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">3 months</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">In Progress</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Project Scope Tab */}
            {activeTab === "projectScope" && (
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Project Scope</h3>
                        <p className="text-sm text-gray-500 mt-1">Define and manage project scopes</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scope Item</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">User Authentication</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">Implement secure login system</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">High</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Technical Tab */}
            {activeTab === "technical" && (
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Technical Requirements</h3>
                        <p className="text-sm text-gray-500 mt-1">Manage technical specifications</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requirement</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specification</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Database</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Backend</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">PostgreSQL 14+</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Approved</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Post-Launch Tab */}
            {activeTab === "postLaunch" && (
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Post-Launch Services</h3>
                        <p className="text-sm text-gray-500 mt-1">Manage post-launch support and maintenance</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Maintenance</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Monthly</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$500</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Additional Tab */}
            {activeTab === "additional" && (
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Additional Services</h3>
                        <p className="text-sm text-gray-500 mt-1">Manage additional and optional services</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">SEO Optimization</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Marketing</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$1,500</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Available</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Confirmation Tab */}
            {activeTab === "confirmation" && (
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Confirmation Details</h3>
                        <p className="text-sm text-gray-500 mt-1">Manage project confirmations and approvals</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confirmation Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Website Redesign</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Acme Corp</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2024-01-20</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Confirmed</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
