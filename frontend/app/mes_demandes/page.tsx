/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { API_URL } from "../constant/apiUrl";
import verifyToken from "@/app/constant/userId"
import verifyTokenFunction from "@/app/constant/verifyTokenFunction";
import { redirect } from "next/navigation";

interface Demandes {
  id: number;
  status: string; // "pending", "accepted", "rejected"
  offer: number;
  parcelId: number;
  createdAt: string; // Assuming it's a date string
  userId: number;
}

const Demandes = ({ }: {}) => {
  const [demandes, setDemandes] = useState<Demandes[]>([]); // Specify Demandes array type
  const [loading, setLoading] = useState<boolean>(true); // To handle loading state
  const [error, setError] = useState<string | null>(null); // To handle errors

  const getData = async () => {
    console.log("get data start: ")
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const verifiedUser: any = verifyToken(token);
        const userId = verifiedUser.id
        const response = await fetch(`${API_URL}/demande/user/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
      }
    } catch (error) {
      console.error("Error in:", error);
      setError("Failed to get demandes. Please try again.");
    } finally {
      setLoading(false); // Always set loading to false after fetching
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!verifyTokenFunction(token)) {
      redirect("/login")
    }
    getData();

  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display a loading message 
  }

  if (error) {
    return <div>No demandes yet</div>; // Display the message
  }

  return (
    <div className="font-sans max-w-6xl max-lg:max-w-4xl mx-auto bg-gray-50 p-8">
      <div className="grid  gap-12">
        <div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Mes Demandes</h2>
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

                      <div><button
                        className="mr-4 mt-4 inline-block px-4 py-2 bg-gray-700 hover:bg-gray-900 text-white text-sm font-semibold rounded-md shadow-md transition duration-300"
                      >
                        {demande.status}
                      </button>
                      <a
                        href={`/colis/${demande.parcelId}`}
                        className="mt-4 inline-block px-4 py-2 bg-purple-500 hover:bg-purple-700 text-white text-sm font-semibold rounded-md shadow-md transition duration-300"
                      >
                        Colis info
                      </a></div>

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
