"use client";

import React, { useState } from 'react';

interface ChartData {
  sectionTitle: string;
  subtitle: string;
  title: string;
  description: string;
  features: string[];
  mainImage: string;
  smallImage: string;
}

interface ChartEditorProps {
  data: ChartData;
  onChange: (data: ChartData) => void;
}

export default function ChartEditor({ data, onChange }: ChartEditorProps) {
  const handleFieldChange = (field: keyof ChartData, value: string | string[]) => {
    onChange({ ...data, [field]: value });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...data.features];
    updatedFeatures[index] = value;
    handleFieldChange('features', updatedFeatures);
  };

  const addFeature = () => {
    handleFieldChange('features', [...data.features, '']);
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = data.features.filter((_, i) => i !== index);
    handleFieldChange('features', updatedFeatures);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Chart Section Content</h3>

      {/* Section Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
        <input
          type="text"
          value={data.sectionTitle}
          onChange={(e) => handleFieldChange('sectionTitle', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
          placeholder="Performance Charts"
        />
      </div>

      {/* Subtitle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
        <input
          type="text"
          value={data.subtitle}
          onChange={(e) => handleFieldChange('subtitle', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
          placeholder="Performance metrics"
        />
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
          placeholder="Track your progress with detailed analytics"
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
          placeholder="Monitor key performance indicators..."
        />
      </div>

      {/* Features */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
        {data.features.map((feature, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={feature}
              onChange={(e) => handleFeatureChange(index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder="Feature description"
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

      {/* Images */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
          <input
            type="text"
            value={data.mainImage}
            onChange={(e) => handleFieldChange('mainImage', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            placeholder="/assets/images/Chart.png"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Small Image</label>
          <input
            type="text"
            value={data.smallImage}
            onChange={(e) => handleFieldChange('smallImage', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            placeholder="/assets/images/12.png"
          />
        </div>
      </div>
    </div>
  );
}
