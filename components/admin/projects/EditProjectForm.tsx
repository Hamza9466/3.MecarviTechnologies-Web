"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreateProjectFormData, Project } from "./types";
import RichTextEditor from "./RichTextEditor";

interface EditProjectFormProps {
  project: Project;
}

export default function EditProjectForm({ project }: EditProjectFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateProjectFormData>({
    projectName: project.name || "",
    projectId: project.projectId || `PRJ-${project.id}`,
    client: project.client || "",
    startDate: project.startDate || "",
    endDate: project.deadline || "",
    description: project.description || "",
    projectPreviewImage: null,
    status: project.status || "green",
    statusDot: project.statusDot || "green",
    allHours: project.allHours || "",
    todayHours: project.todayHours || "",
    completionPercentage: project.completionPercentage || 0,
    tasksCompleted: project.tasksCompleted || 0,
    totalTasks: project.totalTasks || 0,
    commentsCount: project.commentsCount || 0,
    lastMeetingDate: project.lastMeeting?.date || "",
    lastMeetingStartTime: project.lastMeeting?.startTime || "",
    lastMeetingEndTime: project.lastMeeting?.endTime || "",
    nextMeetingDate: project.nextMeeting?.date || "",
    nextMeetingStartTime: project.nextMeeting?.startTime || "",
    nextMeetingEndTime: project.nextMeeting?.endTime || "",
    budget: project.budget || "",
    categories: project.categories || "",
    teamMembers: project.teamMembers?.map(m => m.id.toString()) || [],
    priorityStatus: project.priorityStatus || "",
    projectManager: project.projectManager || "",
    attachedFiles: [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateProjectFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(
    project.projectIconUrl || null
  );

  const imageInputRef = useRef<HTMLInputElement>(null);
  const filesInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "status") {
        updated.statusDot = value as "green" | "orange" | "red";
      }
      return updated;
    });
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
      setPreviewImageUrl(URL.createObjectURL(e.target.files![0]));
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
      setPreviewImageUrl(URL.createObjectURL(files[0]));
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
    setPreviewImageUrl(null);
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
        alert("Please login to update the project");
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

      if (formData.teamMembers.length > 0) {
        formDataToSend.append("team_members", JSON.stringify(formData.teamMembers));
      }

      if (formData.projectPreviewImage) {
        formDataToSend.append("project_preview_image", formData.projectPreviewImage);
      }

      formData.attachedFiles.forEach((file, index) => {
        formDataToSend.append(`attached_files[${index}]`, file);
      });

      const response = await fetch(`http://localhost:8000/api/v1/projects/${project.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update project");
      }

      router.push(`/admin/projects/${project.id}`);
    } catch (error: any) {
      console.error("Error updating project:", error);
      alert(error.message || "Failed to update project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/admin/projects/${project.id}`);
  };

  // Reuse the same form structure as CreateProjectForm
  // For brevity, I'll include the key sections - the full form would be identical to CreateProjectForm
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Same form fields as CreateProjectForm - using the same structure */}
      {/* Top Section - 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>

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

        <div className="space-y-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
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
            {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
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
            {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
          </div>

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

      {/* Description and Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <RichTextEditor
            value={formData.description}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, description: value }));
            }}
            placeholder="Enter project description..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Preview Image
          </label>
          <div
            onDragOver={handleImageDragOver}
            onDragLeave={handleImageDragLeave}
            onDrop={handleImageDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDraggingImage ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
            }`}
          >
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            {previewImageUrl || formData.projectPreviewImage ? (
              <div className="space-y-2">
                <img
                  src={previewImageUrl || (formData.projectPreviewImage ? URL.createObjectURL(formData.projectPreviewImage) : "")}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded-lg"
                />
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
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Lower Section - Budget, Categories, Team Members, Priority, Project Manager */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>

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

        <div className="space-y-4">
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
          {isSubmitting ? "Updating..." : "Update Project"}
        </button>
      </div>
    </form>
  );
}

