"use client";

import React, { useState } from 'react';

interface ShowcaseCard {
  title: string;
  description: string;
  icon: string;
}

interface ShowcaseData {
  sectionTitle: string;
  badge: string;
  title: string;
  description: string;
  backgroundImage: string;
  mainImage: string;
  backgroundShape: string;
  cards: ShowcaseCard[];
}

interface ShowcaseEditorProps {
  data: ShowcaseData;
  onChange: (data: ShowcaseData) => void;
}

export default function ShowcaseEditor({ data, onChange }: ShowcaseEditorProps) {
  const handleFieldChange = (field: keyof ShowcaseData, value: string | ShowcaseCard[]) => {
    onChange({ ...data, [field]: value });
  };

  const handleCardChange = (index: number, field: keyof ShowcaseCard, value: string) => {
    const updatedCards = [...data.cards];
    updatedCards[index] = { ...updatedCards[index], [field]: value };
    handleFieldChange('cards', updatedCards);
  };

  const addCard = () => {
    const newCard: ShowcaseCard = {
      title: '',
      description: '',
      icon: ''
    };
    handleFieldChange('cards', [...data.cards, newCard]);
  };

  const removeCard = (index: number) => {
    const updatedCards = data.cards.filter((_, i) => i !== index);
    handleFieldChange('cards', updatedCards);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Showcase Section Content</h3>

      {/* Badge */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Badge Text</label>
        <input
          type="text"
          value={data.badge}
          onChange={(e) => handleFieldChange('badge', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
          placeholder="• BOOK APPOINTMENT NOW •"
        />
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Main Title</label>
        <textarea
          value={data.title}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
          placeholder="Book a Time That Works for You Easy, and Hassle-Free!"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
          placeholder="Ready to take your business technology to the next level?"
        />
      </div>

      {/* Background Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
        <input
          type="text"
          value={data.backgroundImage}
          onChange={(e) => handleFieldChange('backgroundImage', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
          placeholder="/assets/images/shape-5.webp"
        />
      </div>

      {/* Main Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
        <input
          type="text"
          value={data.mainImage}
          onChange={(e) => handleFieldChange('mainImage', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
          placeholder="/assets/images/gallery-8.webp"
        />
      </div>

      {/* Background Shape */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Background Shape</label>
        <input
          type="text"
          value={data.backgroundShape}
          onChange={(e) => handleFieldChange('backgroundShape', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
          placeholder="/assets/images/shape-3.webp"
        />
      </div>

      {/* Info Cards */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">Info Cards</label>
          <button
            onClick={addCard}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Add Card
          </button>
        </div>

        {data.cards.map((card, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-900">Card {index + 1}</h4>
              <button
                onClick={() => removeCard(index)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove Card
              </button>
            </div>

            {/* Card Icon */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Icon</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      handleCardChange(index, 'icon', reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
              {card.icon && (
                <div className="mt-2">
                  <img 
                    src={card.icon} 
                    alt="Card icon" 
                    className="w-12 h-12 object-cover rounded"
                  />
                </div>
              )}
            </div>

            {/* Card Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Title</label>
              <input
                type="text"
                value={card.title}
                onChange={(e) => handleCardChange(index, 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                placeholder="Card title"
              />
            </div>

            {/* Card Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Description</label>
              <textarea
                value={card.description}
                onChange={(e) => handleCardChange(index, 'description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                placeholder="Card description"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
