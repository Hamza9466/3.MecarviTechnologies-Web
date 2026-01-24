"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Project } from "@/components/admin/projects/types";
import EditProjectForm from "@/components/admin/projects/EditProjectForm";

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id ? parseInt(params.id as string) : null;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
    }
  }, [projectId]);

  const fetchProject = async (id: number) => {
    try {
      setLoading(true);
      setError("");
      
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8000/api/v1/projects/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.project) {
          setProject(data.data.project);
        } else {
          setError("Project not found");
        }
      } else if (response.status === 404) {
        setError("Project not found");
      } else {
        setError("Failed to load project");
      }
    } catch (err: any) {
      console.error("Error fetching project:", err);
      setError(err.message || "Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="w-full px-6 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error || "Project not found"}</p>
          <button
            onClick={() => router.push("/admin/projects")}
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-gray-100 px-6 py-4 mb-4">
        <h1 className="text-xl font-semibold text-gray-900">Edit Project</h1>
      </div>
      <div className="px-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <EditProjectForm project={project} />
        </div>
      </div>
    </div>
  );
}

