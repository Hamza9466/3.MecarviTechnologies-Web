"use client";

import React, { useState, useEffect } from 'react';

interface Feature {
  title: string;
  description: string;
}

interface ChartSectionData {
  id?: number;
  section_title: string;
  subtitle: string;
  title: string;
  description: string;
  features: Feature[];
  button_text?: string;
  button_url?: string;
  main_image?: string;
  small_image?: string;
  main_image_file?: File;
  small_image_file?: File;
  created_at?: string;
  updated_at?: string;
}

interface ChartSectionEditorProps {
  data: ChartSectionData[];
  onChange: (data: ChartSectionData[]) => void;
}

export default function ChartSectionEditor({ data, onChange }: ChartSectionEditorProps) {
  const [currentSection, setCurrentSection] = useState<ChartSectionData>({
    section_title: '',
    subtitle: '',
    title: '',
    description: '',
    features: [],
    main_image: '',
    small_image: ''
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    console.log('ChartSectionEditor - data changed:', data);
    console.log('ChartSectionEditor - editingIndex:', editingIndex);

    if (data.length > 0 && editingIndex === null) {
      console.log('Setting first section as current');
      setCurrentSection(data[0]);
      setEditingIndex(0);
    } else if (data.length === 0 && editingIndex === null) {
      // Initialize with empty section when no data exists
      console.log('Initializing with empty section');
      setCurrentSection({
        section_title: '',
        subtitle: '',
        title: '',
        description: '',
        features: [],
        main_image: '',
        small_image: ''
      });
      setEditingIndex(0);
    } else if (data.length > 0 && editingIndex !== null && editingIndex < data.length) {
      // Update current section when data changes
      console.log('Updating current section with new data');
      setCurrentSection(data[editingIndex]);
    }
  }, [data, editingIndex]);

  const handleFieldChange = (field: keyof ChartSectionData, value: string | Feature[] | File) => {
    const updated = { ...currentSection, [field]: value };
    setCurrentSection(updated);

    // Always call onChange to keep parent in sync, even for new sections
    if (editingIndex !== null) {
      if (data.length === 0) {
        // For new sections, create array with current section
        onChange([updated]);
      } else {
        // For existing sections, update the specific section
        const newData = [...data];
        newData[editingIndex] = updated;
        onChange(newData);
      }
    }
  };

  const handleFileChange = (field: 'main_image_file' | 'small_image_file', file: File) => {
    handleFieldChange(field, file);
  };

  const handleFeatureChange = (index: number, field: keyof Feature, value: string) => {
    const currentFeatures = currentSection.features || [];
    const updatedFeatures = [...currentFeatures];
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
    handleFieldChange('features', updatedFeatures);
  };

  const addFeature = () => {
    const currentFeatures = currentSection.features || [];
    handleFieldChange('features', [...currentFeatures, { title: '', description: '' }]);
  };

  const removeFeature = (index: number) => {
    const currentFeatures = currentSection.features || [];
    const updated = currentFeatures.filter((_, i) => i !== index);
    handleFieldChange('features', updated);
  };

  const addNewSection = () => {
    const newSection: ChartSectionData = {
      section_title: '',
      subtitle: '',
      title: '',
      description: '',
      features: [],
      button_text: '',
      button_url: '',
      main_image: '',
      small_image: ''
    };
    onChange([...data, newSection]);
    setCurrentSection(newSection);
    setEditingIndex(data.length);
  };

  const selectSection = (index: number) => {
    setCurrentSection(data[index]);
    setEditingIndex(index);
  };

  const deleteSection = async (index: number) => {
    const sectionToDelete = data[index];

    if (sectionToDelete.id) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8000/api/v1/chart-sections/${sectionToDelete.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const newData = data.filter((_, i) => i !== index);
          onChange(newData);
          if (editingIndex === index) {
            setCurrentSection(newData[0] || {
              section_title: '',
              subtitle: '',
              title: '',
              description: '',
              features: [],
              button_text: '',
              button_url: '',
              main_image: '',
              small_image: ''
            });
            setEditingIndex(newData.length > 0 ? 0 : null);
          }
          alert('Chart section deleted successfully!');
        } else {
          alert('Failed to delete chart section');
        }
      } catch (error) {
        console.error('Error deleting chart section:', error);
        alert('Error deleting chart section');
      }
    } else {
      // Local section, just remove from state
      const newData = data.filter((_, i) => i !== index);
      onChange(newData);
      if (editingIndex === index) {
        setCurrentSection(newData[0] || {
          section_title: '',
          subtitle: '',
          title: '',
          description: '',
          features: [],
          button_text: '',
          button_url: '',
          main_image: '',
          small_image: ''
        });
        setEditingIndex(newData.length > 0 ? 0 : null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {data.length === 0 ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Create New Chart Section
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
              placeholder="Performance Charts"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
            <input
              type="text"
              value={currentSection.subtitle}
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
              value={currentSection.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder="Track your progress with detailed analytics"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={currentSection.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder="Monitor key performance indicators and gain valuable insights..."
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
            {(currentSection.features || []).map((feature, index) => (
              <div key={index} className="space-y-2 mb-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">Feature {index + 1}</h4>
                  <button
                    onClick={() => removeFeature(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Feature Title</label>
                  <input
                    type="text"
                    value={feature.title || ''}
                    onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Feature title"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Feature Description</label>
                  <textarea
                    value={feature.description || ''}
                    onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Feature description"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addFeature}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Add Feature
            </button>
          </div>

          {/* Button */}
          {/* Main Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileChange('main_image_file', file);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-gray-700 file:text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold"
            />
            {currentSection.main_image_file && (
              <div className="mt-2">
                <p className="text-xs text-green-600">New file: {currentSection.main_image_file.name}</p>
              </div>
            )}
          </div>

          {/* Small Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Small Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileChange('small_image_file', file);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-gray-700 file:text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold"
            />
            {currentSection.small_image_file && (
              <div className="mt-2">
                <p className="text-xs text-green-600">New file: {currentSection.small_image_file.name}</p>
              </div>
            )}
          </div>
        </>
      ) : currentSection ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Chart Section {editingIndex !== null ? editingIndex + 1 : ''}
            </h2>
            {editingIndex !== null && data.length > 1 && (
              <button
                onClick={() => deleteSection(editingIndex)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Delete Section
              </button>
            )}
          </div>

          {/* Section Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
            <input
              type="text"
              value={currentSection.section_title}
              onChange={(e) => handleFieldChange('section_title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder="Performance Charts"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
            <input
              type="text"
              value={currentSection.subtitle}
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
              value={currentSection.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder="Track your progress with detailed analytics"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={currentSection.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder="Monitor key performance indicators and gain valuable insights..."
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
            {(currentSection.features || []).map((feature, index) => (
              <div key={index} className="space-y-2 mb-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">Feature {index + 1}</h4>
                  <button
                    onClick={() => removeFeature(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Feature Title</label>
                  <input
                    type="text"
                    value={feature.title || ''}
                    onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Feature title"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Feature Description</label>
                  <textarea
                    value={feature.description || ''}
                    onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Feature description"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addFeature}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Add Feature
            </button>
          </div>

          {/* Button */}
          {/* Main Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileChange('main_image_file', file);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-gray-700 file:text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold"
            />
            {currentSection.main_image && (
              <div className="mt-2">
                <p className="text-xs text-gray-600">Current: {currentSection.main_image}</p>
                <img
                  src={currentSection.main_image.startsWith('http') ? currentSection.main_image : `http://localhost:8000${currentSection.main_image}`}
                  alt="Current main image"
                  className="mt-2 h-20 w-20 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/images/placeholder.png';
                  }}
                />
              </div>
            )}
            {currentSection.main_image_file && (
              <div className="mt-2">
                <p className="text-xs text-green-600">New file: {currentSection.main_image_file.name}</p>
              </div>
            )}
          </div>

          {/* Small Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Small Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileChange('small_image_file', file);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-gray-700 file:text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold"
            />
            {currentSection.small_image && (
              <div className="mt-2">
                <p className="text-xs text-gray-600">Current: {currentSection.small_image}</p>
                <img
                  src={currentSection.small_image.startsWith('http') ? currentSection.small_image : `http://localhost:8000${currentSection.small_image}`}
                  alt="Current small image"
                  className="mt-2 h-20 w-20 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/images/placeholder.png';
                  }}
                />
              </div>
            )}
            {currentSection.small_image_file && (
              <div className="mt-2">
                <p className="text-xs text-green-600">New file: {currentSection.small_image_file.name}</p>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
