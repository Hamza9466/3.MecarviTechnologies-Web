import QuoteEditor from "@/components/admin/quote/QuoteEditor";

export default function QuotePage() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Quote Management</h1>
                <p className="text-gray-600 mt-2">Manage quote requests and settings</p>
            </div>
            <QuoteEditor />
        </div>
    );
}
