import { useState, useEffect } from "react";
import { Deal, DealsResponse } from "./types";

// Mock data matching the design
const getMockDeals = (): Deal[] => {
  const companies = [
    "Alpha Tech Solutions",
    "Beta Industries",
    "Gamma Corp",
    "Delta Systems",
    "Epsilon Enterprises",
    "Zeta Technologies",
    "Eta Solutions",
    "Theta Corp",
    "Iota Industries",
    "Kappa Systems",
    "Lambda Tech",
    "Mu Enterprises",
    "Nu Solutions",
    "Xi Corp",
    "Omicron Industries",
    "Pi Technologies",
    "Rho Systems",
    "Sigma Solutions",
    "Tau Corp",
    "Upsilon Industries",
    "Phi Technologies",
    "Chi Systems",
    "Psi Solutions",
    "Omega Corp",
  ];

  const tags = [
    "TechCorp Ltd",
    "Innovate Inc",
    "Digital Solutions",
    "Cloud Services",
    "Data Systems",
    "Web Technologies",
    "Mobile Apps",
    "Enterprise Solutions",
  ];

  const stages: Deal["stage"][] = [
    "leads_discovered",
    "qualified_leads",
    "contact_initiated",
    "needs_identified",
    "negotiation",
    "deal_finalized",
  ];

  const deals: Deal[] = [];
  const stageCounts = [24, 17, 6, 33, 22, 53]; // Matching design counts

  let dealId = 1;
  stages.forEach((stage, stageIndex) => {
    for (let i = 0; i < stageCounts[stageIndex]; i++) {
      const companyIndex = (dealId - 1) % companies.length;
      const tagIndex = (dealId - 1) % tags.length;
      const amount = Math.floor(Math.random() * 200000) + 10000; // $10k - $210k
      const daysAgo = Math.floor(Math.random() * 90); // Random date within last 90 days
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);

      deals.push({
        id: dealId++,
        companyName: companies[companyIndex],
        amount,
        date: date.toISOString(),
        stage,
        tag: tags[tagIndex],
        assignedUser: {
          id: dealId % 10,
          name: `User ${dealId % 10}`,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${dealId}`,
        },
        createdAt: date.toISOString(),
        updatedAt: date.toISOString(),
      });
    }
  });

  return deals;
};

export function useDeals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () => {
    return localStorage.getItem("token") || "";
  };

  const fetchDeals = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();
      const headers: HeadersInit = {
        Accept: "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("http://localhost:8000/api/v1/deals", {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log("⚠️ Deals endpoint not available yet (404) - using mock data");
          const mockDeals = getMockDeals();
          setDeals(mockDeals);
          setLoading(false);
          return;
        }
        throw new Error(`Failed to fetch deals: ${response.statusText}`);
      }

      const data: DealsResponse = await response.json();

      if (data.success && data.data?.deals) {
        setDeals(data.data.deals);
        console.log(`✅ Loaded ${data.data.deals.length} deals`);
      } else {
        setDeals([]);
      }
    } catch (err: any) {
      console.error("Error fetching deals:", err);
      // Handle network errors gracefully - use mock data for frontend development
      if (err.message?.includes("Failed to fetch") || err.message?.includes("NetworkError")) {
        console.log("⚠️ Backend not available - using mock data for frontend development");
        const mockDeals = getMockDeals();
        setDeals(mockDeals);
        setError(""); // Don't show error for network issues during frontend development
      } else {
        setError(err.message || "Failed to fetch deals");
        setDeals([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  return {
    deals,
    loading,
    error,
    refetch: fetchDeals,
  };
}
