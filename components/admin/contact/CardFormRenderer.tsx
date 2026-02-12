import React from 'react';
import { ContactPageCard } from './useContactPageCards';

interface CardFormRendererProps {
    cardType: ContactPageCard['card_type'];
    card: ContactPageCard | null;
    cardData: {
        badge_title: string;
        secondary_badge?: string;
        label: string;
        phone_number_1?: string;
        phone_number_2?: string;
        fax_number?: string;
        email_address?: string;
        street_address?: string;
        state_postal_code?: string;
        country?: string;
        monday_friday_hours?: string;
        saturday_hours?: string;
        sunday_hours?: string;
        iconFile: File | null;
    };
    onInputChange: (cardType: string, field: string, value: string) => void;
    onFileChange: (cardType: string, file: File | null) => void;
    onSave: (cardType: ContactPageCard['card_type']) => void;
    onDelete: (cardType: ContactPageCard['card_type']) => void;
    onOpenTeam?: () => void;
    saving: boolean;
    success: string;
    error: string;
    getImageUrl: (iconPath: string | null | undefined) => string | null;
}

const cardTypeLabels: Partial<Record<ContactPageCard['card_type'], string>> = {
    call: 'Call Card',
    fax: 'Fax Card',
    email: 'Email Card',
    visit: 'Visit Card',
};

export default function CardFormRenderer({
    cardType,
    card,
    cardData,
    onInputChange,
    onFileChange,
    onSave,
    onDelete,
    onOpenTeam,
    saving,
    success,
    error,
    getImageUrl,
}: CardFormRendererProps) {
    const data = cardData || {
        badge_title: '',
        label: '',
        iconFile: null,
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-300">
                <h4 className="font-semibold text-gray-800">{cardTypeLabels[cardType] ?? cardType}</h4>
                {card && (
                    <button
                        onClick={() => onDelete(cardType)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                        Delete
                    </button>
                )}
            </div>

            {success && (
                <div className="mb-3 p-2 bg-green-100 border border-green-400 text-green-700 rounded text-xs">
                    {success}
                </div>
            )}

            {error && (
                <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-xs">
                    <div className="font-semibold mb-1">Error:</div>
                    <div className="whitespace-pre-wrap break-words">{error}</div>
                </div>
            )}

            <div className="space-y-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Badge / Title</label>
                    <input
                        type="text"
                        value={data.badge_title || ''}
                        onChange={(e) => onInputChange(cardType, 'badge_title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                    />
                </div>

                {cardType === 'email' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Badge</label>
                        <input
                            type="text"
                            value={data.secondary_badge || ''}
                            onChange={(e) => onInputChange(cardType, 'secondary_badge', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                    <input
                        type="text"
                        value={data.label || ''}
                        onChange={(e) => onInputChange(cardType, 'label', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                    />
                </div>

                {/* Call Card Fields */}
                {cardType === 'call' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number 1</label>
                            <input
                                type="text"
                                value={data.phone_number_1 || ''}
                                onChange={(e) => onInputChange(cardType, 'phone_number_1', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number 2</label>
                            <input
                                type="text"
                                value={data.phone_number_2 || ''}
                                onChange={(e) => onInputChange(cardType, 'phone_number_2', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                            />
                        </div>
                    </>
                )}

                {/* Fax Card Fields */}
                {cardType === 'fax' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fax Number</label>
                        <input
                            type="text"
                            value={data.fax_number || ''}
                            onChange={(e) => onInputChange(cardType, 'fax_number', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                        />
                    </div>
                )}

                {/* Email Card Fields */}
                {cardType === 'email' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={data.email_address || ''}
                                onChange={(e) => onInputChange(cardType, 'email_address', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                            />
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={onOpenTeam}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                Manage Team
                            </button>
                        </div>
                    </>
                )}

                {/* Visit Card Fields */}
                {cardType === 'visit' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                            <input
                                type="text"
                                value={data.street_address || ''}
                                onChange={(e) => onInputChange(cardType, 'street_address', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State & Postal Code</label>
                            <input
                                type="text"
                                value={data.state_postal_code || ''}
                                onChange={(e) => onInputChange(cardType, 'state_postal_code', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                            <input
                                type="text"
                                value={data.country || ''}
                                onChange={(e) => onInputChange(cardType, 'country', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm"
                            />
                        </div>
                    </>
                )}

                {/* Icon Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onFileChange(cardType, e.target.files?.[0] || null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 bg-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                    />
                    {data.iconFile && (
                        <p className="text-xs text-gray-600 mt-1">Selected: {data.iconFile.name}</p>
                    )}
                    {card?.icon && !data.iconFile && (
                        <div className="mt-2">
                            <img
                                src={getImageUrl(card.icon) || ''}
                                alt="Current icon"
                                className="h-12 w-12 object-contain"
                            />
                            <p className="text-xs text-gray-600 mt-1">Current icon</p>
                        </div>
                    )}
                </div>

                {/* Save Button */}
                <button
                    onClick={() => onSave(cardType)}
                    disabled={saving}
                    className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-pink-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                    {saving ? 'Saving...' : card ? 'Update Card' : 'Create Card'}
                </button>
            </div>
        </div>
    );
}

