"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { CreateProjectFormData } from "./types";
import RichTextEditor from "./RichTextEditor";

export default function CreateProjectForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateProjectFormData>({
    projectName: "",
    projectId: "",
    client: "",
    startDate: "",
    endDate: "",
    description: "",
    projectPreviewImage: null,
    status: "green",
    statusDot: "green",
    allHours: "",
    todayHours: "",
    completionPercentage: 0,
    tasksCompleted: 0,
    totalTasks: 0,
    commentsCount: 0,
    lastMeetingDate: "",
    lastMeetingStartTime: "",
    lastMeetingEndTime: "",
    nextMeetingDate: "",
    nextMeetingStartTime: "",
    nextMeetingEndTime: "",
    budget: "",
    categories: "",
    teamMembers: [],
    priorityStatus: "",
    projectManager: "",
    attachedFiles: [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateProjectFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const filesInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // When status changes, also update statusDot
      if (name === "status") {
        updated.statusDot = value as "green" | "orange" | "red";
      }
      return updated;
    });
    // Clear error when user starts typing
    if (errors[name as keyof CreateProjectFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prev) => ({ ...prev, teamMembers: selectedOptions }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, projectPreviewImage: e.target.files![0] }));
    }
  };

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFormData((prev) => ({ ...prev, attachedFiles: [...prev.attachedFiles, ...newFiles] }));
    }
  };

  const handleImageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImage(true);
  };

  const handleImageDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImage(false);
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImage(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0 && files[0].type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, projectPreviewImage: files[0] }));
    }
  };

  const handleFilesDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFiles(true);
  };

  const handleFilesDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFiles(false);
  };

  const handleFilesDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFiles(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setFormData((prev) => ({ ...prev, attachedFiles: [...prev.attachedFiles, ...newFiles] }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, projectPreviewImage: null }));
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachedFiles: prev.attachedFiles.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateProjectFormData, string>> = {};

    if (!formData.projectName.trim()) {
      newErrors.projectName = "Project Name is required";
    } else if (formData.projectName.trim().length < 3) {
      newErrors.projectName = "Project Name must be at least 3 characters";
    }

    if (!formData.projectId.trim()) {
      newErrors.projectId = "Project ID is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start Date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End Date is required";
    } else if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = "End Date must be after Start Date";
      }
    }

    if (!formData.client.trim()) {
      newErrors.client = "Client is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (formData.budget && isNaN(Number(formData.budget))) {
      newErrors.budget = "Budget must be a valid number";
    }

    if (formData.completionPercentage < 0 || formData.completionPercentage > 100) {
      newErrors.completionPercentage = "Completion percentage must be between 0 and 100";
    }

    if (formData.tasksCompleted < 0) {
      newErrors.tasksCompleted = "Tasks completed cannot be negative";
    }

    if (formData.totalTasks < 0) {
      newErrors.totalTasks = "Total tasks cannot be negative";
    }

    if (formData.tasksCompleted > formData.totalTasks && formData.totalTasks > 0) {
      newErrors.tasksCompleted = "Tasks completed cannot exceed total tasks";
    }

    if (formData.commentsCount < 0) {
      newErrors.commentsCount = "Comments count cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to create a project");
        setIsSubmitting(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("project_name", formData.projectName);
      formDataToSend.append("project_id", formData.projectId);
      formDataToSend.append("client", formData.client);
      formDataToSend.append("start_date", formData.startDate);
      formDataToSend.append("end_date", formData.endDate);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("status_dot", formData.statusDot);
      formDataToSend.append("all_hours", formData.allHours || "");
      formDataToSend.append("today_hours", formData.todayHours || "");
      formDataToSend.append("completion_percentage", formData.completionPercentage.toString());
      formDataToSend.append("tasks_completed", formData.tasksCompleted.toString());
      formDataToSend.append("total_tasks", formData.totalTasks.toString());
      formDataToSend.append("comments_count", formData.commentsCount.toString());
      formDataToSend.append("budget", formData.budget || "");
      formDataToSend.append("categories", formData.categories || "");
      formDataToSend.append("priority_status", formData.priorityStatus || "");
      formDataToSend.append("project_manager", formData.projectManager || "");

      // Append meeting data
      if (formData.lastMeetingDate) {
        formDataToSend.append("last_meeting_date", formData.lastMeetingDate);
        formDataToSend.append("last_meeting_start_time", formData.lastMeetingStartTime || "");
        formDataToSend.append("last_meeting_end_time", formData.lastMeetingEndTime || "");
      }

      if (formData.nextMeetingDate) {
        formDataToSend.append("next_meeting_date", formData.nextMeetingDate);
        formDataToSend.append("next_meeting_start_time", formData.nextMeetingStartTime || "");
        formDataToSend.append("next_meeting_end_time", formData.nextMeetingEndTime || "");
      }

      // Append team members as JSON array
      if (formData.teamMembers.length > 0) {
        formDataToSend.append("team_members", JSON.stringify(formData.teamMembers));
      }

      // Append preview image
      if (formData.projectPreviewImage) {
        formDataToSend.append("project_preview_image", formData.projectPreviewImage);
      }

      // Append attached files
      formData.attachedFiles.forEach((file, index) => {
        formDataToSend.append(`attached_files[${index}]`, file);
      });

      const response = await fetch("http://localhost:8000/api/v1/projects", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create project");
      }

      // Success - redirect to projects list
      router.push("/admin/projects");
    } catch (error: any) {
      console.error("Error creating project:", error);
      alert(error.message || "Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/projects");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Section - 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Project Name */}
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              value={formData.projectName}
              onChange={handleInputChange}
              placeholder="Write Project Name"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white ${
                errors.projectName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.projectName && <p className="mt-1 text-sm text-red-600">{errors.projectName}</p>}
          </div>

          {/* Project ID */}
          <div>
            <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-2">
              Project ID
            </label>
            <input
              type="text"
              id="projectId"
              name="projectId"
              value={formData.projectId}
              onChange={handleInputChange}
              placeholder="Write Project ID"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white ${
                errors.projectId ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.projectId && <p className="mt-1 text-sm text-red-600">{errors.projectId}</p>}
          </div>

          {/* Client */}
          <div>
            <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-2">
              Client
            </label>
            <input
              type="text"
              id="client"
              name="client"
              value={formData.client}
              onChange={handleInputChange}
              placeholder="Enter Client Name"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white ${
                errors.client ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.client && <p className="mt-1 text-sm text-red-600">{errors.client}</p>}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white ${
                  errors.startDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white ${
                  errors.endDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="green">Green</option>
              <option value="orange">Orange</option>
              <option value="red">Red</option>
            </select>
          </div>
        </div>
      </div>

      {/* Middle Section - Description and Image Upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <RichTextEditor
            value={formData.description}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, description: value }));
              if (errors.description) {
                setErrors((prev) => ({ ...prev, description: undefined }));
              }
            }}
            placeholder="Enter project description..."
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        {/* Project Preview Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Preview Image
          </label>
          <div
            onDragOver={handleImageDragOver}
            onDragLeave={handleImageDragLeave}
            onDrop={handleImageDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDraggingImage
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-gray-50"
            }`}
          >
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            {formData.projectPreviewImage ? (
              <div className="space-y-2">
                <img
                  src={URL.createObjectURL(formData.projectPreviewImage)}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded-lg"
                />
                <p className="text-sm text-gray-600">{formData.projectPreviewImage.name}</p>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <svg
                  className="w-12 h-12 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-600 mb-2">Drag and drop an image or</p>
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Browse
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hours and Progress Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          {/* All Hours */}
          <div>
            <label htmlFor="allHours" className="block text-sm font-medium text-gray-700 mb-2">
              All Hours (Format: "530 / 281:30")
            </label>
            <input
              type="text"
              id="allHours"
              name="allHours"
              value={formData.allHours}
              onChange={handleInputChange}
              placeholder="530 / 281:30"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>

          {/* Today Hours */}
          <div>
            <label htmlFor="todayHours" className="block text-sm font-medium text-gray-700 mb-2">
              Today Hours (Format: "2:45")
            </label>
            <input
              type="text"
              id="todayHours"
              name="todayHours"
              value={formData.todayHours}
              onChange={handleInputChange}
              placeholder="2:45"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>
        </div>

        <div className="space-y-4">
          {/* Completion Percentage */}
          <div>
            <label htmlFor="completionPercentage" className="block text-sm font-medium text-gray-700 mb-2">
              Completion Percentage
            </label>
            <input
              type="number"
              id="completionPercentage"
              name="completionPercentage"
              value={formData.completionPercentage}
              onChange={handleInputChange}
              min="0"
              max="100"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white ${
                errors.completionPercentage ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.completionPercentage && <p className="mt-1 text-sm text-red-600">{errors.completionPercentage}</p>}
          </div>

          {/* Tasks */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="tasksCompleted" className="block text-sm font-medium text-gray-700 mb-2">
                Tasks Completed
              </label>
              <input
                type="number"
                id="tasksCompleted"
                name="tasksCompleted"
                value={formData.tasksCompleted}
                onChange={handleInputChange}
                min="0"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white ${
                  errors.tasksCompleted ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.tasksCompleted && <p className="mt-1 text-sm text-red-600">{errors.tasksCompleted}</p>}
            </div>
            <div>
              <label htmlFor="totalTasks" className="block text-sm font-medium text-gray-700 mb-2">
                Total Tasks
              </label>
              <input
                type="number"
                id="totalTasks"
                name="totalTasks"
                value={formData.totalTasks}
                onChange={handleInputChange}
                min="0"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white ${
                  errors.totalTasks ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.totalTasks && <p className="mt-1 text-sm text-red-600">{errors.totalTasks}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Comments Count */}
      <div>
        <label htmlFor="commentsCount" className="block text-sm font-medium text-gray-700 mb-2">
          Comments Count
        </label>
        <input
          type="number"
          id="commentsCount"
          name="commentsCount"
          value={formData.commentsCount}
          onChange={handleInputChange}
          min="0"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white ${
            errors.commentsCount ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.commentsCount && <p className="mt-1 text-sm text-red-600">{errors.commentsCount}</p>}
      </div>

      {/* Meetings Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Last Meeting */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Last Meeting</h3>
          <div>
            <label htmlFor="lastMeetingDate" className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              id="lastMeetingDate"
              name="lastMeetingDate"
              value={formData.lastMeetingDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="lastMeetingStartTime" className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="time"
                id="lastMeetingStartTime"
                name="lastMeetingStartTime"
                value={formData.lastMeetingStartTime}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>
            <div>
              <label htmlFor="lastMeetingEndTime" className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="time"
                id="lastMeetingEndTime"
                name="lastMeetingEndTime"
                value={formData.lastMeetingEndTime}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Next Meeting */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Next Meeting</h3>
          <div>
            <label htmlFor="nextMeetingDate" className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              id="nextMeetingDate"
              name="nextMeetingDate"
              value={formData.nextMeetingDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="nextMeetingStartTime" className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="time"
                id="nextMeetingStartTime"
                name="nextMeetingStartTime"
                value={formData.nextMeetingStartTime}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>
            <div>
              <label htmlFor="nextMeetingEndTime" className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="time"
                id="nextMeetingEndTime"
                name="nextMeetingEndTime"
                value={formData.nextMeetingEndTime}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lower Section - 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Budget */}
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
              Budget
            </label>
            <input
              type="text"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              placeholder="Enter Budget"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white ${
                errors.budget ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.budget && <p className="mt-1 text-sm text-red-600">{errors.budget}</p>}
          </div>

          {/* Categories */}
          <div>
            <label htmlFor="categories" className="block text-sm font-medium text-gray-700 mb-2">
              Categories
            </label>
            <select
              id="categories"
              name="categories"
              value={formData.categories}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="">Select</option>
              <option value="web">Web Development</option>
              <option value="mobile">Mobile App</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Team Members - Multi-select */}
          <div>
            <label htmlFor="teamMembers" className="block text-sm font-medium text-gray-700 mb-2">
              Team Members
            </label>
            <select
              id="teamMembers"
              name="teamMembers"
              multiple
              value={formData.teamMembers}
              onChange={handleMultiSelectChange}
              size={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="member1">John Doe</option>
              <option value="member2">Jane Smith</option>
              <option value="member3">Bob Wilson</option>
              <option value="member4">Alice Brown</option>
              <option value="member5">Charlie Davis</option>
            </select>
            {formData.teamMembers.length > 0 && (
              <p className="mt-2 text-xs text-gray-500">
                {formData.teamMembers.length} member(s) selected
              </p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Priority Status */}
          <div>
            <label htmlFor="priorityStatus" className="block text-sm font-medium text-gray-700 mb-2">
              Priority Status
            </label>
            <select
              id="priorityStatus"
              name="priorityStatus"
              value={formData.priorityStatus}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="">Select</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Project Manager */}
          <div>
            <label htmlFor="projectManager" className="block text-sm font-medium text-gray-700 mb-2">
              Project Manager
            </label>
            <select
              id="projectManager"
              name="projectManager"
              value={formData.projectManager}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="">Select</option>
              <option value="manager1">Sarah Johnson</option>
              <option value="manager2">Mike Chen</option>
              <option value="manager3">Emily Rodriguez</option>
            </select>
          </div>

          {/* Attached Files */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attached Files
            </label>
            <div
              onDragOver={handleFilesDragOver}
              onDragLeave={handleFilesDragLeave}
              onDrop={handleFilesDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDraggingFiles
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              <input
                ref={filesInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
                onChange={handleFilesSelect}
                className="hidden"
              />
              <svg
                className="w-10 h-10 text-gray-400 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 mb-2 text-sm">Drag and drop files or</p>
              <button
                type="button"
                onClick={() => filesInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Browse
              </button>
            </div>

            {/* Display selected files */}
            {formData.attachedFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.attachedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white border border-gray-300 rounded-lg p-2"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <svg
                        className="w-4 h-4 text-gray-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="text-sm text-gray-700 truncate">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-600 hover:text-red-800 ml-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={handleCancel}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {isSubmitting ? "Creating..." : "Create Project"}
        </button>
      </div>
    </form>
  );
}

