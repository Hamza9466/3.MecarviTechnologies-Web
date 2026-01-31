"use client";

import React, { useState, useEffect } from 'react';

interface ShowcaseItem {
  id?: number;
  title: string;
  description: string;
  image: string;
  image_file?: File;
  order: number;
}

interface ShowcaseSectionData {
  id?: number;
  section_title: string;
  section_description: string;
  background_image?: string;
  background_image_file?: File;
  background_image_mobile?: string;
  background_image_mobile_file?: File;
  showcase_items: ShowcaseItem[];
}

interface ShowcaseSectionEditorProps {
  data: ShowcaseSectionData[];
  onChange: (data: ShowcaseSectionData[]) => void;
}

export default function ShowcaseSectionEditor({ data, onChange }: ShowcaseSectionEditorProps) {
  const [currentSection, setCurrentSection] = useState<ShowcaseSectionData>({
    section_title: '',
    section_description: '',
    showcase_items: []
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    console.log('ShowcaseSectionEditor - Data received:', data);
    console.log('ShowcaseSectionEditor - Data length:', data.length);
    console.log('ShowcaseSectionEditor - Editing index:', editingIndex);

    if (data.length > 0 && editingIndex === null) {
      console.log('ShowcaseSectionEditor - Setting up first section');
      setCurrentSection(data[0]);
      setEditingIndex(0);
    } else if (data.length === 0 && editingIndex === null) {
      console.log('ShowcaseSectionEditor - Initializing with empty section');
      // Initialize with empty section when no data exists
      setCurrentSection({
        section_title: '',
        section_description: '',
        showcase_items: []
      });
      setEditingIndex(0);
    } else if (data.length > 0 && editingIndex !== null) {
      console.log('ShowcaseSectionEditor - Updating current section from data');
      setCurrentSection(data[editingIndex]);
    }
  }, [data, editingIndex]);

  const handleFieldChange = (field: keyof ShowcaseSectionData, value: string | ShowcaseItem[]) => {
    const updated = { ...currentSection, [field]: value };
    console.log('ShowcaseSectionEditor - handleFieldChange:', {
      field,
      value,
      updatedSection: updated,
      editingIndex,
      dataLength: data.length,
      // Debug showcase_items specifically
      showcaseItemsBefore: currentSection.showcase_items.map((item, i) => ({
        index: i,
        hasFile: !!item.image_file,
        fileName: item.image_file?.name
      })),
      showcaseItemsAfter: Array.isArray(value) ? value.map((item, i) => ({
        index: i,
        hasFile: !!item.image_file,
        fileName: item.image_file?.name
      })) : 'Not an array'
    });
    setCurrentSection(updated);

    // Always call onChange to keep parent in sync, even for new sections
    if (editingIndex !== null) {
      if (data.length === 0) {
        // For new sections, create array with current section
        console.log('ShowcaseSectionEditor - Creating new array with section:', updated);
        onChange([updated]);
      } else {
        // For existing sections, update the specific section
        const newData = [...data];
        newData[editingIndex] = updated;
        console.log('ShowcaseSectionEditor - Updating existing section at index', editingIndex, ':', updated);
        onChange(newData);
      }
    }
  };

  const handleItemChange = (itemIndex: number, field: keyof ShowcaseItem, value: any) => {
    const updatedItems = [...currentSection.showcase_items];
    updatedItems[itemIndex] = { ...updatedItems[itemIndex], [field]: value };

    // CRITICAL: Preserve image_file for all items that weren't just updated
    const preservedItems = updatedItems.map((item, index) => {
      if (index === itemIndex) {
        // This is the item being updated - use the updated version
        return item;
      } else {
        // This is NOT the item being updated - preserve its image_file
        return {
          ...item,
          image_file: currentSection.showcase_items[index]?.image_file || item.image_file
        };
      }
    });

    console.log('handleItemChange - Preserving files:', {
      itemIndex,
      field,
      updatedItem: updatedItems[itemIndex],
      preservedItems: preservedItems.map((item, i) => ({
        index: i,
        hasFile: !!item.image_file,
        fileName: item.image_file?.name
      }))
    });

    handleFieldChange('showcase_items', preservedItems);
  };

  const handleFileChange = (itemIndex: number, file: File) => {
    console.log('ShowcaseSectionEditor - handleFileChange:', {
      itemIndex,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    // Create a completely new array to avoid any reference issues
    const updatedItems = currentSection.showcase_items.map((item, index) => {
      if (index === itemIndex) {
        // Update this item with the new file
        return {
          ...item,
          image_file: file,
          // Keep the existing image URL until the file is saved
          image: item.image
        };
      } else {
        // CRITICAL: Preserve this item exactly as it is, including image_file
        return { ...item };
      }
    });

    console.log('handleFileChange - Updated items:', {
      updatedItems: updatedItems.map((item, i) => ({
        index: i,
        title: item.title,
        hasFile: !!item.image_file,
        fileName: item.image_file?.name
      }))
    });

    handleFieldChange('showcase_items', updatedItems);
  };

  const handleBackgroundImageChange = (file: File) => {
    console.log('ShowcaseSectionEditor - handleBackgroundImageChange:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    const updated = {
      ...currentSection,
      background_image_file: file,
      // Keep the existing image URL until the file is saved
      background_image: currentSection.background_image
    };

    setCurrentSection(updated);

    // Call onChange to keep parent in sync
    if (editingIndex !== null) {
      if (data.length === 0) {
        onChange([updated]);
      } else {
        const newData = [...data];
        newData[editingIndex] = updated;
        onChange(newData);
      }
    }
  };

  const handleBackgroundImageMobileChange = (file: File) => {
    console.log('ShowcaseSectionEditor - handleBackgroundImageMobileChange:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    const updated = {
      ...currentSection,
      background_image_mobile_file: file,
      // Keep the existing image URL until the file is saved
      background_image_mobile: currentSection.background_image_mobile
    };

    setCurrentSection(updated);

    // Call onChange to keep parent in sync
    if (editingIndex !== null) {
      if (data.length === 0) {
        onChange([updated]);
      } else {
        const newData = [...data];
        newData[editingIndex] = updated;
        onChange(newData);
      }
    }
  };

  const addShowcaseItem = () => {
    const newItem: ShowcaseItem = {
      title: '',
      description: '',
      image: '',
      order: currentSection.showcase_items.length
    };
    handleFieldChange('showcase_items', [...currentSection.showcase_items, newItem]);
  };

  const removeShowcaseItem = (index: number) => {
    const updatedItems = currentSection.showcase_items.filter((_, i) => i !== index);
    handleFieldChange('showcase_items', updatedItems);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Showcase Section Content</h3>

      {/* Section Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
        <input
          type="text"
          value={currentSection.section_title}
          onChange={(e) => handleFieldChange('section_title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
          placeholder="Our Showcase"
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
          placeholder="Explore our amazing work and projects that showcase our expertise and creativity."
        />
      </div>

      {/* Background Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Background Image </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleBackgroundImageChange(file);
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-gray-700 file:text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold"
        />
        {currentSection.background_image && !currentSection.background_image_file && (
          <div className="mt-2">
            <img
              src={currentSection.background_image.startsWith('http') ? currentSection.background_image : `http://localhost:8000${currentSection.background_image}`}
              alt="Background desktop"
              className="mt-2 h-20 w-20 object-cover rounded"
              onError={(e) => {
                e.currentTarget.src = '/assets/images/placeholder.png';
              }}
            />
          </div>
        )}
        {currentSection.background_image_file && (
          <div className="mt-2">
            <p className="text-xs text-green-600">New file: {currentSection.background_image_file.name}</p>
            <img
              src={URL.createObjectURL(currentSection.background_image_file)}
              alt="Background desktop preview"
              className="mt-2 h-20 w-20 object-cover rounded"
            />
          </div>
        )}
      </div>

      {/* Background Image  */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Background Image (second)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleBackgroundImageMobileChange(file);
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-gray-700 file:text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold"
        />
        {currentSection.background_image_mobile && !currentSection.background_image_mobile_file && (
          <div className="mt-2">
            <img
              src={currentSection.background_image_mobile.startsWith('http') ? currentSection.background_image_mobile : `http://localhost:8000${currentSection.background_image_mobile}`}
              alt="Background mobile"
              className="mt-2 h-20 w-20 object-cover rounded"
              onError={(e) => {
                e.currentTarget.src = '/assets/images/placeholder.png';
              }}
            />
          </div>
        )}
        {currentSection.background_image_mobile_file && (
          <div className="mt-2">
            <p className="text-xs text-green-600">New file: {currentSection.background_image_mobile_file.name}</p>
            <img
              src={URL.createObjectURL(currentSection.background_image_mobile_file)}
              alt="Background mobile preview"
              className="mt-2 h-20 w-20 object-cover rounded"
            />
          </div>
        )}
      </div>

      {/* Showcase Items */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">Showcase Items</label>
          <button
            onClick={addShowcaseItem}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Add Item
          </button>
        </div>

        {currentSection.showcase_items.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-900">Item {index + 1}</h4>
              <button
                onClick={() => removeShowcaseItem(index)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove Item
              </button>
            </div>

            {/* Item Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                placeholder="Project Alpha"
              />
            </div>

            {/* Item Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={item.description}
                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                placeholder="A revolutionary web application that transforms how businesses manage their operations."
              />
            </div>

            {/* Item Image */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
              <input
                key={`file-input-${index}-${item.image_file?.name || item.image || 'empty'}`}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileChange(index, file);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-gray-700 file:text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold"
              />
              {item.image && !item.image_file && (
                <div className="mt-2">
                  <img
                    src={item.image.startsWith('http') ? item.image : `http://localhost:8000${item.image}`}
                    alt="Showcase item"
                    className="mt-2 h-20 w-20 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/images/placeholder.png';
                    }}
                  />
                </div>
              )}
              {item.image_file && (
                <div className="mt-2">
                  <p className="text-xs text-green-600">New file: {item.image_file.name}</p>
                  <img
                    src={URL.createObjectURL(item.image_file)}
                    alt="Showcase item preview"
                    className="mt-2 h-20 w-20 object-cover rounded"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
