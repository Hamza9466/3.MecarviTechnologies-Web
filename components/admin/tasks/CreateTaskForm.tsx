"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { CreateTaskFormData, Task } from "./types";
import { useProjects } from "@/components/admin/projects/useProjects";
import RichTextEditor from "@/components/admin/projects/RichTextEditor";

interface CreateTaskFormProps {
  task?: Task | null;
}

export default function CreateTaskForm({ task }: CreateTaskFormProps) {
  const router = useRouter();
  const { projects } = useProjects();
  const isEdit = !!task;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CreateTaskFormData & {
    location?: string;
    client?: string;
    startDate?: string;
    assignedToMulti?: number[];
    tagsMulti?: string[];
    attachments?: File[];
  }>({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "in_progress",
    priority: task?.priority || "high",
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
    projectId: task?.projectId?.toString() || "",
    assignedTo: task?.assignedTo?.toString() || "",
    tags: task?.tags || [],
    location: "",
    client: "",
    startDate: task?.startDate ? new Date(task.startDate).toISOString().split("T")[0] : "",
    assignedToMulti: task?.assignedTo ? [task.assignedTo] : [],
    tagsMulti: task?.tags || [],
    attachments: [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateTaskFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Mock users for assignment
  const users = [
    { id: 1, name: "Alexa Bliss" },
    { id: 2, name: "Alex Carey" },
    { id: 3, name: "Angelina May" },
    { id: 4, name: "John Doe" },
    { id: 5, name: "Jane Smith" },
  ];

  // Mock tags
  const availableTags = ["Marketing", "Sales", "Development", "Design", "Research", "Testing", "Documentation"];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CreateTaskFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleMultiSelect = (field: "assignedToMulti" | "tagsMulti", value: number | string) => {
    setFormData((prev) => {
      const current = prev[field] || [];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter((item) => item !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const removeMultiSelectItem = (field: "assignedToMulti" | "tagsMulti", value: number | string) => {
    setFormData((prev) => {
      const current = prev[field] || [];
      return { ...prev, [field]: current.filter((item) => item !== value) };
    });
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      setFormData((prev) => ({
        ...prev,
        attachments: [...(prev.attachments || []), ...Array.from(files)],
      }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index) || [],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateTaskFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
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
        alert("Please login to create a task");
        setIsSubmitting(false);
        return;
      }

      // Convert multi-select to single values for API
      const assignedToValue = formData.assignedToMulti && formData.assignedToMulti.length > 0
        ? formData.assignedToMulti[0].toString()
        : formData.assignedTo;

      const payload = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        due_date: formData.dueDate || null,
        start_date: formData.startDate || null,
        project_id: formData.projectId ? parseInt(formData.projectId) : null,
        assigned_to: assignedToValue ? parseInt(assignedToValue) : null,
        tags: formData.tagsMulti || formData.tags || [],
      };

      const url = isEdit
        ? `http://localhost:8000/api/v1/tasks/${task.id}`
        : "http://localhost:8000/api/v1/tasks";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to ${isEdit ? "update" : "create"} task`);
      }

      router.push("/admin/tasks");
    } catch (error: any) {
      console.error(`Error ${isEdit ? "updating" : "creating"} task:`, error);
      alert(error.message || `Failed to ${isEdit ? "update" : "create"} task. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isEdit) {
      router.push(`/admin/tasks/${task.id}`);
    } else {
      router.push("/admin/tasks");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Project Details Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
          >
            <option value="">Enter Project Name (drop down option)</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id.toString()}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-2">
            client
          </label>
          <select
            id="client"
            name="client"
            value={formData.client}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
          >
            <option value="">Project Manager Name (drop down option)</option>
            {users.map((user) => (
              <option key={user.id} value={user.id.toString()}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-2">
            Project
          </label>
          <select
            id="projectId"
            name="projectId"
            value={formData.projectId}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
          >
            <option value="">Enter Client Name (drop down option)</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id.toString()}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Title Field */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter task title"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      {/* Task Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Task Description
        </label>
        <RichTextEditor
          value={formData.description}
          onChange={(value) => {
            setFormData((prev) => ({ ...prev, description: value }));
          }}
          placeholder="Enter task description..."
        />
      </div>

      {/* Dates Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
            Start Date :
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={formData.startDate ? new Date(formData.startDate).toISOString().slice(0, 16) : ""}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, startDate: e.target.value }));
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white pr-10"
              placeholder="Choose date and time"
            />
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
            End Date :
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate ? new Date(formData.dueDate).toISOString().slice(0, 16) : ""}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, dueDate: e.target.value }));
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white pr-10"
              placeholder="Choose date and time"
            />
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Status and Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status :
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
          >
            <option value="new">New</option>
            <option value="todo">To Do</option>
            <option value="in_progress">Inprogress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
            Priority :
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Assigned To Multi-Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assigned To
        </label>
        <div className="min-h-[44px] px-4 py-2 border border-gray-300 rounded-lg bg-white flex flex-wrap gap-2 items-center">
          {formData.assignedToMulti?.map((userId) => {
            const user = users.find((u) => u.id === userId);
            return user ? (
              <span
                key={userId}
                className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded-full text-sm"
              >
                {user.name}
                <button
                  type="button"
                  onClick={() => removeMultiSelectItem("assignedToMulti", userId)}
                  className="hover:text-gray-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            ) : null;
          })}
          <select
            onChange={(e) => {
              if (e.target.value) {
                handleMultiSelect("assignedToMulti", parseInt(e.target.value));
                e.target.value = "";
              }
            }}
            className="flex-1 min-w-[120px] border-0 focus:outline-none text-gray-900 bg-transparent"
          >
            <option value="">Select user...</option>
            {users
              .filter((user) => !formData.assignedToMulti?.includes(user.id))
              .map((user) => (
                <option key={user.id} value={user.id.toString()}>
                  {user.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Tags Multi-Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="min-h-[44px] px-4 py-2 border border-gray-300 rounded-lg bg-white flex flex-wrap gap-2 items-center">
          {formData.tagsMulti?.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeMultiSelectItem("tagsMulti", tag)}
                className="hover:text-gray-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          ))}
          <select
            onChange={(e) => {
              if (e.target.value) {
                handleMultiSelect("tagsMulti", e.target.value);
                e.target.value = "";
              }
            }}
            className="flex-1 min-w-[120px] border-0 focus:outline-none text-gray-900 bg-transparent"
          >
            <option value="">Select tag...</option>
            {availableTags
              .filter((tag) => !formData.tagsMulti?.includes(tag))
              .map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Attachments */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Attachments
        </label>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? "border-purple-500 bg-purple-50" : "border-gray-300 bg-gray-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          <p className="text-gray-600 mb-2">
            Drag & Drop your files or{" "}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-purple-600 hover:text-purple-700 underline"
            >
              Browse
            </button>
          </p>
          {formData.attachments && formData.attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {formData.attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={handleCancel}
          className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (isEdit ? "Updating..." : "Creating...") : isEdit ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  );
}
