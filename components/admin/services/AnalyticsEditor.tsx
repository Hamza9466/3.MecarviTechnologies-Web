"use client";

import React, { useState, useEffect } from 'react';

interface Feature {
  title: string;
  description: string;
}

interface AnalyticsSectionData {
  id?: number;
  section_title: string;
  subtitle: string;
  title: string;
  description: string;
  features: Feature[];
  main_image?: string;
  small_image?: string;
  main_image_file?: File;
  small_image_file?: File;
  created_at?: string;
  updated_at?: string;
}

interface AnalyticsEditorProps {
  data: AnalyticsSectionData[];
  onChange: (data: AnalyticsSectionData[]) => void;
}

export default function AnalyticsEditor({ data, onChange }: AnalyticsEditorProps) {
  const [currentSection, setCurrentSection] = useState<AnalyticsSectionData>({
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
    if (data.length > 0 && editingIndex === null) {
      setCurrentSection(data[0]);
      setEditingIndex(0);
    } else if (data.length === 0 && editingIndex === null) {
      // Initialize with empty section when no data exists
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
    }
  }, [data, editingIndex]);

  const handleFieldChange = (field: keyof AnalyticsSectionData, value: string | Feature[] | File) => {
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
    const newSection: AnalyticsSectionData = {
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
        const response = await fetch(`http://localhost:8000/api/v1/analytics-sections/${sectionToDelete.id}`, {
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
          alert('Analytics section deleted successfully!');
        } else {
          alert('Failed to delete analytics section');
        }
      } catch (error) {
        console.error('Error deleting analytics section:', error);
        alert('Error deleting analytics section');
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
              Create New Analytics Section
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
              placeholder="Analytics & Insights"
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
              placeholder="Data insights"
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
              placeholder="Transform your data into actionable insights"
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
              placeholder="Harness the power of advanced analytics..."
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
              Edit Analytics Section {editingIndex !== null ? editingIndex + 1 : ''}
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
              placeholder="Analytics & Insights"
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
              placeholder="Data insights"
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
              placeholder="Transform your data into actionable insights"
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
              placeholder="Harness the power of advanced analytics..."
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
            {currentSection.main_image && currentSection.main_image.trim() !== '' && (
              <div className="mt-2">
                <p className="text-xs text-gray-500">Current image:</p>
                <img
                  src={`http://localhost:8000${currentSection.main_image}`}
                  alt="Main image"
                  className="h-20 w-20 object-cover rounded"
                  onLoad={() => console.log('Main image loaded successfully:', `http://localhost:8000${currentSection.main_image}`)}
                  onError={(e) => {
                    console.error('Main image failed to load:', `http://localhost:8000${currentSection.main_image}`);
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNSA0MEgzNU00MCA0MEg1NU0yNSA0MFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik0yNSAzMEgzNU00MCAzMEg1NU0yNSAzMFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik0yNSA1MEgzNU00MCA1MEg1NU0yNSA1MFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjx0ZXh0IHg9IjQwIiB5PSI0NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzlDQTNBRiIgZm9udC1zaXplPSIxMiIgZm9udC1mYW1pbHk9IkFyaWFsIj5JbWc8L3RleHQ+Cjwvc3ZnPgo=';
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
            {currentSection.small_image && currentSection.small_image.trim() !== '' && (
              <div className="mt-2">
                <p className="text-xs text-gray-500">Current image:</p>
                <img
                  src={`http://localhost:8000${currentSection.small_image}`}
                  alt="Small image"
                  className="h-20 w-20 object-cover rounded"
                  onLoad={() => console.log('Small image loaded successfully:', `http://localhost:8000${currentSection.small_image}`)}
                  onError={(e) => {
                    console.error('Small image failed to load:', `http://localhost:8000${currentSection.small_image}`);
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNSA0MEgzNU00MCA0MEg1NU0yNSA0MFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik0yNSAzMEgzNU00MCAzMEg1NU0yNSAzMFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik0yNSA1MEgzNU00MCA1MEg1NU0yNSA1MFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjx0ZXh0IHg9IjQwIiB5PSI0NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzlDQTNBRiIgZm9udC1zaXplPSIxMiIgZm9udC1mYW1pbHk9IkFyaWFsIj5JbWc8L3RleHQ+Cjwvc3ZnPgo=';
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
