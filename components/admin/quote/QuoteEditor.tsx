"use client";

import { useState, useEffect } from "react";
import { useQuoteFormSubmissions } from "./useQuoteFormSubmissions";

interface QuoteFormSubmissionDetail {
    id: number;
    full_name: string;
    job_title: string | null;
    company_name: string | null;
    email: string;
    phone: string | null;
    preferred_contact_method: string | null;
    industry_sector: string | null;
    company_size: string | null;
    street_address: string | null;
    city: string | null;
    state_province: string | null;
    postal_code: string | null;
    country: string | null;
    business_website: string | null;
    services_required: string | null;
    frontend_technologies: string | null;
    backend_technologies: string | null;
    database_preference: string | null;
    domain_name_ownership: string | null;
    hosting_services_availability: string | null;
    ready_made_product_interest: string | null;
    custom_development_requirement: string | null;
    project_type: string | null;
    brief_project_description: string | null;
    primary_objective: string | null;
    estimated_timeline: string | null;
    estimated_budget_range: string | null;
    required_integrations: string | null;
    security_compliance_requirements: string | null;
    ongoing_maintenance_support: string | null;
    long_term_partnership: string | null;
    how_did_you_hear: string | null;
    uploaded_files: string | null;
    message: string | null;
    authorization_confirmation: boolean;
    is_read: boolean;
    created_at: string;
    updated_at: string;
}

export default function QuoteEditor() {
    const [activeTab, setActiveTab] = useState("submissions");
    const [statusFilter, setStatusFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSubmission, setSelectedSubmission] = useState<QuoteFormSubmissionDetail | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const {
        quoteSubmissions,
        statistics,
        pagination,
        loading,
        error,
        success,
        fetchQuoteSubmissions,
        fetchStatistics,
        markAsRead,
        markAsUnread,
        deleteSubmission,
        getSubmission,
        clearMessages,
    } = useQuoteFormSubmissions();

    // Fetch data on component mount
    useEffect(() => {
        fetchQuoteSubmissions();
        fetchStatistics();
    }, []);

    // Helper function to parse JSON strings
    const parseJsonField = (field: string | null): string[] => {
        if (!field) return [];
        try {
            const parsed = JSON.parse(field);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    // Handle search
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        if (value.length > 2 || value.length === 0) {
            fetchQuoteSubmissions(1, statusFilter || undefined, value || undefined);
        }
    };

    // Handle status filter
    const handleStatusFilter = (status: string) => {
        setStatusFilter(status);
        fetchQuoteSubmissions(1, status || undefined, searchTerm || undefined);
    };

    // Handle view details
    const handleViewDetails = async (id: number) => {
        try {
            setLoadingDetails(true);
            const submission = await getSubmission(id);
            console.log("Fetched submission details:", submission);
            setSelectedSubmission(submission as QuoteFormSubmissionDetail);
            setShowDetailsModal(true);
        } catch (err) {
            console.error("Error fetching submission details:", err);
            alert("Failed to load submission details. Please try again.");
        } finally {
            setLoadingDetails(false);
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
                        onClick={() => setActiveTab("submissions")}
                        className={`py-2 px-3 border-b-2 font-medium text-xs whitespace-nowrap ${activeTab === "submissions"
                            ? "border-pink-500 text-pink-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        Quote Form Submissions
                    </button>
                </nav>
            </div>

            {/* Quote Form Submissions Tab */}
            {activeTab === "submissions" && (
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Quote Form Submissions</h3>
                                <p className="text-sm text-gray-500 mt-1">Manage and view all quote form submissions</p>
                            </div>
                            <div className="flex gap-4 text-sm">
                                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                    Total: {statistics.total_submissions}
                                </div>
                                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                                    Unread: {statistics.unread_submissions}
                                </div>
                                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                                    Read: {statistics.read_submissions}
                                </div>
                            </div>
                        </div>

                        {/* Search and Filter */}
                        <div className="mb-4 flex gap-4">
                            <input
                                type="text"
                                placeholder="Search by name, email, phone, company, or message..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                            />
                            <select
                                value={statusFilter}
                                onChange={(e) => handleStatusFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
                            >
                                <option value="">All Status</option>
                                <option value="unread">Unread Only</option>
                                <option value="read">Read Only</option>
                            </select>
                            <button
                                onClick={() => {
                                    fetchQuoteSubmissions();
                                    fetchStatistics();
                                }}
                                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMAIL</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PHONE</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COMPANY</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">JOB TITLE</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SERVICES</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BUDGET</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TIMELINE</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUBMITTED</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={11} className="px-6 py-8 text-center text-sm text-gray-500">
                                            Loading quote submissions...
                                        </td>
                                    </tr>
                                ) : quoteSubmissions && quoteSubmissions.length > 0 ? (
                                    quoteSubmissions.map((submission) => {
                                        const services = parseJsonField(submission.services_required);
                                        return (
                                            <tr key={submission.id} className={`hover:bg-gray-50 transition-colors ${!submission.is_read ? 'bg-blue-50' : 'bg-white'}`}>
                                                <td className="px-4 py-4 whitespace-nowrap border-b border-gray-200">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${submission.is_read
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {submission.is_read ? 'Read' : 'Unread'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
                                                    <div className="font-medium">{submission.full_name}</div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
                                                    <a href={`mailto:${submission.email}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                                                        {submission.email}
                                                    </a>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
                                                    {submission.phone ? (
                                                        <a href={`tel:${submission.phone}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                                                            {submission.phone}
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
                                                    {submission.company_name || <span className="text-gray-400">-</span>}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
                                                    {submission.job_title || <span className="text-gray-400">-</span>}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-900 max-w-xs border-b border-gray-200">
                                                    {services.length > 0 ? (
                                                        <div className="truncate" title={services.join(", ")}>
                                                            {services.slice(0, 2).join(", ")}{services.length > 2 ? "..." : ""}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
                                                    {submission.estimated_budget_range || <span className="text-gray-400">-</span>}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
                                                    {submission.estimated_timeline || <span className="text-gray-400">-</span>}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
                                                    {submission.created_at ? (
                                                        new Date(submission.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium border-b border-gray-200">
                                                    <div className="flex gap-2 flex-wrap">
                                                        <button
                                                            onClick={() => handleViewDetails(submission.id)}
                                                            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                                                            title="View details"
                                                        >
                                                            View
                                                        </button>
                                                        {submission.is_read ? (
                                                            <button
                                                                onClick={() => markAsUnread(submission.id)}
                                                                className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors"
                                                                title="Mark as unread"
                                                            >
                                                                Unread
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => markAsRead(submission.id)}
                                                                className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                                                                title="Mark as read"
                                                            >
                                                                Read
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('Are you sure you want to delete this quote submission?')) {
                                                                    deleteSubmission(submission.id);
                                                                }
                                                            }}
                                                            className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                                                            title="Delete submission"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={11} className="px-6 py-8 text-center text-sm text-gray-500">
                                            No quote form submissions found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.total > 0 && (
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-600">
                            <div>
                                Showing {pagination.from} to {pagination.to} of {pagination.total} submissions
                            </div>
                            <div className="flex gap-2">
                                {pagination.current_page > 1 && (
                                    <button
                                        onClick={() => fetchQuoteSubmissions(pagination.current_page - 1, statusFilter || undefined, searchTerm || undefined)}
                                        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                                    >
                                        Previous
                                    </button>
                                )}
                                {pagination.current_page < pagination.last_page && (
                                    <button
                                        onClick={() => fetchQuoteSubmissions(pagination.current_page + 1, statusFilter || undefined, searchTerm || undefined)}
                                        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Details Modal */}
            {showDetailsModal && selectedSubmission && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDetailsModal(false)}></div>
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto relative z-10">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Quote Form Submission Details</h2>
                            <button
                                onClick={() => {
                                    setShowDetailsModal(false);
                                    setSelectedSubmission(null);
                                }}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {loadingDetails ? (
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                                    <p className="mt-4 text-gray-600">Loading details...</p>
                                </div>
                            ) : (
                                <>
                                    {/* Primary Contact Information */}
                                    <div className="border-b border-gray-200 pb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">1. Primary Contact Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Full Name</label>
                                                <p className="text-gray-900">{selectedSubmission.full_name}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Job Title</label>
                                                <p className="text-gray-900">{selectedSubmission.job_title || "-"}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Company Name</label>
                                                <p className="text-gray-900">{selectedSubmission.company_name || "-"}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Email</label>
                                                <p className="text-gray-900">{selectedSubmission.email}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Phone</label>
                                                <p className="text-gray-900">{selectedSubmission.phone || "-"}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Preferred Contact Method</label>
                                                <p className="text-gray-900">{selectedSubmission.preferred_contact_method || "-"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Business Information */}
                                    <div className="border-b border-gray-200 pb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">2. Business Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Industry Sector</label>
                                                <p className="text-gray-900">
                                                    {selectedSubmission.industry_sector && selectedSubmission.industry_sector.trim() 
                                                        ? selectedSubmission.industry_sector 
                                                        : "-"}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Company Size</label>
                                                <p className="text-gray-900">
                                                    {selectedSubmission.company_size && selectedSubmission.company_size.trim() 
                                                        ? selectedSubmission.company_size 
                                                        : "-"}
                                                </p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="text-sm font-medium text-gray-500">Street Address</label>
                                                <p className="text-gray-900">
                                                    {selectedSubmission.street_address && selectedSubmission.street_address.trim() 
                                                        ? selectedSubmission.street_address 
                                                        : "-"}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">City</label>
                                                <p className="text-gray-900">
                                                    {selectedSubmission.city && selectedSubmission.city.trim() 
                                                        ? selectedSubmission.city 
                                                        : "-"}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">State/Province</label>
                                                <p className="text-gray-900">
                                                    {selectedSubmission.state_province && selectedSubmission.state_province.trim() 
                                                        ? selectedSubmission.state_province 
                                                        : "-"}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Postal Code</label>
                                                <p className="text-gray-900">
                                                    {selectedSubmission.postal_code && selectedSubmission.postal_code.trim() 
                                                        ? selectedSubmission.postal_code 
                                                        : "-"}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Country</label>
                                                <p className="text-gray-900">
                                                    {selectedSubmission.country && selectedSubmission.country.trim() 
                                                        ? selectedSubmission.country 
                                                        : "-"}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Business Website</label>
                                                <p className="text-gray-900">
                                                    {selectedSubmission.business_website && selectedSubmission.business_website.trim() ? (
                                                        <a href={selectedSubmission.business_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                            {selectedSubmission.business_website}
                                                        </a>
                                                    ) : "-"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Services Required */}
                                    <div className="border-b border-gray-200 pb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">3. Services Required</h3>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Services</label>
                                            <p className="text-gray-900">
                                                {parseJsonField(selectedSubmission.services_required).length > 0
                                                    ? parseJsonField(selectedSubmission.services_required).join(", ")
                                                    : "-"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Technology Stack */}
                                    <div className="border-b border-gray-200 pb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">4. Technology Stack</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Frontend Technologies</label>
                                                <p className="text-gray-900">
                                                    {parseJsonField(selectedSubmission.frontend_technologies).length > 0
                                                        ? parseJsonField(selectedSubmission.frontend_technologies).join(", ")
                                                        : "-"}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Backend Technologies</label>
                                                <p className="text-gray-900">
                                                    {parseJsonField(selectedSubmission.backend_technologies).length > 0
                                                        ? parseJsonField(selectedSubmission.backend_technologies).join(", ")
                                                        : "-"}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Database Preference</label>
                                                <p className="text-gray-900">{selectedSubmission.database_preference || "-"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Domain & Hosting */}
                                    <div className="border-b border-gray-200 pb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">5. Domain & Hosting</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Domain Name Ownership</label>
                                                <p className="text-gray-900">{selectedSubmission.domain_name_ownership || "-"}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Hosting Services Availability</label>
                                                <p className="text-gray-900">{selectedSubmission.hosting_services_availability || "-"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Product Interest */}
                                    <div className="border-b border-gray-200 pb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">6. Product Interest</h3>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Ready-Made Product Interest</label>
                                            <p className="text-gray-900">{selectedSubmission.ready_made_product_interest || "-"}</p>
                                        </div>
                                    </div>

                                    {/* Custom Development */}
                                    <div className="border-b border-gray-200 pb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">7. Custom Development</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Custom Development Requirement</label>
                                                <p className="text-gray-900">{selectedSubmission.custom_development_requirement || "-"}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Project Type</label>
                                                <p className="text-gray-900">{selectedSubmission.project_type || "-"}</p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="text-sm font-medium text-gray-500">Brief Project Description</label>
                                                <p className="text-gray-900 whitespace-pre-wrap">{selectedSubmission.brief_project_description || "-"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Project Scope */}
                                    <div className="border-b border-gray-200 pb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">8. Project Scope</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Primary Objective</label>
                                                <p className="text-gray-900">{selectedSubmission.primary_objective || "-"}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Estimated Timeline</label>
                                                <p className="text-gray-900">{selectedSubmission.estimated_timeline || "-"}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Estimated Budget Range</label>
                                                <p className="text-gray-900">{selectedSubmission.estimated_budget_range || "-"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Technical Requirements */}
                                    <div className="border-b border-gray-200 pb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">9. Technical Requirements</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Required Integrations</label>
                                                <p className="text-gray-900 whitespace-pre-wrap">{selectedSubmission.required_integrations || "-"}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Security/Compliance Requirements</label>
                                                <p className="text-gray-900">
                                                    {parseJsonField(selectedSubmission.security_compliance_requirements).length > 0
                                                        ? parseJsonField(selectedSubmission.security_compliance_requirements).join(", ")
                                                        : "-"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Post-Launch */}
                                    <div className="border-b border-gray-200 pb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">10. Post-Launch & Partnership</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Ongoing Maintenance Support</label>
                                                <p className="text-gray-900">{selectedSubmission.ongoing_maintenance_support || "-"}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Long-Term Partnership</label>
                                                <p className="text-gray-900">{selectedSubmission.long_term_partnership || "-"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Information */}
                                    <div className="border-b border-gray-200 pb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">11. Additional Information</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">How Did You Hear About Us</label>
                                                <p className="text-gray-900">{selectedSubmission.how_did_you_hear || "-"}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Additional Message</label>
                                                <p className="text-gray-900 whitespace-pre-wrap">{selectedSubmission.message || "-"}</p>
                                            </div>
                                            {selectedSubmission.uploaded_files && parseJsonField(selectedSubmission.uploaded_files).length > 0 && (
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Uploaded Files</label>
                                                    <div className="mt-2 space-y-1">
                                                        {parseJsonField(selectedSubmission.uploaded_files).map((file, index) => (
                                                            <a
                                                                key={index}
                                                                href={`http://localhost:8000/storage/${file}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="block text-blue-600 hover:underline"
                                                            >
                                                                {file.split('/').pop()}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Submission Info */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Submitted At</label>
                                                <p className="text-gray-900">
                                                    {selectedSubmission.created_at
                                                        ? new Date(selectedSubmission.created_at).toLocaleString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })
                                                        : "-"}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Status</label>
                                                <p className="text-gray-900">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        selectedSubmission.is_read
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {selectedSubmission.is_read ? 'Read' : 'Unread'}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowDetailsModal(false);
                                    setSelectedSubmission(null);
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
