"use client"
import React, { useEffect, useState } from 'react'
import { API_URL } from '../constant/apiUrl';

interface Colis {
    id: number;
    description: String;
    imageUrl: string;
    weight: number;
    price: number;
    origin: String;
    destination: String;
    userId: number;
}


const AllColis = () => {
    const [colis, setColis] = useState<Colis[]>([]); // Specify Colis array type
    const [loading, setLoading] = useState<boolean>(true); // To handle loading state
    const [error, setError] = useState<string | null>(null); // To handle errors
  
    const getData = async () => {
        try {
            const response = await fetch(`${API_URL}/parcel`, {
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
            console.log("response: ", data);
    
            if (Array.isArray(data.parcels)) {
                setColis(data.parcels); // Set the colis state
            } else {
                setError("Unexpected response format.");
            }
        } catch (error) {
            console.error("Error in:", error);
            setError("Failed to get colis. Please try again.");
        } finally {
            setLoading(false); // Always set loading to false after fetching
        }
    };
    
  
    useEffect(() => {
      getData();
    }, []);
  
    if (loading) {
      return <div>Loading...</div>; // Display a loading message or spinner
    }
  
    if (error) {
      return <div>{error}</div>; // Display the error message
    }

    return (
        <div>
            <div className="p-4 font-[sans-serif]">
                <div className="max-w-6xl max-lg:max-w-3xl max-sm:max-w-sm mx-auto">
                    <div className="max-w-md mx-auto">
                        <h2 className="text-3xl font-extrabold text-gray-800 mb-12 text-center leading-10">
                            Stay updated with the latest Colis posts.
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-sm:gap-8">
                        {colis.map(colis => (
                            <div key={colis.id} className="bg-white rounded overflow-hidden border border-gray-200 drop-shadow-md ">
                                <img
                                    src={colis.imageUrl}
                                    className="w-full h-52 object-cover"
                                />
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-3">
                                    From: {colis.origin}
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                    {colis.description}
                                    </p>
                                    <p className="text-gray-800 text-[13px] font-semibold mt-4">
                                    {colis.price} DH
                                    </p>
                                    <a
                                        href={`/colis/${colis.id}`}
                                        className="mt-4 inline-block px-4 py-2 rounded tracking-wider bg-purple-600 hover:bg-purple-700 text-white text-[13px] drop-shadow-md"
                                    >
                                        Read More
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AllColis