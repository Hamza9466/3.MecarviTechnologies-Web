"use client";

import { useState, useEffect } from "react";

interface JobSection {
    id: number;
    section_title: string;
    section_description: string;
    title: string;
    description: string;
    employment_type: string;
    experience_required: string;
    company_name: string;
    image: string | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

interface Job {
    id: number;
    title: string;
    description: string;
    type: string;
    company: string;
    experience: string;
    imageUrl: string | null;
    image: File | null;
}

export const useJobSections = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [jobsSectionTitle, setJobsSectionTitle] = useState("Job Opportunities");
    const [jobsSectionDescription, setJobsSectionDescription] = useState("Explore exciting career opportunities with our team");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchJobSections();
    }, []);

    const fetchJobSections = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:8000/api/v1/job-sections", {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data?.job_sections) {
                    const jobSections = data.data.job_sections;

                    // Convert job sections to the existing job format
                    const convertedJobs: Job[] = jobSections.map((section: JobSection) => ({
                        id: section.id,
                        title: section.title,
                        description: section.description,
                        type: section.employment_type || "Full Time",
                        company: section.company_name || "House of Code",
                        experience: section.experience_required || "2 Years",
                        imageUrl: section.image,
                        image: null,
                    }));

                    setJobs(convertedJobs);

                    // Set section title and description from first job section if available
                    if (jobSections.length > 0) {
                        setJobsSectionTitle(jobSections[0].section_title);
                        setJobsSectionDescription(jobSections[0].section_description);
                    }
                }
            } else {
                throw new Error("Failed to fetch job sections");
            }
        } catch (err) {
            console.error("Error fetching job sections:", err);
            setError("Failed to load job sections");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveJobSection = async (jobData: any) => {
        console.log("handleSaveJobSection called with:", jobData);
        try {
            setLoading(true);
            setError("");
            setSuccess("");
            const token = localStorage.getItem("token");

            console.log("Token found:", !!token);

            // Validate required fields
            if (!jobData.title || !jobData.title.trim()) {
                setError("Title is required");
                return;
            }

            // Validate image size if present
            if (jobData.image && jobData.image.size > 2048 * 1024) {
                setError("Image size must not be greater than 2MB");
                return;
            }

            // Prepare data as JSON first (without image)
            const jsonData = {
                section_title: jobsSectionTitle,
                section_description: jobsSectionDescription,
                title: jobData.title,
                description: jobData.description || "",
                employment_type: jobData.type || "Full Time",
                experience_required: jobData.experience || "2 Years",
                company_name: jobData.company || "House of Code",
                is_active: jobData.is_active !== undefined ? jobData.is_active : true,
                sort_order: jobs.length + 1,
            };

            console.log("JSON data prepared:", jsonData);

            let response;

            if (jobData.image) {
                // If there's an image, use FormData
                const formData = new FormData();
                Object.keys(jsonData).forEach(key => {
                    formData.append(key, jsonData[key as keyof typeof jsonData].toString());
                });
                formData.append("image", jobData.image);

                console.log("FormData prepared, making API call with image...");
                response = await fetch("http://localhost:8000/api/v1/job-sections", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                    body: formData,
                });
            } else {
                // If no image, use JSON
                console.log("JSON prepared, making API call without image...");
                response = await fetch("http://localhost:8000/api/v1/job-sections", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                    body: JSON.stringify(jsonData),
                });
            }

            console.log("API response status:", response.status);

            if (response.ok) {
                const responseData = await response.json();
                if (responseData.success) {
                    setSuccess("Job section created successfully!");
                    setTimeout(() => setSuccess(""), 3000);
                    fetchJobSections();
                } else {
                    throw new Error(responseData.message || "Failed to create job section");
                }
            } else {
                const errorText = await response.text();
                throw new Error(`Failed to create job section: ${errorText}`);
            }
        } catch (err) {
            console.error("Error creating job section:", err);
            setError(err instanceof Error ? err.message : "Failed to create job section");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateJobSection = async (jobId: number, jobData: any) => {
        console.log("handleUpdateJobSection called with:", jobId, jobData);
        try {
            setLoading(true);
            setError("");
            setSuccess("");
            const token = localStorage.getItem("token");

            console.log("Token found:", !!token);

            // Validate required fields
            if (!jobData.title || !jobData.title.trim()) {
                setError("Title is required");
                return;
            }

            // Prepare data as JSON first (without image)
            const jsonData = {
                section_title: jobsSectionTitle,
                section_description: jobsSectionDescription,
                title: jobData.title,
                description: jobData.description || "",
                employment_type: jobData.type || "Full Time",
                experience_required: jobData.experience || "2 Years",
                company_name: jobData.company || "House of Code",
                is_active: jobData.is_active !== undefined ? jobData.is_active : true,
                sort_order: jobData.sort_order || 1,
            };

            console.log("JSON data prepared for update:", jsonData);

            let response;

            if (jobData.image) {
                // If there's an image, use FormData but convert is_active properly
                const formData = new FormData();
                Object.keys(jsonData).forEach(key => {
                    if (key === 'is_active') {
                        formData.append(key, jsonData[key as keyof typeof jsonData] ? '1' : '0');
                    } else {
                        formData.append(key, jsonData[key as keyof typeof jsonData].toString());
                    }
                });
                formData.append("image", jobData.image);
                formData.append("_method", "PUT");

                console.log("FormData prepared for update with image, making API call...");
                response = await fetch(`http://localhost:8000/api/v1/job-sections/${jobId}`, {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                    body: formData,
                });
            } else {
                // If no image, use JSON
                console.log("JSON prepared for update, making API call without image...");
                response = await fetch(`http://localhost:8000/api/v1/job-sections/${jobId}`, {
                    method: "PUT",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                    body: JSON.stringify(jsonData),
                });
            }

            console.log("API response status:", response.status);

            if (response.ok) {
                const responseData = await response.json();
                if (responseData.success) {
                    setSuccess("Job section updated successfully!");
                    setTimeout(() => setSuccess(""), 3000);
                    fetchJobSections();
                } else {
                    throw new Error(responseData.message || "Failed to update job section");
                }
            } else {
                const errorText = await response.text();
                throw new Error(`Failed to update job section: ${errorText}`);
            }
        } catch (err) {
            console.error("Error updating job section:", err);
            setError(err instanceof Error ? err.message : "Failed to update job section");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteJobSection = async (jobId: number) => {
        if (!confirm("Are you sure you want to delete this job section?")) {
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");
            const token = localStorage.getItem("token");

            const response = await fetch(`http://localhost:8000/api/v1/job-sections/${jobId}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            if (response.ok) {
                const responseData = await response.json();
                if (responseData.success) {
                    setSuccess("Job section deleted successfully!");
                    setTimeout(() => setSuccess(""), 3000);
                    fetchJobSections();
                } else {
                    throw new Error(responseData.message || "Failed to delete job section");
                }
            } else {
                throw new Error("Failed to delete job section");
            }
        } catch (err) {
            console.error("Error deleting job section:", err);
            setError(err instanceof Error ? err.message : "Failed to delete job section");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteJobImage = async (jobId: number) => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");
            const token = localStorage.getItem("token");

            console.log("Deleting image for job:", jobId);

            const response = await fetch(`http://localhost:8000/api/v1/job-sections/${jobId}/field/image`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            console.log("Delete image response status:", response.status);

            if (response.ok) {
                const responseData = await response.json();
                if (responseData.success) {
                    setSuccess("Image deleted successfully!");
                    setTimeout(() => setSuccess(""), 3000);
                    fetchJobSections();
                } else {
                    throw new Error(responseData.message || "Failed to delete image");
                }
            } else {
                throw new Error("Failed to delete image");
            }
        } catch (err) {
            console.error("Error deleting image:", err);
            setError(err instanceof Error ? err.message : "Failed to delete image");
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (jobId: number, file: File | null) => {
        setJobs((prev) =>
            prev.map((job) =>
                job.id === jobId ? { ...job, image: file } : job
            )
        );
    };

    return {
        jobs,
        jobsSectionTitle,
        jobsSectionDescription,
        setJobsSectionTitle,
        setJobsSectionDescription,
        loading,
        success,
        error,
        handleSaveJobSection,
        handleUpdateJobSection,
        handleDeleteJobSection,
        handleDeleteJobImage,
        handleImageChange,
        fetchJobSections,
    };
};
