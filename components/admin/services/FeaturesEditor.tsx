"use client";

import React from 'react';

interface FeaturesData {
  sectionTitle: string;
  subtitle: string;
  title: string;
  description: string;
  features: string[];
  buttonText: string;
  mainImage: string;
  smallImage: string;
}

interface FeaturesEditorProps {
  data: FeaturesData;
  onChange: (data: FeaturesData) => void;
}

export default function FeaturesEditor({ data, onChange }: FeaturesEditorProps) {
  const handleFieldChange = (field: keyof FeaturesData, value: string | string[]) => {
    onChange({ ...data, [field]: value });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updated = [...data.features];
    updated[index] = value;
    handleFieldChange('features', updated);
  };

  const addFeature = () => {
    handleFieldChange('features', [...data.features, '']);
  };

  const removeFeature = (index: number) => {
    const updated = data.features.filter((_, i) => i !== index);
    handleFieldChange('features', updated);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Features Section</h2>

      {/* Section Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
        <input
          type="text"
          value={data.sectionTitle}
          onChange={(e) => handleFieldChange('sectionTitle', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
          placeholder="Business analytics"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
        <input
          type="text"
          value={data.subtitle}
          onChange={(e) => handleFieldChange('subtitle', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
        {data.features.map((feature, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={feature}
              onChange={(e) => handleFeatureChange(index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            />
            <button
              onClick={() => removeFeature(index)}
              className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addFeature}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Add Feature
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
        <input
          type="text"
          value={data.buttonText}
          onChange={(e) => handleFieldChange('buttonText', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
        <input
          type="text"
          value={data.mainImage}
          onChange={(e) => handleFieldChange('mainImage', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Small Image</label>
        <input
          type="text"
          value={data.smallImage}
          onChange={(e) => handleFieldChange('smallImage', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
    </div>
  );
}
