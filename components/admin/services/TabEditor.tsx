"use client";

import React, { useState } from 'react';

interface TabItem {
  title: string;
  icon: string;
  content: string;
  image?: string;
  features?: (string | { heading: string; text: string })[];
}

interface TabData {
  sectionTitle: string;
  sectionDescription: string;
  tabs: TabItem[];
}

interface TabEditorProps {
  data: TabData;
  onChange: (data: TabData) => void;
}

export default function TabEditor({ data, onChange }: TabEditorProps) {
  const handleFieldChange = (field: keyof TabData, value: string | TabItem[]) => {
    onChange({ ...data, [field]: value });
  };

  const handleTabChange = (index: number, field: keyof TabItem, value: string | string[]) => {
    const updatedTabs = [...data.tabs];
    updatedTabs[index] = { ...updatedTabs[index], [field]: value };
    handleFieldChange('tabs', updatedTabs);
  };

  const addTab = () => {
    const newTab: TabItem = {
      title: '',
      icon: 'settings',
      content: '',
      image: '',
      features: []
    };
    handleFieldChange('tabs', [...data.tabs, newTab]);
  };

  const removeTab = (index: number) => {
    const updatedTabs = data.tabs.filter((_, i) => i !== index);
    handleFieldChange('tabs', updatedTabs);
  };

  const addFeature = (tabIndex: number) => {
    const updatedTabs = [...data.tabs];
    const features = updatedTabs[tabIndex].features || [];
    updatedTabs[tabIndex] = { ...updatedTabs[tabIndex], features: [...features, ''] };
    handleFieldChange('tabs', updatedTabs);
  };

  const removeFeature = (tabIndex: number, featureIndex: number) => {
    const updatedTabs = [...data.tabs];
    const features = updatedTabs[tabIndex].features || [];
    updatedTabs[tabIndex] = {
      ...updatedTabs[tabIndex],
      features: features.filter((_, i) => i !== featureIndex)
    };
    handleFieldChange('tabs', updatedTabs);
  };

  const updateFeature = (tabIndex: number, featureIndex: number, value: string | { heading: string; text: string }) => {
    const updatedTabs = [...data.tabs];
    const features = updatedTabs[tabIndex].features || [];
    features[featureIndex] = value;
    updatedTabs[tabIndex] = { ...updatedTabs[tabIndex], features };
    handleFieldChange('tabs', updatedTabs);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tab Section Content</h3>

      {/* Section Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
        <input
          type="text"
          value={data.sectionTitle}
          onChange={(e) => handleFieldChange('sectionTitle', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
          placeholder="We Provide Expert Service"
        />
      </div>

      {/* Section Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Description</label>
        <textarea
          value={data.sectionDescription}
          onChange={(e) => handleFieldChange('sectionDescription', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
          placeholder="We aim to earn your trust and have a long term relationship with you..."
        />
      </div>

      {/* Tabs */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">Tabs</label>
          <button
            onClick={addTab}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Add Tab
          </button>
        </div>

        {data.tabs.map((tab, tabIndex) => (
          <div key={tabIndex} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-900">Tab {tabIndex + 1}</h4>
              <button
                onClick={() => removeTab(tabIndex)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove Tab
              </button>
            </div>

            {/* Tab Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tab Title</label>
              <input
                type="text"
                value={tab.title}
                onChange={(e) => handleTabChange(tabIndex, 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                placeholder="Tab Title"
              />
            </div>

            {/* Tab Icon */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tab Icon</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      handleTabChange(tabIndex, 'icon', reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
              {tab.icon && (
                <div className="mt-2">
                  <img
                    src={tab.icon}
                    alt="Tab icon"
                    className="w-12 h-12 object-cover rounded"
                  />
                </div>
              )}
            </div>

            {/* Tab Content - Not for Tab 3 */}
            {tabIndex !== 2 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tab Content</label>
                <textarea
                  value={tab.content}
                  onChange={(e) => handleTabChange(tabIndex, 'content', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Tab content description..."
                />
              </div>
            )}

            {/* Tab Image - Only for Tab 1 */}
            {tabIndex === 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tab Image (optional)</label>
                <input
                  type="text"
                  value={tab.image || ''}
                  onChange={(e) => handleTabChange(tabIndex, 'image', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  placeholder="/assets/images/tab-image.png"
                />
              </div>
            )}

            {/* Tab Features */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  {tabIndex === 2 ? "Features (with heading and text)" : "Features (optional)"}
                </label>
                <button
                  onClick={() => addFeature(tabIndex)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Add Feature
                </button>
              </div>

              {(tab.features || []).map((feature, featureIndex) => (
                <div key={featureIndex} className="space-y-2 mb-4 p-4 border border-gray-200 rounded-lg">
                  {tabIndex === 2 ? (
                    // Tab 3: Heading and Text fields
                    <>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={typeof feature === 'object' ? feature.heading : feature}
                          onChange={(e) => {
                            const updatedFeature = typeof feature === 'object'
                              ? { ...feature, heading: e.target.value }
                              : { heading: e.target.value, text: '' };
                            updateFeature(tabIndex, featureIndex, updatedFeature);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Feature heading"
                        />
                        <button
                          onClick={() => removeFeature(tabIndex, featureIndex)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                      <textarea
                        value={typeof feature === 'object' ? feature.text : ''}
                        onChange={(e) => {
                          const updatedFeature = typeof feature === 'object'
                            ? { ...feature, text: e.target.value }
                            : { heading: feature, text: e.target.value };
                          updateFeature(tabIndex, featureIndex, updatedFeature);
                        }}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Feature description"
                      />
                    </>
                  ) : (
                    // Tabs 1 & 2: Simple text fields
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(tabIndex, featureIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Feature description"
                      />
                      <button
                        onClick={() => removeFeature(tabIndex, featureIndex)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
