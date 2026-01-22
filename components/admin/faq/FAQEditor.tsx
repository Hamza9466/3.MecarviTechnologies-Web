"use client";

import { useState, useEffect } from "react";

interface FAQCategory {
  id: number;
  category_name: string;
  order: number;
}

interface FAQItem {
  id: number;
  faq_category_id: number;
  question: string;
  answer: string;
  order: number;
}

interface FAQPageData {
  hero_title: string;
  paragraph_text: string;
  heroSectionId: number | null;
  introParagraphId: number | null;
}

interface UserQuestion {
  id: number;
  name: string;
  email?: string;
  question_message: string;
  created_at: string;
  status: 'pending' | 'answered' | 'dismissed';
}

export default function FAQEditor() {
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [userQuestions, setUserQuestions] = useState<UserQuestion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [editingCategory, setEditingCategory] = useState<FAQCategory | null>(null);
  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null);
  const [viewingQuestion, setViewingQuestion] = useState<UserQuestion | null>(null);
  const [pageData, setPageData] = useState<FAQPageData>({
    hero_title: "Frequently Asked Question",
    paragraph_text: "Find answers to commonly asked questions about our services, products, and processes. If you can't find what you're looking for, feel free to ask us a question using the form below.",
    heroSectionId: null,
    introParagraphId: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [endpointStatus, setEndpointStatus] = useState<{
    hero: boolean;
    intro: boolean;
    categories: boolean;
    items: boolean;
    questions: boolean;
  }>({
    hero: false,
    intro: false,
    categories: false,
    items: false,
    questions: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const getToken = () => {
    return localStorage.getItem("token") || "";
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch all data in parallel with error handling
      const fetchWithErrorHandling = async (url: string, expectedErrors: number[] = [405, 404]) => {
        try {
          const response = await fetch(url, {
            method: "GET",
            headers: { Accept: "application/json" },
          });
          // If it's an expected error, return a response object that won't be processed
          if (!response.ok && expectedErrors.includes(response.status)) {
            console.log(`⚠️ GET endpoint not available: ${url} (Status: ${response.status})`);
            return { ok: false, status: response.status, _suppressError: true };
          }
          if (response.ok) {
            console.log(`✅ Successfully fetched from: ${url}`);
          }
          return response;
        } catch (error) {
          console.log(`❌ Network error fetching: ${url}`, error);
          return { ok: false, status: 500, _suppressError: true };
        }
      };

      const [heroRes, introRes, categoriesRes, faqItemsRes, questionsRes] = await Promise.allSettled([
        fetchWithErrorHandling("http://localhost:8000/api/v1/faq-hero-section"),
        fetchWithErrorHandling("http://localhost:8000/api/v1/faq-intro-paragraph"),
        fetchWithErrorHandling("http://localhost:8000/api/v1/faq-categories"),
        fetchWithErrorHandling("http://localhost:8000/api/v1/faq-items"),
        fetchWithErrorHandling("http://localhost:8000/api/v1/user-submitted-questions", [405]), // Only suppress 405, not 404
      ]);

      // Handle Hero Section - only process if successful (200-299)
      if (heroRes.status === "fulfilled") {
        const response = heroRes.value as any;
        if (response.ok && !response._suppressError) {
          try {
            const heroData = await response.json();
            if (heroData.success && heroData.data?.faq_hero_section) {
              const section = heroData.data.faq_hero_section;
              setPageData((prev) => ({
                ...prev,
                hero_title: section.hero_title || prev.hero_title,
                heroSectionId: section.id || null,
              }));
              setEndpointStatus(prev => ({ ...prev, hero: true }));
              console.log("✅ Hero section data loaded:", section);
            }
          } catch (e) {
            console.error("Error parsing hero section:", e);
          }
        } else {
          setEndpointStatus(prev => ({ ...prev, hero: false }));
        }
      }

      // Handle Intro Paragraph
      if (introRes.status === "fulfilled") {
        const response = introRes.value as any;
        if (response.ok && !response._suppressError) {
          try {
            const introData = await response.json();
            if (introData.success && introData.data?.faq_intro_paragraph) {
              const section = introData.data.faq_intro_paragraph;
              setPageData((prev) => ({
                ...prev,
                paragraph_text: section.paragraph_text || prev.paragraph_text,
                introParagraphId: section.id || null,
              }));
              setEndpointStatus(prev => ({ ...prev, intro: true }));
              console.log("✅ Intro paragraph data loaded:", section);
            }
          } catch (e) {
            console.error("Error parsing intro paragraph:", e);
          }
        } else {
          setEndpointStatus(prev => ({ ...prev, intro: false }));
        }
      }

      // Handle Categories
      if (categoriesRes.status === "fulfilled") {
        const response = categoriesRes.value as any;
        if (response.ok && !response._suppressError) {
          try {
            const categoriesData = await response.json();
            if (categoriesData.success && categoriesData.data) {
              const cats = Array.isArray(categoriesData.data)
                ? categoriesData.data
                : categoriesData.data.faq_categories || [];
              setCategories(
                cats.map((cat: any) => ({
                  id: cat.id,
                  category_name: cat.category_name || "",
                  order: cat.order || 0,
                }))
              );
              setEndpointStatus(prev => ({ ...prev, categories: true }));
              console.log(`✅ Loaded ${cats.length} categories`);
            }
          } catch (e) {
            console.error("Error parsing categories:", e);
          }
        } else {
          setEndpointStatus(prev => ({ ...prev, categories: false }));
        }
      }

      // Handle FAQ Items
      if (faqItemsRes.status === "fulfilled") {
        const response = faqItemsRes.value as any;
        if (response.ok && !response._suppressError) {
          try {
            const faqItemsData = await response.json();
            if (faqItemsData.success && faqItemsData.data) {
              const items = Array.isArray(faqItemsData.data)
                ? faqItemsData.data
                : faqItemsData.data.faq_items || [];
              setFaqItems(
                items.map((item: any) => ({
                  id: item.id,
                  faq_category_id: item.faq_category_id || item.category_id || 0,
                  question: item.question || "",
                  answer: item.answer || "",
                  order: item.order || 0,
                }))
              );
              setEndpointStatus(prev => ({ ...prev, items: true }));
              console.log(`✅ Loaded ${items.length} FAQ items`);
            }
          } catch (e) {
            console.error("Error parsing FAQ items:", e);
          }
        } else {
          setEndpointStatus(prev => ({ ...prev, items: false }));
        }
      }

      // Handle User Questions
      if (questionsRes.status === "fulfilled") {
        const response = questionsRes.value as any;
        if (response.ok && !response._suppressError) {
          try {
            const questionsData = await response.json();
            console.log("User questions response:", questionsData);
            
            // Handle different response structures
            let questions: any[] = [];
            if (Array.isArray(questionsData)) {
              // Direct array response
              questions = questionsData;
            } else if (questionsData.success && questionsData.data) {
              // Check for nested user_submitted_questions array
              if (questionsData.data.user_submitted_questions && Array.isArray(questionsData.data.user_submitted_questions)) {
                questions = questionsData.data.user_submitted_questions;
              } else if (Array.isArray(questionsData.data)) {
                // Direct array in data
                questions = questionsData.data;
              } else if (questionsData.data.questions && Array.isArray(questionsData.data.questions)) {
                // Nested in data.questions
                questions = questionsData.data.questions;
              }
            } else if (questionsData.data && Array.isArray(questionsData.data)) {
              // Data array without success flag
              questions = questionsData.data;
            }
            
            console.log("Parsed questions:", questions);
            
            if (questions.length > 0) {
              setUserQuestions(
                questions.map((q: any) => ({
                  id: q.id,
                  name: q.name || "",
                  email: q.email || "",
                  question_message: q.question_message || q.message || "",
                  created_at: q.created_at || "",
                  status: q.status || 'pending',
                }))
              );
              setEndpointStatus(prev => ({ ...prev, questions: true }));
              console.log(`✅ Loaded ${questions.length} user questions`);
            } else {
              setUserQuestions([]);
              setEndpointStatus(prev => ({ ...prev, questions: true }));
              console.log("✅ User questions endpoint working, but no questions found");
            }
          } catch (e) {
            console.error("Error parsing user questions:", e);
            setEndpointStatus(prev => ({ ...prev, questions: false }));
          }
        } else if (response.status === 404) {
          // 404 means endpoint doesn't exist yet
          console.log("⚠️ User questions endpoint not found (404)");
          setEndpointStatus(prev => ({ ...prev, questions: false }));
        } else {
          setEndpointStatus(prev => ({ ...prev, questions: false }));
        }
      }
    } catch (err) {
      console.error("Error fetching FAQ data:", err);
      // Don't show error to user if endpoints aren't set up yet
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHeroSection = async () => {
    const token = getToken();
    if (!token) {
      setError("Please login to save changes");
      return;
    }

    try {
      setSaving(true);
      setError("");
      
      const url = pageData.heroSectionId
        ? `http://localhost:8000/api/v1/faq-hero-section/${pageData.heroSectionId}`
        : "http://localhost:8000/api/v1/faq-hero-section";

      const method = pageData.heroSectionId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hero_title: pageData.hero_title,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save hero section");
      }

      const data = await response.json();
      if (data.success) {
        setPageData((prev) => ({
          ...prev,
          heroSectionId: data.data?.faq_hero_section?.id || prev.heroSectionId,
        }));
        setSuccess("Hero section saved successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err: any) {
      console.error("Error saving hero section:", err);
      setError(err.message || "Failed to save hero section");
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveIntroParagraph = async () => {
    const token = getToken();
    if (!token) {
      setError("Please login to save changes");
      return;
    }

    try {
      setSaving(true);
      setError("");
      
      const url = pageData.introParagraphId
        ? `http://localhost:8000/api/v1/faq-intro-paragraph/${pageData.introParagraphId}`
        : "http://localhost:8000/api/v1/faq-intro-paragraph";

      const method = pageData.introParagraphId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paragraph_text: pageData.paragraph_text,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save intro paragraph");
      }

      const data = await response.json();
      if (data.success) {
        setPageData((prev) => ({
          ...prev,
          introParagraphId: data.data?.faq_intro_paragraph?.id || prev.introParagraphId,
        }));
        setSuccess("Intro paragraph saved successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err: any) {
      console.error("Error saving intro paragraph:", err);
      setError(err.message || "Failed to save intro paragraph");
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCategory = async (category: FAQCategory) => {
    const token = getToken();
    if (!token) {
      setError("Please login to save changes");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const url = category.id > 0
        ? `http://localhost:8000/api/v1/faq-categories/${category.id}`
        : "http://localhost:8000/api/v1/faq-categories";

      const method = category.id > 0 ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category_name: category.category_name,
          order: category.order,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save category");
      }

      const data = await response.json();
      if (data.success) {
        const savedCategory = data.data?.faq_category || data.data;
        if (category.id > 0) {
          setCategories((prev) =>
            prev.map((c) =>
              c.id === category.id
                ? {
                    id: savedCategory.id,
                    category_name: savedCategory.category_name || c.category_name,
                    order: savedCategory.order || c.order,
                  }
                : c
            )
          );
        } else {
          setCategories((prev) => [
            ...prev,
            {
              id: savedCategory.id,
              category_name: savedCategory.category_name || "",
              order: savedCategory.order || prev.length + 1,
            },
          ]);
        }
        setSuccess("Category saved successfully!");
        setTimeout(() => setSuccess(""), 3000);
        setEditingCategory(null);
      }
    } catch (err: any) {
      console.error("Error saving category:", err);
      setError(err.message || "Failed to save category");
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category? This will also delete all FAQ items in this category.")) {
      return;
    }

    const token = getToken();
    if (!token) {
      setError("Please login to delete");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(`http://localhost:8000/api/v1/faq-categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete category");
      }

      setCategories((prev) => prev.filter((c) => c.id !== id));
      setFaqItems((prev) => prev.filter((item) => item.faq_category_id !== id));
      setSuccess("Category deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error deleting category:", err);
      setError(err.message || "Failed to delete category");
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFAQ = async (faq: FAQItem) => {
    const token = getToken();
    if (!token) {
      setError("Please login to save changes");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const url = faq.id > 0
        ? `http://localhost:8000/api/v1/faq-items/${faq.id}`
        : "http://localhost:8000/api/v1/faq-items";

      const method = faq.id > 0 ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          faq_category_id: faq.faq_category_id,
          question: faq.question,
          answer: faq.answer,
          order: faq.order,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save FAQ item");
      }

      const data = await response.json();
      if (data.success) {
        const savedFAQ = data.data?.faq_item || data.data;
        if (faq.id > 0) {
          setFaqItems((prev) =>
            prev.map((f) =>
              f.id === faq.id
                ? {
                    id: savedFAQ.id,
                    faq_category_id: savedFAQ.faq_category_id || f.faq_category_id,
                    question: savedFAQ.question || f.question,
                    answer: savedFAQ.answer || f.answer,
                    order: savedFAQ.order || f.order,
                  }
                : f
            )
          );
        } else {
          setFaqItems((prev) => [
            ...prev,
            {
              id: savedFAQ.id,
              faq_category_id: savedFAQ.faq_category_id || 0,
              question: savedFAQ.question || "",
              answer: savedFAQ.answer || "",
              order: savedFAQ.order || prev.length + 1,
            },
          ]);
        }
        setSuccess("FAQ item saved successfully!");
        setTimeout(() => setSuccess(""), 3000);
        setEditingFAQ(null);
      }
    } catch (err: any) {
      console.error("Error saving FAQ item:", err);
      setError(err.message || "Failed to save FAQ item");
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFAQ = async (id: number) => {
    if (!confirm("Are you sure you want to delete this FAQ item?")) {
      return;
    }

    const token = getToken();
    if (!token) {
      setError("Please login to delete");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(`http://localhost:8000/api/v1/faq-items/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete FAQ item");
      }

      setFaqItems((prev) => prev.filter((f) => f.id !== id));
      setSuccess("FAQ item deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error deleting FAQ item:", err);
      setError(err.message || "Failed to delete FAQ item");
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleViewQuestion = (question: UserQuestion) => {
    setViewingQuestion(question);
  };

  const handleUpdateQuestionStatus = async (id: number, status: 'pending' | 'answered' | 'dismissed') => {
    const token = getToken();
    if (!token) {
      setError("Please login to update question status");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(`http://localhost:8000/api/v1/user-submitted-questions/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update question status");
      }

      const data = await response.json();
      if (data.success) {
        setUserQuestions((prev) =>
          prev.map((q) => (q.id === id ? { ...q, status } : q))
        );
        if (viewingQuestion && viewingQuestion.id === id) {
          setViewingQuestion({ ...viewingQuestion, status });
        }
        setSuccess("Question status updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err: any) {
      console.error("Error updating question status:", err);
      setError(err.message || "Failed to update question status");
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    if (!confirm("Are you sure you want to delete this question?")) {
      return;
    }

    const token = getToken();
    if (!token) {
      setError("Please login to delete");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(`http://localhost:8000/api/v1/user-submitted-questions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete question");
      }

      setUserQuestions((prev) => prev.filter((q) => q.id !== id));
      if (viewingQuestion && viewingQuestion.id === id) {
        setViewingQuestion(null);
      }
      setSuccess("Question deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error deleting question:", err);
      setError(err.message || "Failed to delete question");
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleAddNewCategory = () => {
    const maxOrder = categories.length > 0 ? Math.max(...categories.map((c) => c.order)) : 0;
    const newCategory: FAQCategory = {
      id: -Date.now(),
      category_name: "New Category",
      order: maxOrder + 1,
    };
    setCategories((prev) => [...prev, newCategory]);
    setEditingCategory(newCategory);
  };

  const handleAddNewFAQ = () => {
    if (categories.length === 0) {
      setError("Please create at least one category first");
      setTimeout(() => setError(""), 3000);
      return;
    }
    const maxOrder = faqItems.length > 0 ? Math.max(...faqItems.map((f) => f.order)) : 0;
    const newFAQ: FAQItem = {
      id: -Date.now(),
      faq_category_id: categories[0].id,
      question: "New Question?",
      answer: "New Answer",
      order: maxOrder + 1,
    };
    setFaqItems((prev) => [...prev, newFAQ]);
    setEditingFAQ(newFAQ);
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}


      {/* HERO SECTION */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300 text-center uppercase">
          HERO SECTION
        </h3>
        <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Hero Title</label>
              <input
                type="text"
                value={pageData.hero_title}
                onChange={(e) => setPageData({ ...pageData, hero_title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
                style={{ color: '#111827', WebkitTextFillColor: '#111827' }}
                placeholder="Frequently Asked Question"
              />
            </div>
            <button
              onClick={handleSaveHeroSection}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Hero Section"}
            </button>
          </div>
        </div>
      </div>

      {/* INTRODUCTORY PARAGRAPH */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300 text-center uppercase">
          INTRODUCTORY PARAGRAPH
        </h3>
        <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Paragraph Text</label>
              <textarea
                value={pageData.paragraph_text}
                onChange={(e) => setPageData({ ...pageData, paragraph_text: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
                style={{ color: '#111827', WebkitTextFillColor: '#111827' }}
                placeholder="Find answers to commonly asked questions about our services, products, and processes. If you can't find what you're looking for, feel free to ask us a question using the form below."
              />
            </div>
            <button
              onClick={handleSaveIntroParagraph}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Intro Paragraph"}
            </button>
          </div>
        </div>
      </div>

      {/* CATEGORIES Section */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300 text-center uppercase">
          CATEGORIES
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-bold">
                  <span className="text-pink-600">CATEGORY # </span>
                  <span className="text-gray-900">{category.id}</span>
                </h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="w-6 h-6 bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="w-6 h-6 bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              {editingCategory?.id === category.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editingCategory.category_name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, category_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
                    style={{ color: '#111827', WebkitTextFillColor: '#111827' }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveCategory(editingCategory)}
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => setEditingCategory(null)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-700">{category.category_name}</p>
              )}
            </div>
          ))}

          {/* Add New Category Card */}
          <div
            onClick={handleAddNewCategory}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white shadow-sm flex items-center justify-center min-h-[120px] cursor-pointer hover:border-pink-500 transition-colors"
          >
            <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ CONTENT Section */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300 text-center uppercase">
          FAQ CONTENT
        </h3>
        
        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              selectedCategory === null
                ? "bg-pink-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
          <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                selectedCategory === category.id
                ? "bg-pink-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
              {category.category_name}
          </button>
          ))}
        </div>

        {/* FAQ Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqItems
            .filter((item) => selectedCategory === null || item.faq_category_id === selectedCategory)
            .map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-3">
                <h4 className="text-sm font-bold">
                  <span className="text-pink-600">Q#</span>
                  <span className="text-gray-900">{item.id}</span>
                </h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingFAQ(item)}
                      className="w-6 h-6 bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
                    >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                    <button
                      onClick={() => handleDeleteFAQ(item.id)}
                      className="w-6 h-6 bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {editingFAQ?.id === item.id ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={editingFAQ.faq_category_id}
                        onChange={(e) => setEditingFAQ({ ...editingFAQ, faq_category_id: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
                        style={{ color: '#111827', WebkitTextFillColor: '#111827' }}
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.category_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Question</label>
                      <input
                        type="text"
                        value={editingFAQ.question}
                        onChange={(e) => setEditingFAQ({ ...editingFAQ, question: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
                        style={{ color: '#111827', WebkitTextFillColor: '#111827' }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Answer</label>
                      <textarea
                        value={editingFAQ.answer}
                        onChange={(e) => setEditingFAQ({ ...editingFAQ, answer: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
                        style={{ color: '#111827', WebkitTextFillColor: '#111827' }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveFAQ(editingFAQ)}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => setEditingFAQ(null)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
              </div>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-gray-900 mb-2">
                      Category: {categories.find((c) => c.id === item.faq_category_id)?.category_name || "Unknown"}
                    </p>
                    <h5 className="font-bold text-gray-900 mb-2">{item.question}</h5>
                    <p className="text-sm text-gray-700">{item.answer}</p>
                  </>
                )}
            </div>
          ))}

          {/* Add New FAQ Item Card */}
          <div
            onClick={handleAddNewFAQ}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white shadow-sm flex items-center justify-center min-h-[200px] cursor-pointer hover:border-pink-500 transition-colors"
          >
            <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* USER SUBMITTED QUESTIONS */}
      <div>
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-300">
          <h3 className="text-lg font-bold text-gray-900 text-center uppercase flex-1">
            USER SUBMITTED QUESTIONS
          </h3>
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
            title="Refresh questions"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
        
        <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Question/Message</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userQuestions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                      No questions submitted yet.
                    </td>
                  </tr>
                ) : (
                  userQuestions.map((question) => (
                    <tr key={question.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">#{question.id}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{question.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-md">
                        <div 
                          className="truncate cursor-pointer hover:text-blue-600" 
                          title={question.question_message}
                          onClick={() => handleViewQuestion(question)}
                        >
                          {question.question_message}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {question.created_at ? new Date(question.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            question.status === 'answered'
                              ? 'bg-green-100 text-green-800'
                              : question.status === 'dismissed'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {question.status.charAt(0).toUpperCase() + question.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewQuestion(question)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Question Details Modal */}
      {viewingQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">Question Details</h3>
                <button
                  onClick={() => setViewingQuestion(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                  <p className="text-sm text-gray-900">#{viewingQuestion.id}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-sm text-gray-900">{viewingQuestion.name}</p>
                </div>

                {viewingQuestion.email && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-sm text-gray-900">{viewingQuestion.email}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question/Message</label>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded border">
                    {viewingQuestion.question_message}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Submitted</label>
                  <p className="text-sm text-gray-900">
                    {viewingQuestion.created_at 
                      ? new Date(viewingQuestion.created_at).toLocaleString() 
                      : 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateQuestionStatus(viewingQuestion.id, 'pending')}
                      disabled={saving || viewingQuestion.status === 'pending'}
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        viewingQuestion.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-500'
                          : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-300'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => handleUpdateQuestionStatus(viewingQuestion.id, 'answered')}
                      disabled={saving || viewingQuestion.status === 'answered'}
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        viewingQuestion.status === 'answered'
                          ? 'bg-green-100 text-green-800 border-2 border-green-500'
                          : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-300'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      Answered
                    </button>
                    <button
                      onClick={() => handleUpdateQuestionStatus(viewingQuestion.id, 'dismissed')}
                      disabled={saving || viewingQuestion.status === 'dismissed'}
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        viewingQuestion.status === 'dismissed'
                          ? 'bg-gray-100 text-gray-800 border-2 border-gray-500'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-300'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      Dismissed
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <button
                    onClick={() => handleDeleteQuestion(viewingQuestion.id)}
                    disabled={saving}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium disabled:opacity-50"
                  >
                    Delete Question
                  </button>
                  <button
                    onClick={() => setViewingQuestion(null)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
