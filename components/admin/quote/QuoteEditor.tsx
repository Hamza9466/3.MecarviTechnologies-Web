"use client";

import { useState, useEffect } from "react";
import { useQuoteFormSubmissions } from "./useQuoteFormSubmissions";

interface QuoteFormSubmissionDetail {
    id: number;
    first_name: string;
    last_name: string;
    phone: string | null;
    email: string;
    company_name: string | null;
    country: string | null;
    project_type: string | null;
    estimate_budget: string | null;
    maximum_time_for_project: string | null;
    required_skills: string | null;
    uploaded_files: string | null;
    message: string | null;
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

    // Helper function to parse JSON strings or file paths
    const parseJsonField = (field: string | null): string[] => {
        if (!field) return [];
        try {
            const parsed = JSON.parse(field);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            // If not JSON, treat as single string
            return field ? [field] : [];
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
                                        <td colSpan={10} className="px-6 py-8 text-center text-sm text-gray-500">
                                            Loading quote submissions...
                                        </td>
                                    </tr>
                                ) : quoteSubmissions && quoteSubmissions.length > 0 ? (
                                    quoteSubmissions.map((submission) => {
                                        const fullName = `${submission.first_name} ${submission.last_name}`.trim();
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
                                                    <div className="font-medium">{fullName || <span className="text-gray-400">-</span>}</div>
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
                                                <td className="px-4 py-4 text-sm text-gray-900 max-w-xs border-b border-gray-200">
                                                    {submission.project_type || <span className="text-gray-400">-</span>}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
                                                    {submission.estimate_budget || <span className="text-gray-400">-</span>}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
                                                    {submission.maximum_time_for_project || <span className="text-gray-400">-</span>}
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
                                                    <div className="flex flex-col gap-1">
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
                                        <td colSpan={10} className="px-6 py-8 text-center text-sm text-gray-500">
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
                                    {/* Contact Information */}
                                    <div className="border-b border-gray-200 pb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">First Name</label>
                                                <p className="text-gray-900">{selectedSubmission.first_name || "-"}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Last Name</label>
                                                <p className="text-gray-900">{selectedSubmission.last_name || "-"}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Email</label>
                                                <p className="text-gray-900">
                                                    <a href={`mailto:${selectedSubmission.email}`} className="text-blue-600 hover:underline">
                                                        {selectedSubmission.email}
                                                    </a>
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Phone</label>
                                                <p className="text-gray-900">
                                                    {selectedSubmission.phone ? (
                                                        <a href={`tel:${selectedSubmission.phone}`} className="text-blue-600 hover:underline">
                                                            {selectedSubmission.phone}
                                                        </a>
                                                    ) : "-"}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Company Name</label>
                                                <p className="text-gray-900">{selectedSubmission.company_name || "-"}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Country</label>
                                                <p className="text-gray-900">{selectedSubmission.country || "-"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Project Information */}
                                    <div className="border-b border-gray-200 pb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Project Type</label>
                                                <p className="text-gray-900">{selectedSubmission.project_type || "-"}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Estimate Budget</label>
                                                <p className="text-gray-900">{selectedSubmission.estimate_budget || "-"}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Maximum Time for Project</label>
                                                <p className="text-gray-900">{selectedSubmission.maximum_time_for_project || "-"}</p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="text-sm font-medium text-gray-500">Required Skills</label>
                                                <p className="text-gray-900 whitespace-pre-wrap">{selectedSubmission.required_skills || "-"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    {selectedSubmission.message && (
                                        <div className="border-b border-gray-200 pb-4">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Message</h3>
                                            <div>
                                                <p className="text-gray-900 whitespace-pre-wrap">{selectedSubmission.message}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Uploaded Files */}
                                    {selectedSubmission.uploaded_files && parseJsonField(selectedSubmission.uploaded_files).length > 0 && (
                                        <div className="border-b border-gray-200 pb-4">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Files</h3>
                                            <div className="space-y-2">
                                                {parseJsonField(selectedSubmission.uploaded_files).map((file, index) => {
                                                    const filePath = file.startsWith('http') ? file : `http://localhost:8000/storage/${file}`;
                                                    const fileName = file.includes('/') ? file.split('/').pop() : file;
                                                    return (
                                                        <a
                                                            key={index}
                                                            href={filePath}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="block text-blue-600 hover:underline"
                                                        >
                                                            {fileName}
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

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
