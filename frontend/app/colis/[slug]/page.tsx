/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { API_URL } from "@/app/constant/apiUrl";
import { useEffect, useState } from "react";
import { ReportModal } from "./reportModal"
import Demandes from "@/app/components/demandes";
import { DemandModal } from "./demandModal";
import verifyToken from "@/app/constant/userId"
import verifyTokenFunction from "@/app/constant/verifyTokenFunction";
import { redirect } from "next/navigation";


interface Colis {
  id: number;
  description: string;
  imageUrl: string;
  weight: number;
  price: number;
  origin: string;
  destination: string;
  userId: number;
  demanded: boolean;
}
interface User {
  id: number;
  firstName: string;
  lastName: string;
  isAdmine: boolean;
  email: string;
  password: string;
  phone: string;
}
export default function Page({ params }: { params: { slug: string } }) {
  const [colis, setColis] = useState<Colis | null>(null); // Colis object or null
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error handling
  const [activeTab, setActiveTab] = useState<"description" | "demande">("description");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDemandOpen, setIsModalDemandOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isColisOner, setIsColisOner] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(!verifyTokenFunction(token)){
      redirect("/colis")
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get the token from localStorage
    console.log("token: ", token)
    if (token) {
      const verifiedUser: any = verifyToken(token); // Call the verifyToken function
      setUser(verifiedUser);
      console.log("verifiedUser: ", verifiedUser.id)
      if (colis) { // Check if colis is not null
        setIsColisOner(verifiedUser.id === colis.userId);
      }
    } else {
      console.error("No token found");
    }
  }, [colis]);

  useEffect(() => {
    if (colis && user) {
      setIsColisOner(user.id === colis.userId);
      console.log("isColisOner: ", isColisOner);
    }
  }, [colis, user]);
  useEffect(() => {
    console.log("Updated user: ", user);
  }, [user]);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModalDemand = () => {
    setIsModalDemandOpen(true);
  };

  const handleCloseDemandeModal = () => {
    setIsModalDemandOpen(false);
  };

  const handleTabClick = (tab: "description" | "demande") => {
    setActiveTab(tab);
  };

  const getData = async () => {
    try {
      const response = await fetch(`${API_URL}/parcel/${params.slug}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Error: ${errorData.error}`); // Display error from backend
        return;
      }

      const data = await response.json();
      console.log("response: ", data);
      setColis(data); // Assuming the response is the parcel object itself

    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch the parcel. Please try again.");
    } finally {
      setLoading(false); // Stop loading after fetch completes
    }
  };


  useEffect(() => {
    getData();
    setUser(user)
  }, [params.slug]);

  if (loading) {
    return <div>Loading...</div>; // Show loading message or spinner
  }

  if (error) {
    return <div>{error}</div>; // Show the error message
  }

  if (!colis) {
    return <div>No parcel found.</div>; // Handle case where no parcel is found
  }

  return <div>
    <div className="font-sans p-8 tracking-wide  max-lg:max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-800">
          From: '{colis.origin}' <br />
          To: '{colis.destination}'
        </h2>
      </div>
      <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-10 mt-6">
        <div>
          <div className="flex gap-4 text-center">
            <img
              src={colis.imageUrl}
              className="w-full max-h-full object-contain object-top"
            />
          </div>


        </div>
        <div className="max-w-xl">
          <p className="text-gray-800 text-3xl font-bold">{colis.price} DH</p>

          <hr className="my-8" />
          <div>
            <h3 className="text-lg font-bold text-gray-800">Weight: {colis.weight} KG</h3>

          </div>
          <hr className="my-8" />
          {!isColisOner && (
            <><div className="flex flex-wrap gap-4">
              <button
                type="button"
                className="min-w-[200px] px-4 py-3 bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold rounded"
                onClick={handleOpenModalDemand}
              >
                Demande Livraison Now
              </button><DemandModal isOpen={isModalDemandOpen} onClose={handleCloseDemandeModal} colisId={colis.id} userId={colis.userId} /><button
                type="button"
                className="min-w-[200px] px-4 py-2.5 border border-gray-800 bg-transparent hover:bg-gray-50 text-gray-800 text-sm font-semibold rounded"
              >
                Send Message
              </button><div>
                <button
                  type="button"
                  className="min-w-[200px] px-4 py-2.5 border border-red-600 bg-transparent hover:bg-red-50 text-red-600 text-sm font-semibold rounded"
                  onClick={handleOpenModal}
                >
                  Report Colis
                </button>
                {colis && (
                  <ReportModal isOpen={isModalOpen} onClose={handleCloseModal} colisId={colis.id} />
                )}
              </div>
            </div></>
          )}
        </div>
      </div>
      <div className="mt-32">
        <ul className="flex border-b">
          <li
            className={`text-sm font-bold py-3 px-8 cursor-pointer transition-all ${activeTab === "description"
              ? "text-gray-800 bg-gray-100 border-b-2 border-gray-800"
              : "text-gray-600 hover:bg-gray-100"
              }`}
            onClick={() => handleTabClick("description")}
          >
            Description
          </li>
          <li
            className={`text-sm font-bold py-3 px-8 cursor-pointer transition-all ${activeTab === "demande"
              ? "text-gray-800 bg-gray-100 border-b-2 border-gray-800"
              : "text-gray-600 hover:bg-gray-100"
              }`}
            onClick={() => handleTabClick("demande")}
          >
            Demandes
          </li>
        </ul>

        <div className="mt-8">
          {activeTab === "description" && (
            <div id="description">
              <h3 className="text-lg font-bold text-gray-800">Colis Description</h3>
              <p className="text-sm text-gray-600 mt-4">{colis.description}</p>
            </div>
          )}

          {activeTab === "demande" && (
            <div id="demande">
              <Demandes colisId={colis.id} demanded={colis.demanded} isColisOner={isColisOner} />
            </div>
          )}
        </div>
      </div>
    </div>

  </div>

}