"use client";

import React, { useState, useEffect } from 'react';

interface TabItem {
  id?: number;
  tab_title: string;
  tab_icon?: string;
  tab_icon_file?: File;
  tab_content?: string;
  tab_image?: string;
  tab_image_file?: File;
  features: string[] | { title: string; description: string }[];
  order: number;
}

interface TabSectionData {
  id?: number;
  section_title: string;
  section_description: string;
  tabs: TabItem[];
  created_at?: string;
  updated_at?: string;
}

interface TabSectionEditorProps {
  data: TabSectionData[];
  onChange: (data: TabSectionData[]) => void;
}

export default function TabSectionEditor({ data, onChange }: TabSectionEditorProps) {
  const [currentSection, setCurrentSection] = useState<TabSectionData>({
    section_title: '',
    section_description: '',
    tabs: [
      {
        tab_title: 'Additional Services',
        tab_content: '',
        features: [],
        order: 0
      },
      {
        tab_title: 'Our Advantages',
        tab_content: '',
        features: [],
        order: 1
      },
      {
        tab_title: 'About Company',
        features: [],
        order: 2
      }
    ]
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (data.length > 0 && editingIndex === null) {
      setCurrentSection(data[0]);
      setEditingIndex(0);
    } else if (data.length === 0 && editingIndex === null) {
      // Initialize with empty section when no data exists
      setCurrentSection({
        section_title: '',
        section_description: '',
        tabs: [
          {
            tab_title: 'Additional Services',
            tab_content: '',
            features: [],
            order: 0
          },
          {
            tab_title: 'Our Advantages',
            tab_content: '',
            features: [],
            order: 1
          },
          {
            tab_title: 'About Company',
            features: [],
            order: 2
          }
        ]
      });
      setEditingIndex(0);
    }
  }, [data, editingIndex]);

  const handleFieldChange = (field: keyof TabSectionData, value: string | TabItem[]) => {
    const updated = { ...currentSection, [field]: value };
    console.log('TabSectionEditor - handleFieldChange:', {
      field,
      value,
      updatedSection: updated,
      editingIndex,
      dataLength: data.length
    });
    setCurrentSection(updated);

    // Always call onChange to keep parent in sync, even for new sections
    if (editingIndex !== null) {
      if (data.length === 0) {
        // For new sections, create array with current section
        console.log('TabSectionEditor - Creating new array with section:', updated);
        onChange([updated]);
      } else {
        // For existing sections, update the specific section
        const newData = [...data];
        newData[editingIndex] = updated;
        console.log('TabSectionEditor - Updating existing section at index', editingIndex, ':', updated);
        onChange(newData);
      }
    }
  };

  const handleTabChange = (tabIndex: number, field: keyof TabItem, value: any) => {
    const updatedTabs = [...currentSection.tabs];
    updatedTabs[tabIndex] = { ...updatedTabs[tabIndex], [field]: value };
    handleFieldChange('tabs', updatedTabs);
  };

  const handleFileChange = (tabIndex: number, field: 'tab_icon_file' | 'tab_image_file', file: File) => {
    console.log('TabSectionEditor - handleFileChange:', {
      tabIndex,
      field,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });
    const updatedTabs = [...currentSection.tabs];
    updatedTabs[tabIndex] = { ...updatedTabs[tabIndex], [field]: file };
    handleFieldChange('tabs', updatedTabs);
  };

  const addFeature = (tabIndex: number) => {
    const updatedTabs = [...currentSection.tabs];
    const features = updatedTabs[tabIndex].features || [];

    if (tabIndex === 2) {
      // Tab 3: Add feature with title and description
      updatedTabs[tabIndex] = {
        ...updatedTabs[tabIndex],
        features: ([...features, { title: '', description: '' }] as { title: string; description: string }[])
      };
    } else {
      // Tabs 1 & 2: Add simple string feature
      updatedTabs[tabIndex] = {
        ...updatedTabs[tabIndex],
        features: ([...features, ''] as string[])
      };
    }
    handleFieldChange('tabs', updatedTabs);
  };

  const removeFeature = (tabIndex: number, featureIndex: number) => {
    const updatedTabs = [...currentSection.tabs];
    const features = updatedTabs[tabIndex].features || [];
    updatedTabs[tabIndex] = {
      ...updatedTabs[tabIndex],
      features: features.filter((_, i) => i !== featureIndex) as string[] | { title: string; description: string }[]
    };
    handleFieldChange('tabs', updatedTabs);
  };

  const updateFeature = (tabIndex: number, featureIndex: number, value: string | { title: string; description: string }) => {
    const updatedTabs = [...currentSection.tabs];
    const features = updatedTabs[tabIndex].features || [];
    features[featureIndex] = value;
    updatedTabs[tabIndex] = { ...updatedTabs[tabIndex], features };
    handleFieldChange('tabs', updatedTabs);
  };

  return (
    <div className="space-y-6">
      {data.length === 0 ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Create New Tab Section
            </h2>
          </div>

          {/* Section Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
            <input
              type="text"
              value={currentSection.section_title}
              onChange={(e) => handleFieldChange('section_title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder="We Provide Expert Service"
            />
          </div>

          {/* Section Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Section Description</label>
            <textarea
              value={currentSection.section_description}
              onChange={(e) => handleFieldChange('section_description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder="We aim to earn your trust and have a long term relationship with you..."
            />
          </div>

          {/* Fixed 3 Tabs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Tabs (Fixed 3 Tabs)</label>
            {currentSection.tabs.map((tab, tabIndex) => (
              <div key={tabIndex} className="border border-gray-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-4">
                  Tab {tabIndex + 1}: {tab.tab_title || `Tab ${tabIndex + 1}`}
                </h4>

                {/* Tab Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tab Title</label>
                  <input
                    type="text"
                    value={tab.tab_title}
                    onChange={(e) => handleTabChange(tabIndex, 'tab_title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    placeholder={tabIndex === 0 ? "Additional Services" : tabIndex === 1 ? "Our Advantages" : "About Company"}
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
                        handleFileChange(tabIndex, 'tab_icon_file', file);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-gray-700 file:text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold"
                  />
                  {tab.tab_icon && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-600">Current: {tab.tab_icon}</p>
                      <img
                        src={tab.tab_icon.startsWith('http') ? tab.tab_icon : `http://localhost:8000${tab.tab_icon}`}
                        alt="Tab icon"
                        className="mt-2 h-12 w-12 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/images/placeholder.png';
                        }}
                      />
                    </div>
                  )}
                  {tab.tab_icon_file && (
                    <div className="mt-2">
                      <p className="text-xs text-green-600">New file: {tab.tab_icon_file.name}</p>
                    </div>
                  )}
                </div>

                {/* Tab Content - Not for Tab 3 */}
                {tabIndex !== 2 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tab Content</label>
                    <textarea
                      value={tab.tab_content || ''}
                      onChange={(e) => handleTabChange(tabIndex, 'tab_content', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Tab content description..."
                    />
                  </div>
                )}

                {/* Tab Image - Only for Tab 1 */}
                {tabIndex === 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tab Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileChange(tabIndex, 'tab_image_file', file);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-gray-700 file:text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold"
                    />
                    {tab.tab_image && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-600">Current: {tab.tab_image}</p>
                        <img
                          src={tab.tab_image.startsWith('http') ? tab.tab_image : `http://localhost:8000${tab.tab_image}`}
                          alt="Tab image"
                          className="mt-2 h-20 w-20 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = '/assets/images/placeholder.png';
                          }}
                        />
                      </div>
                    )}
                    {tab.tab_image_file && (
                      <div className="mt-2">
                        <p className="text-xs text-green-600">New file: {tab.tab_image_file.name}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab Features */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {tabIndex === 2 ? "Features (with heading and text)" : "Features"}
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
                              value={typeof feature === 'object' ? feature.title : feature}
                              onChange={(e) => {
                                const updatedFeature = typeof feature === 'object'
                                  ? { ...feature, title: e.target.value }
                                  : { title: e.target.value, description: '' };
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
                            value={typeof feature === 'object' ? feature.description : ''}
                            onChange={(e) => {
                              const updatedFeature = typeof feature === 'object'
                                ? { ...feature, description: e.target.value }
                                : { title: feature, description: e.target.value };
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
                            value={typeof feature === 'object' ? feature.title : feature}
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
        </>
      ) : currentSection ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Tab Section {editingIndex !== null ? editingIndex + 1 : ''}
            </h2>
          </div>

          {/* Section Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
            <input
              type="text"
              value={currentSection.section_title}
              onChange={(e) => handleFieldChange('section_title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder="We Provide Expert Service"
            />
          </div>

          {/* Section Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Section Description</label>
            <textarea
              value={currentSection.section_description}
              onChange={(e) => handleFieldChange('section_description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder="We aim to earn your trust and have a long term relationship with you..."
            />
          </div>

          {/* Fixed 3 Tabs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Tabs (Fixed 3 Tabs)</label>
            {currentSection.tabs.map((tab, tabIndex) => (
              <div key={tabIndex} className="border border-gray-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-4">
                  Tab {tabIndex + 1}: {tab.tab_title || `Tab ${tabIndex + 1}`}
                </h4>

                {/* Tab Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tab Title</label>
                  <input
                    type="text"
                    value={tab.tab_title}
                    onChange={(e) => handleTabChange(tabIndex, 'tab_title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    placeholder={tabIndex === 0 ? "Additional Services" : tabIndex === 1 ? "Our Advantages" : "About Company"}
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
                        handleFileChange(tabIndex, 'tab_icon_file', file);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-gray-700 file:text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold"
                  />
                  {tab.tab_icon && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-600">Current: {tab.tab_icon}</p>
                      <img
                        src={tab.tab_icon.startsWith('http') ? tab.tab_icon : `http://localhost:8000${tab.tab_icon}`}
                        alt="Tab icon"
                        className="mt-2 h-12 w-12 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/images/placeholder.png';
                        }}
                      />
                    </div>
                  )}
                  {tab.tab_icon_file && (
                    <div className="mt-2">
                      <p className="text-xs text-green-600">New file: {tab.tab_icon_file.name}</p>
                    </div>
                  )}
                </div>

                {/* Tab Content - Not for Tab 3 */}
                {tabIndex !== 2 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tab Content</label>
                    <textarea
                      value={tab.tab_content || ''}
                      onChange={(e) => handleTabChange(tabIndex, 'tab_content', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Tab content description..."
                    />
                  </div>
                )}

                {/* Tab Image - Only for Tab 1 */}
                {tabIndex === 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tab Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileChange(tabIndex, 'tab_image_file', file);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-gray-700 file:text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold"
                    />
                    {tab.tab_image && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-600">Current: {tab.tab_image}</p>
                        <img
                          src={tab.tab_image.startsWith('http') ? tab.tab_image : `http://localhost:8000${tab.tab_image}`}
                          alt="Tab image"
                          className="mt-2 h-20 w-20 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = '/assets/images/placeholder.png';
                          }}
                        />
                      </div>
                    )}
                    {tab.tab_image_file && (
                      <div className="mt-2">
                        <p className="text-xs text-green-600">New file: {tab.tab_image_file.name}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab Features */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {tabIndex === 2 ? "Features (with heading and text)" : "Features"}
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
                              value={typeof feature === 'object' ? feature.title : feature}
                              onChange={(e) => {
                                const updatedFeature = typeof feature === 'object'
                                  ? { ...feature, title: e.target.value }
                                  : { title: e.target.value, description: '' };
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
                            value={typeof feature === 'object' ? feature.description : ''}
                            onChange={(e) => {
                              const updatedFeature = typeof feature === 'object'
                                ? { ...feature, description: e.target.value }
                                : { title: feature, description: e.target.value };
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
                            value={typeof feature === 'object' ? feature.title : feature}
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
        </>
      ) : null}
    </div>
  );
}
