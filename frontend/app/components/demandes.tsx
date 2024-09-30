/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { API_URL } from "../constant/apiUrl";

interface Demandes {
  id: number;
  status: string; // "pending", "accepted", "rejected"
  offer: number;
  parcelId: number;
  createdAt: string; // Assuming it's a date string
  userId: number;
}

const Demandes = ({
  colisId,
  demanded,
  isColisOner
}: {
  colisId: number; // Now expecting colis ID as prop
  demanded: boolean;
  isColisOner: boolean;
}) => {
  const [demandes, setDemandes] = useState<Demandes[]>([]); // Specify Demandes array type
  const [loading, setLoading] = useState<boolean>(true); // To handle loading state
  const [error, setError] = useState<string | null>(null); // To handle errors

  const getData = async () => {
    console.log("get data start: ")
    try {
      const response = await fetch(`${API_URL}/demande/parcel/${colisId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError(`Error: ${errorData.error}`); // Adjusted to match backend response
        return;
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setDemandes(data); // Set the demandes state
      } else {
        setError("Unexpected response format.");
      }
    } catch (error) {
      console.error("Error in:", error);
      setError("Failed to get demandes. Please try again.");
    } finally {
      setLoading(false); // Always set loading to false after fetching
    }
  };

  const getDataDemanded = async () => {
    console.log("Fetching data and filtering accepted demandes...");

    try {
      const response = await fetch(`${API_URL}/demande/parcel/${colisId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Error: ${errorData.error}`);
        return;
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        const acceptedDemandes = data.filter((demande: Demandes) => demande.status === "accepted");
        setDemandes(acceptedDemandes); // Set state with only accepted demandes
        console.log("Demandes...: ", demandes);

      } else {
        setError("Unexpected response format.");
      }
    } catch (error) {
      console.error("Error in getDataDemanded:", error);
      setError("Failed to get accepted demande. Please try again.");
    } finally {
      setLoading(false); // Always set loading to false after fetching
    }
  };

  useEffect(() => {
    if (!demanded) {
      getData();
    } else {
      getDataDemanded();
    }
  }, []);

  useEffect(() => {
    if (demanded) {
      getDataDemanded(); // Fetch and filter only accepted demandes
    } else {
      getData(); // Fetch all demandes if not demanded
    }
  }, [colisId]);  // Add colisId as a dependency so data refetches when it changes

  if (loading) {
    return <div>Loading...</div>; // Display a loading message 
  }

  if (error) {
    return <div>No demandes yet</div>; // Display the message
  }

  if (demanded) {
    return <div className="font-sans max-w-6xl max-lg:max-w-4xl mx-auto bg-gray-50 p-8">
      <div className="grid gap-12">
        <div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Demande Accepted</h2>
            <div className="space-y-6">
              {demandes.map((demande) => (
                <div key={demande.id} className="p-6 bg-gray-100 rounded-md shadow-md">
                  <div className="grid sm:grid-cols-3 items-start md:gap-4">
                    <div className="col-span-2 flex items-start gap-4">
                      <div className="flex flex-col">
                        <h3 className="text-sm text-center font-semibold text-gray-700">
                          Date: {new Date(demande.createdAt).toLocaleDateString()}
                        </h3>
                      </div>
                    </div>
                    <div className="ml-auto flex flex-col items-end">
                      <h4 className="text-2xl font-bold text-gray-700">
                        {demande.offer} DH
                      </h4>
                      <a
                        className="mt-4 inline-block px-4 py-2 bg-green-500 hover:bg-green-700 text-white text-sm font-semibold rounded-md shadow-md transition duration-300"
                      >
                        Accepted
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  }

  const handleAcceptDemande = async (demandeId: number) => {
    try {
      const response = await fetch(`${API_URL}/demande/update-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add JWT token
        },
        body: JSON.stringify({
          id: demandeId,
          status: "accepted",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Demande error:", errorData);
        return;
      }

      console.log("Demande accepted successfully.");
      // Optionally, refresh the data after acceptance
      getData();
      window.location.reload();
    } catch (error) {
      console.error("Failed to accept demande:", error);
    }
  };

  return (
    <div className="font-sans max-w-6xl max-lg:max-w-4xl mx-auto bg-gray-50 p-8">
      <div className="grid gap-12">
        <div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Demandes</h2>
            <div className="space-y-6">
              {demandes.map((demande) => (
                <div key={demande.id} className="p-6 bg-gray-100 rounded-md shadow-md">
                  <div className="grid grid-cols-3 items-start gap-4">
                    <div className="col-span-2 flex items-start gap-4">
                      <div className="flex flex-col">
                        <h3 className="text-sm font-semibold text-gray-700">
                          Date: {new Date(demande.createdAt).toLocaleDateString()}
                        </h3>
                      </div>
                    </div>
                    <div className="ml-auto flex flex-col items-end">
                      <h4 className="text-2xl font-bold text-gray-700">
                        {demande.offer} DH
                      </h4>
                      {isColisOner ? (
                        <button
                          type="button"
                          onClick={() => handleAcceptDemande(demande.id)}
                          className="mt-4 inline-block px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white text-sm font-semibold rounded-md shadow-md transition duration-300"
                        >
                          Accept
                        </button>
                      ) : (
                        <button
                          className="mt-4 inline-block px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white text-sm font-semibold rounded-md shadow-md transition duration-300"
                        >
                          Pending
                        </button>
                      )}

                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default Demandes;
