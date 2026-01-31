"use client";

import React, { useState } from 'react';

interface HeroSlide {
  id: number;
  image: string;
  smallText: string;
  mainHeading: string;
  outlinedHeading: string;
  description: string;
  backgroundText: string;
  buttonText: string;
  buttonUrl: string;
}

interface HeroSectionEditorProps {
  pageHeading: string;
  onPageHeadingChange: (value: string) => void;
  slides: HeroSlide[];
  onSlidesChange: (slides: HeroSlide[]) => void;
}

export default function HeroSectionEditor({
  pageHeading,
  onPageHeadingChange,
  slides,
  onSlidesChange
}: HeroSectionEditorProps) {
  console.log('=== HeroSectionEditor Props ===');
  console.log('pageHeading:', pageHeading);
  console.log('slides:', slides);
  console.log('slides.length:', slides.length);
  console.log('onSlidesChange:', typeof onSlidesChange);

  const handleSlideChange = (index: number, field: keyof HeroSlide, value: string) => {
    const updated = [...slides];
    updated[index] = { ...updated[index], [field]: value };
    onSlidesChange(updated);
  };

  const addNewSlide = () => {
    console.log('Adding new slide...');
    console.log('Current slides:', slides);
    const newSlide: HeroSlide = {
      id: Date.now(),
      image: '',
      smallText: '',
      mainHeading: '',
      outlinedHeading: '',
      description: '',
      backgroundText: '',
      buttonText: 'Get Started Now',
      buttonUrl: '/contact'
    };
    const updatedSlides = [...slides, newSlide];
    console.log('Updated slides:', updatedSlides);
    onSlidesChange(updatedSlides);
  };

  const removeSlide = async (index: number) => {
    const slideToRemove = slides[index];

    // If slide has an ID (exists in database), delete it from API
    if (slideToRemove.id && typeof slideToRemove.id === 'number') {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8000/api/v1/service-page/${slideToRemove.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token || ''}`,
          }
        });

        if (response.ok) {
          console.log('Slide deleted from database successfully');
        } else {
          console.error('Failed to delete slide from database');
          // Still remove from UI even if API delete fails
        }
      } catch (error) {
        console.error('Error deleting slide from database:', error);
        // Still remove from UI even if API delete fails
      }
    }

    // Always remove from UI
    const updated = slides.filter((_, i) => i !== index);
    onSlidesChange(updated);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Hero Section Content</h2>

      {/* Page Heading field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Page Heading</label>
        <input
          type="text"
          value={pageHeading}
          onChange={(e) => onPageHeadingChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-4 pt-4 border-t border-gray-200">Hero Section Slides</h3>

      {slides.length === 0 ? (
        <div className="text-center py-8 border border-gray-200 rounded-lg bg-gray-50">
          <p className="text-gray-500 mb-4">No slides created yet</p>
          <p className="text-sm text-gray-400">Add your first slide to get started</p>
        </div>
      ) : (
        slides.map((slide, index) => (
          <div key={slide.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
            <h3 className="font-medium text-gray-900">Slide {index + 1}</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">BG Image Upload</label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Create a preview URL for the selected image
                      const imageUrl = URL.createObjectURL(file);
                      handleSlideChange(index, 'image', imageUrl);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 text-gray-700"
                />
                {slide.image && (
                  <div className="mt-2">
                    <img
                      src={slide.image}
                      alt={`Slide ${index + 1} preview`}
                      className="h-32 w-auto object-cover rounded border border-gray-300"
                      onError={(e) => {
                        console.error('Image failed to load:', slide.image);
                        console.error('Error event:', e);
                        e.currentTarget.style.display = 'none';
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', slide.image);
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">Current image preview</p>
                  </div>
                )}

                {!slide.image && (
                  <div className="mt-2">
                    <p className="text-xs text-red-500">No image set</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Small Text</label>
              <input
                type="text"
                value={slide.smallText}
                onChange={(e) => handleSlideChange(index, 'smallText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Heading</label>
              <input
                type="text"
                value={slide.mainHeading}
                onChange={(e) => handleSlideChange(index, 'mainHeading', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Outlined Heading</label>
              <input
                type="text"
                value={slide.outlinedHeading}
                onChange={(e) => handleSlideChange(index, 'outlinedHeading', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={slide.description}
                onChange={(e) => handleSlideChange(index, 'description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background Text</label>
              <input
                type="text"
                value={slide.backgroundText}
                onChange={(e) => handleSlideChange(index, 'backgroundText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
              <input
                type="text"
                value={slide.buttonText}
                onChange={(e) => handleSlideChange(index, 'buttonText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Button URL</label>
              <input
                type="text"
                value={slide.buttonUrl}
                onChange={(e) => handleSlideChange(index, 'buttonUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                placeholder="/contact"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => removeSlide(index)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Remove Slide
              </button>
            </div>
          </div>
        ))
      )}

      {/* Add New Slide Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={addNewSlide}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Slide
        </button>
      </div>
    </div>
  );
}
