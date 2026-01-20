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
    const [activeTab, setActiveTab] = useState("contacts");
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
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab("contacts")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "contacts"
                            ? "border-pink-500 text-pink-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        Primary Contacts
                    </button>
                </nav>
            </div>

            {/* Primary Contacts Tab */}
            {activeTab === "contacts" && (
                <div className="bg-white rounded-lg shadow">
                    {/* Section Title and Description */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Primary Contact Information</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage primary contact information for quote requests
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Full Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Job Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Company Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Phone Number
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Preferred Contact Method
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {primaryContacts.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {contact.full_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {contact.job_title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {contact.company_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {contact.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {contact.phone_number}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {contact.preferred_contact_method}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
