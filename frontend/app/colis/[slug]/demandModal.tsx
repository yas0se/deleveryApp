"use client";
import { useState } from "react";
import { API_URL } from "@/app/constant/apiUrl";

// Corrected ReportModal Component
export const DemandModal = ({
  isOpen,
  onClose,
  colisId,
  userId,
}: {
  isOpen: boolean;
  onClose: () => void;
  colisId: number; // Now expecting colis ID as prop
  userId: number
}) => {
  const [offer, setOffer] = useState("");

  const handleReportSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}/demande/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add JWT token here
        },
        body: JSON.stringify({
          parcelId: colisId, // The ID of the colis being reported
          offer, 
        }),
      });
      console.log("Response: ", response);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Report error:", errorData);
        return;
      }

      console.log("Report submitted successfully.");
      onClose(); // Close the modal after submitting
    } catch (error) {
      console.error("Failed to submit the report:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-lg font-bold mb-4">Demande de livraison</h2>
        <div className="mb-4">
          <label htmlFor="reportReason" className="block text-sm font-medium text-gray-700">
            Donner un offre:
          </label>
          <input
            id="offer"
            type="number"
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
          </input>
        </div>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded"
            onClick={handleReportSubmit}
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
};
