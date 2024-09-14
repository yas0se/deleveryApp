'use client'
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { API_URL } from "../constant/apiUrl";

// Zod validation schema
const ColisSchema = z.object({
  description: z.string().min(1, "Description is required"),
  weight: z.number().positive("Weight must be a positive number").or(z.string()),
  price: z.number().positive("Price must be a positive number").or(z.string()),
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  image: z.instanceof(File).optional(),
});

const AjouterColis = () => {
  const [description, setDescription] = useState("");
  const [weight, setWeight] = useState<number | string>("");
  const [price, setPrice] = useState<number | string>("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [token, setToken] = useState<string | null>(null);

  const cloud_name = "du1w6cmsb";
  const preset_key = "aauez9ty";

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token: ", token)
    setToken(token);
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
    console.log("token: ", token)
  };

  const handleSaveColis = async (e: any) => {
    e.preventDefault();
    try {
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", preset_key);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json(); // Read the error response once
          alert(`Error: ${errorData.message}`);
          return;
        }

        const imageData = await res.json(); // Read the response body once
        const imageUrl = imageData.secure_url; // Extract the URL

        const colis = {
          description,
          weight,
          price,
          origin,
          destination,
          imageUrl, // Assign the Cloudinary image URL here
        };

        // Post the colis data to your API
        const response = await fetch(`${API_URL}/parcel/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add JWT token here
          },
          body: JSON.stringify(colis),
        });

        if (response.ok) {
          const responseData = await response.json();
          alert('Colis created successfully!');
        } else {
          const errorData = await response.json();
          alert(`Error creating colis: ${errorData.message}`);
        }
      } else {
        alert("Please select an image to upload.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving the colis.");
    }
  };


  return (
    <div className="p-3">
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSaveColis}>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <input
                id="description"
                type="text"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {errors?.description && (
                <p className="text-danger">{errors.description._errors[0]}</p>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="weight" className="form-label">
                Weight
              </label>
              <input
                id="weight"
                type="number"
                className="form-control"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              {errors?.weight && (
                <p className="text-danger">{errors.weight._errors[0]}</p>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">
                Price
              </label>
              <input
                id="price"
                type="number"
                className="form-control"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              {errors?.price && (
                <p className="text-danger">{errors.price._errors[0]}</p>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="origin" className="form-label">
                Origin
              </label>
              <input
                id="origin"
                type="text"
                className="form-control"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
              {errors?.origin && (
                <p className="text-danger">{errors.origin._errors[0]}</p>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="destination" className="form-label">
                Destination
              </label>
              <input
                id="destination"
                type="text"
                className="form-control"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
              {errors?.destination && (
                <p className="text-danger">{errors.destination._errors[0]}</p>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="image" className="form-label">
                Image
              </label>
              <input
                id="image"
                type="file"
                className="form-control"
                onChange={handleImageChange}
              />
              {errors?.image && (
                <p className="text-danger">{errors.image._errors[0]}</p>
              )}
            </div>
            <button className="btn btn-primary" type="submit">
              Save Colis
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AjouterColis;
