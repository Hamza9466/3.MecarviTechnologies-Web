"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import Image from "next/image";

interface Fact {
  id: number;
  percentage: string;
  label: string;
  order: number;
}

interface ProcessStep {
  id: number;
  number: number;
  title: string;
  description: string;
  order: number;
}

interface OurFactsEditorRef {
  save: () => Promise<void>;
}

const OurFactsEditor = forwardRef<OurFactsEditorRef>((props, ref) => {
  const [sectionId, setSectionId] = useState<number | null>(null);
  const [largeNumber, setLargeNumber] = useState("15+");
  const [smallDescription, setSmallDescription] = useState("");
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(null);
  const [factsTitle, setFactsTitle] = useState("Our Facts");
  const [promiseId, setPromiseId] = useState<number | null>(null);
  const [promiseTitle, setPromiseTitle] = useState("Our Promise");
  const [promiseDescription, setPromiseDescription] = useState(
    "We help you scale your vision and services through thoughtful planning and consultation."
  );

  const [facts, setFacts] = useState<Fact[]>([]);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingBackground, setDeletingBackground] = useState(false);
  const [deletingFact, setDeletingFact] = useState<number | null>(null);
  const [deletingStep, setDeletingStep] = useState<number | null>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchSectionData();
    fetchFactsData();
    fetchPromiseData();
    fetchProcessStepsData();
  }, []);

  const fetchSectionData = async () => {
    try {
      setError("");
      const response = await fetch("http://localhost:8000/api/v1/our-facts-section", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setSectionId(null);
          setLargeNumber("15+");
          setSmallDescription("");
          setFactsTitle("Our Facts");
          setBackgroundImageUrl(null);
          return;
        }
        throw new Error("Failed to fetch section data");
      }

      const data = await response.json();

      if (data.success && data.data?.our_facts_section) {
        const section = data.data.our_facts_section;
        setSectionId(section.id);
        setLargeNumber(section.large_number || "15+");
        setSmallDescription(section.small_description || "");
        setFactsTitle(section.section_title || "Our Facts");
        setBackgroundImageUrl(section.background_image || null);
      }
    } catch (err: any) {
      console.error("Error fetching section data:", err);
      setError(err.message || "Failed to load section data");
    }
  };

  const fetchFactsData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/our-facts", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setFacts([]);
          return;
        }
        throw new Error("Failed to fetch facts data");
      }

      const data = await response.json();

      if (data.success && data.data) {
        const factsData = Array.isArray(data.data) ? data.data : (data.data.facts || data.data.our_facts || []);
        const sortedFacts = factsData
          .map((fact: any) => ({
            id: fact.id,
            percentage: fact.percentage || "",
            label: fact.label || "",
            order: fact.order || 0,
          }))
          .sort((a: Fact, b: Fact) => a.order - b.order);

        setFacts(sortedFacts);
      }
    } catch (err: any) {
      console.error("Error fetching facts data:", err);
    }
  };

  const fetchPromiseData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/our-promise", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setPromiseId(null);
          setPromiseTitle("Our Promise");
          setPromiseDescription("");
          return;
        }
        throw new Error("Failed to fetch promise data");
      }

      const data = await response.json();

      if (data.success && data.data?.our_promise) {
        const promise = data.data.our_promise;
        setPromiseId(promise.id);
        setPromiseTitle(promise.title || "Our Promise");
        setPromiseDescription(promise.description || "");
      }
    } catch (err: any) {
      console.error("Error fetching promise data:", err);
    }
  };

  const fetchProcessStepsData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/process-steps", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setProcessSteps([]);
          setLoading(false);
          return;
        }
        throw new Error("Failed to fetch process steps data");
      }

      const data = await response.json();

      if (data.success && data.data) {
        const stepsData = Array.isArray(data.data)
          ? data.data
          : data.data.steps || data.data.process_steps || [];
        const sortedSteps = stepsData
          .map((step: any) => ({
            id: step.id,
            number: step.number || 1,
            title: step.title || "",
            description: step.description || "",
            order: step.order || 0,
          }))
          .sort((a: ProcessStep, b: ProcessStep) => a.order - b.order);

        setProcessSteps(sortedSteps);
      }
    } catch (err: any) {
      console.error("Error fetching process steps data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackgroundImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBackgroundImage(e.target.files[0]);
      setBackgroundImageUrl(null);
    }
  };

  const handleFactChange = (factId: number, field: keyof Fact, value: string | number) => {
    setFacts((prev) =>
      prev.map((fact) => (fact.id === factId ? { ...fact, [field]: value } : fact))
    );
  };

  const handleProcessStepChange = (
    stepId: number,
    field: keyof ProcessStep,
    value: string | number
  ) => {
    setProcessSteps((prev) =>
      prev.map((step) => (step.id === stepId ? { ...step, [field]: value } : step))
    );
  };

  const handleAddFact = () => {
    const maxOrder = facts.length > 0 ? Math.max(...facts.map((f) => f.order || 0)) : 0;
    const newFact: Fact = {
      id: -Date.now(), // Negative ID for new facts
      percentage: "0%",
      label: "New Fact",
      order: maxOrder + 1,
    };
    setFacts((prev) => [...prev, newFact]);
  };

  const handleDeleteFact = async (factId: number) => {
    if (facts.length <= 1) {
      alert("You must have at least one fact");
      return;
    }

    if (!factId || factId < 0) {
      // Just remove from state if it's a new fact
      setFacts((prev) => prev.filter((fact) => fact.id !== factId));
      return;
    }

    if (!confirm("Are you sure you want to delete this fact?")) {
      return;
    }

    try {
      setDeletingFact(factId);
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Not authenticated. Please login again.");
        setDeletingFact(null);
        return;
      }

      const response = await fetch(`http://localhost:8000/api/v1/our-facts/${factId}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const text = await response.text();
        const responseData = text ? JSON.parse(text) : {};
        throw new Error(responseData.message || "Failed to delete fact");
      }

      // Remove from state
      setFacts((prev) => prev.filter((fact) => fact.id !== factId));

      setSuccess("Fact deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error deleting fact:", err);
      setError(err.message || "Failed to delete fact");
      setTimeout(() => setError(""), 5000);
    } finally {
      setDeletingFact(null);
    }
  };

  const handleAddProcessStep = () => {
    const maxOrder =
      processSteps.length > 0 ? Math.max(...processSteps.map((s) => s.order || 0)) : 0;
    const newStep: ProcessStep = {
      id: -Date.now(), // Negative ID for new steps
      number: maxOrder + 1,
      title: "New Step",
      description: "",
      order: maxOrder + 1,
    };
    setProcessSteps((prev) => [...prev, newStep]);
  };

  const handleDeleteProcessStep = async (stepId: number) => {
    if (processSteps.length <= 1) {
      alert("You must have at least one process step");
      return;
    }

    if (!stepId || stepId < 0) {
      // Just remove from state if it's a new step
      setProcessSteps((prev) => prev.filter((step) => step.id !== stepId));
      return;
    }

    if (!confirm("Are you sure you want to delete this process step?")) {
      return;
    }

    try {
      setDeletingStep(stepId);
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Not authenticated. Please login again.");
        setDeletingStep(null);
        return;
      }

      const response = await fetch(`http://localhost:8000/api/v1/process-steps/${stepId}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const text = await response.text();
        const responseData = text ? JSON.parse(text) : {};
        throw new Error(responseData.message || "Failed to delete process step");
      }

      // Remove from state
      setProcessSteps((prev) => prev.filter((step) => step.id !== stepId));

      setSuccess("Process step deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error deleting process step:", err);
      setError(err.message || "Failed to delete process step");
      setTimeout(() => setError(""), 5000);
    } finally {
      setDeletingStep(null);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to save data");
        setSaving(false);
        return;
      }

      // Save section
      const sectionFormData = new FormData();
      sectionFormData.append("section_title", factsTitle || "Our Facts");
      sectionFormData.append("large_number", largeNumber || "15+");
      sectionFormData.append("small_description", smallDescription || "");

      if (backgroundImage) {
        sectionFormData.append("background_image", backgroundImage);
      }

      const isSectionUpdate = !!sectionId;
      const sectionUrl = isSectionUpdate
        ? `http://localhost:8000/api/v1/our-facts-section/${sectionId}`
        : "http://localhost:8000/api/v1/our-facts-section";

      if (isSectionUpdate) {
        sectionFormData.append("_method", "PUT");
      }

      const sectionResponse = await fetch(sectionUrl, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: sectionFormData,
      });

      let sectionResponseData;
      const sectionText = await sectionResponse.text();
      sectionResponseData = sectionText ? JSON.parse(sectionText) : {};

      if (!sectionResponse.ok) {
        let errorMessage = "Failed to save section";
        if (sectionResponseData.errors) {
          const errorMessages = Object.values(sectionResponseData.errors).flat() as string[];
          errorMessage = errorMessages.join(", ");
        } else if (sectionResponseData.message) {
          errorMessage = sectionResponseData.message;
        }
        throw new Error(errorMessage);
      }

      // Update section ID if it was created
      if (!sectionId && sectionResponseData.data?.our_facts_section?.id) {
        setSectionId(sectionResponseData.data.our_facts_section.id);
      }

      // Update background image URL from response
      const section = sectionResponseData.data?.our_facts_section || sectionResponseData.our_facts_section;
      if (section?.background_image) {
        setBackgroundImageUrl(section.background_image);
        setBackgroundImage(null);
      }

      // Save/update promise
      await savePromise(token);

      // Save/update facts
      for (const fact of facts) {
        await saveFact(fact, token);
      }

      // Save/update process steps
      for (const step of processSteps) {
        await saveProcessStep(step, token);
      }

      // Refresh data
      await fetchSectionData();
      await fetchFactsData();
      await fetchPromiseData();
      await fetchProcessStepsData();

      setSuccess("Our Facts section saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error saving data:", err);
      setError(err.message || "Failed to save data");
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  const savePromise = async (token: string) => {
    const body = {
      title: promiseTitle || "Our Promise",
      description: promiseDescription || "",
    };

    const isUpdate = !!promiseId;
    const url = isUpdate
      ? `http://localhost:8000/api/v1/our-promise/${promiseId}`
      : "http://localhost:8000/api/v1/our-promise";

    const method = isUpdate ? "PUT" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      const responseData = text ? JSON.parse(text) : {};
      throw new Error(responseData.message || "Failed to save promise");
    }

    const responseData = await response.json();
    const savedPromise = responseData.data?.our_promise || responseData.our_promise;

    // Update promise ID if it was created
    if (!promiseId && savedPromise?.id) {
      setPromiseId(savedPromise.id);
    }
  };

  const saveFact = async (fact: Fact, token: string) => {
    const body = {
      percentage: fact.percentage || "",
      label: fact.label || "",
      order: fact.order || 0,
    };

    const isUpdate = !!fact.id && fact.id > 0;
    const url = isUpdate
      ? `http://localhost:8000/api/v1/our-facts/${fact.id}`
      : "http://localhost:8000/api/v1/our-facts";

    const method = isUpdate ? "PUT" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      const responseData = text ? JSON.parse(text) : {};
      throw new Error(responseData.message || "Failed to save fact");
    }

    const responseData = await response.json();
    const savedFact = responseData.data?.our_fact || responseData.our_fact;

    // Update fact with new ID if it was created
    if (!fact.id || fact.id < 0) {
      if (savedFact?.id) {
        setFacts((prev) =>
          prev.map((f) => (f === fact ? { ...f, id: savedFact.id, order: savedFact.order || f.order } : f))
        );
      }
    }
  };

  const saveProcessStep = async (step: ProcessStep, token: string) => {
    const body = {
      number: step.number || 1,
      title: step.title || "",
      description: step.description || "",
      order: step.order || 0,
    };

    const isUpdate = !!step.id && step.id > 0;
    const url = isUpdate
      ? `http://localhost:8000/api/v1/process-steps/${step.id}`
      : "http://localhost:8000/api/v1/process-steps";

    const method = isUpdate ? "PUT" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      const responseData = text ? JSON.parse(text) : {};
      throw new Error(responseData.message || "Failed to save process step");
    }

    const responseData = await response.json();
    const savedStep = responseData.data?.process_step || responseData.process_step;

    // Update step with new ID if it was created
    if (!step.id || step.id < 0) {
      if (savedStep?.id) {
        setProcessSteps((prev) =>
          prev.map((s) => (s === step ? { ...s, id: savedStep.id, order: savedStep.order || s.order } : s))
        );
      }
    }
  };

  const handleDeleteBackgroundImage = async () => {
    if (!sectionId) {
      // Just remove from state if section doesn't exist
      setBackgroundImage(null);
      setBackgroundImageUrl(null);
      return;
    }

    if (!confirm("Are you sure you want to delete the background image?")) {
      return;
    }

    try {
      setDeletingBackground(true);
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Not authenticated. Please login again.");
        setDeletingBackground(false);
        return;
      }

      const url = `http://localhost:8000/api/v1/our-facts-section/${sectionId}/field/background_image`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const text = await response.text();
        const responseData = text ? JSON.parse(text) : {};
        throw new Error(responseData.message || "Failed to delete background image");
      }

      setBackgroundImage(null);
      setBackgroundImageUrl(null);
      await fetchSectionData();

      setSuccess("Background image deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error deleting background image:", err);
      setError(err.message || "Failed to delete background image");
      setTimeout(() => setError(""), 5000);
    } finally {
      setDeletingBackground(false);
    }
  };

  // Expose save method to parent component
  useImperativeHandle(ref, () => ({
    save: handleSave,
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading section data...</div>
      </div>
    );
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

      {/* Large Number Section */}
      <div className="space-y-4 pb-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Large Number Display</h3>
        <div>
          <label htmlFor="largeNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Large Number (e.g., "15+", "20+", "100+")
          </label>
          <input
            type="text"
            id="largeNumber"
            value={largeNumber}
            onChange={(e) => setLargeNumber(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
            placeholder="15+"
          />
        </div>
        <div>
          <label htmlFor="smallDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Small Description (tagline for the section)
          </label>
          <input
            type="text"
            id="smallDescription"
            value={smallDescription}
            onChange={(e) => setSmallDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
            placeholder="A short tagline or description for the section"
          />
        </div>
      </div>

      {/* Background Image Section */}
      <div className="space-y-4 pb-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Background Image</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <label className="inline-block">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleBackgroundImageChange}
              />
              <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block font-medium transition-colors text-sm">
                Choose File
              </span>
            </label>
            <span className="text-sm text-gray-600">
              {backgroundImage
                ? backgroundImage.name
                : backgroundImageUrl
                  ? "Existing image"
                  : "No file chosen"}
            </span>
          </div>
          {(backgroundImage || backgroundImageUrl) && (
            <div className="relative w-full h-32 border border-gray-300 rounded-lg overflow-hidden bg-gray-200 group">
              {backgroundImage ? (
                <Image
                  src={URL.createObjectURL(backgroundImage)}
                  alt="Background Preview"
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover"
                />
              ) : backgroundImageUrl ? (
                <img
                  src={
                    backgroundImageUrl.startsWith("http") || backgroundImageUrl.startsWith("/storage")
                      ? `http://localhost:8000${backgroundImageUrl}`
                      : backgroundImageUrl
                  }
                  alt="Background"
                  className="w-full h-full object-cover"
                />
              ) : null}
              {(backgroundImage || backgroundImageUrl) && (
                <button
                  onClick={handleDeleteBackgroundImage}
                  disabled={deletingBackground}
                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Remove background image"
                >
                  {deletingBackground ? (
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Our Facts Section */}
      <div className="space-y-6 pb-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Our Facts</h3>
          <button
            onClick={handleAddFact}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            + Add Fact
          </button>
        </div>

        <div>
          <label htmlFor="factsTitle" className="block text-sm font-medium text-gray-700 mb-2">
            Section Title
          </label>
          <input
            type="text"
            id="factsTitle"
            value={factsTitle}
            onChange={(e) => setFactsTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
            placeholder="Our Facts"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {facts.map((fact) => (
            <div
              key={fact.id}
              className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <h5 className="text-sm font-bold text-gray-900">FACT #{fact.order}</h5>
                <button
                  onClick={() => handleDeleteFact(fact.id)}
                  disabled={deletingFact === fact.id}
                  className="w-6 h-6 bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingFact === fact.id ? (
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Percentage
                  </label>
                  <input
                    type="text"
                    value={fact.percentage}
                    onChange={(e) => handleFactChange(fact.id, "percentage", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white text-sm"
                    placeholder="99%"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
                  <input
                    type="text"
                    value={fact.label}
                    onChange={(e) => handleFactChange(fact.id, "label", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white text-sm"
                    placeholder="Satisfaction Rate"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Promise Section */}
      <div className="space-y-4 pb-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Our Promise</h3>
        <div>
          <label htmlFor="promiseTitle" className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            id="promiseTitle"
            value={promiseTitle}
            onChange={(e) => setPromiseTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
            placeholder="Our Promise"
          />
        </div>
        <div>
          <label
            htmlFor="promiseDescription"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="promiseDescription"
            value={promiseDescription}
            onChange={(e) => setPromiseDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-gray-900 bg-white"
            placeholder="Enter promise description..."
          />
        </div>
      </div>

      {/* Process Steps Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Process Steps</h3>
          <button
            onClick={handleAddProcessStep}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            + Add Step
          </button>
        </div>

        <div className="space-y-4">
          {processSteps
            .sort((a, b) => a.order - b.order)
            .map((step) => (
              <div
                key={step.id}
                className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <h5 className="text-sm font-bold text-gray-900">STEP #{step.number}</h5>
                  <button
                    onClick={() => handleDeleteProcessStep(step.id)}
                    disabled={deletingStep === step.id}
                    className="w-6 h-6 bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingStep === step.id ? (
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Number</label>
                    <input
                      type="number"
                      value={step.number}
                      onChange={(e) =>
                        handleProcessStepChange(step.id, "number", parseInt(e.target.value) || 1)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white text-sm"
                      placeholder="1"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => handleProcessStepChange(step.id, "title", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white text-sm"
                      placeholder="Step Title"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Description
                    </label>
                    <textarea
                      value={step.description}
                      onChange={(e) =>
                        handleProcessStepChange(step.id, "description", e.target.value)
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-gray-900 bg-white text-sm"
                      placeholder="Step description..."
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
});

OurFactsEditor.displayName = "OurFactsEditor";

export default OurFactsEditor;

