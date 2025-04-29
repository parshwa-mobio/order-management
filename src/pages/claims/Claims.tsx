import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Claim {
  id: string;
  orderId: string;
  reason: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  attachments?: string[];
}

const Claims = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [newClaim, setNewClaim] = useState({
    orderId: "",
    reason: "",
    description: "",
    attachments: [] as File[],
  });

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/claims", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setClaims(data);
        }
      } catch (error) {
        toast.error("Failed to fetch claims");
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("orderId", newClaim.orderId);
      formData.append("reason", newClaim.reason);
      formData.append("description", newClaim.description);
      newClaim.attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      const response = await fetch("http://localhost:5000/api/claims", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const createdClaim = await response.json();
        setClaims((prev) => [createdClaim, ...prev]);
        setNewClaim({
          orderId: "",
          reason: "",
          description: "",
          attachments: [],
        });
        toast.success("Claim submitted successfully");
      }
    } catch (error) {
      toast.error("Failed to submit claim");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewClaim((prev) => ({
        ...prev,
        attachments: Array.from(e.target.files || []),
      }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Claims Management</h1>

      {/* New Claim Form */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Submit New Claim</h2>
        <form onSubmit={handleSubmitClaim} className="space-y-4">
          <div>
            <label className="block mb-1">Order ID</label>
            <input
              type="text"
              value={newClaim.orderId}
              onChange={(e) =>
                setNewClaim({ ...newClaim, orderId: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Reason</label>
            <input
              type="text"
              value={newClaim.reason}
              onChange={(e) =>
                setNewClaim({ ...newClaim, reason: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Description</label>
            <textarea
              value={newClaim.description}
              onChange={(e) =>
                setNewClaim({ ...newClaim, description: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
              rows={4}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Attachments</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full border rounded px-3 py-2"
              multiple
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Claim
          </button>
        </form>
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {claims.length === 0 ? (
          <p className="text-gray-500">No claims found.</p>
        ) : (
          claims.map((claim) => (
            <div
              key={claim.id}
              className="bg-white p-4 rounded-lg shadow border border-gray-200"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">Order ID: {claim.orderId}</p>
                  <p className="text-sm text-gray-500">
                    Submitted: {new Date(claim.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-sm ${getStatusColor(
                    claim.status,
                  )}`}
                >
                  {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                </span>
              </div>
              <div className="mb-2">
                <p className="font-medium">Reason:</p>
                <p>{claim.reason}</p>
              </div>
              <div>
                <p className="font-medium">Description:</p>
                <p className="text-gray-700">{claim.description}</p>
              </div>
              {claim.attachments && claim.attachments.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium">Attachments:</p>
                  <div className="flex gap-2 mt-1">
                    {claim.attachments.map((attachment, index) => (
                      <a
                        key={index}
                        href={attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Attachment {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Claims;
