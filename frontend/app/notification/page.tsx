/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useEffect, useState } from "react";
import { API_URL } from "../constant/apiUrl";
import verifyToken from "@/app/constant/userId";
import verifyTokenFunction from "@/app/constant/verifyTokenFunction";
import { redirect } from "next/navigation";

interface Notification {
  id: number;
  type: string;
  content: string;
  read: boolean;
  createdAt: string;
  userId: number;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]); // Notifications array type
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error handling

  // Fetch notifications from the API
  const getData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const verifiedUser: any = verifyToken(token);
        const userId = verifiedUser.id;

        const response = await fetch(`${API_URL}/notifications/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(`Error: ${errorData.error}`);
          return;
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setNotifications(data); // Set the notifications state
        } else {
          setError("Unexpected response format.");
        }
      }
    } catch (error) {
      console.error("Error in:", error);
      setError("Failed to get notifications. Please try again.");
    } finally {
      setLoading(false); // Always set loading to false after fetching
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: number) => {
    try {
      const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Error: ${errorData.error}`);
        return;
      }

      // Update notification in the state to reflect that it has been read
      setNotifications(notifications.map(notification =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      ));
    } catch (error) {
      console.error("Error in:", error);
      setError("Failed to update notification. Please try again.");
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
    return <div>Loading...</div>; // Display loading message
  }

  if (error) {
    return <div>{error}</div>; // Display error message
  }

  return (
    <div className="font-sans max-w-6xl max-lg:max-w-4xl mx-auto bg-gray-50 p-8">
      <div className="grid gap-12">
        <div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Notifications</h2>
            <div className="space-y-6">
              {notifications.map((notification) => (
                <div key={notification.id} className={`p-6 ${notification.read ? 'bg-gray-100' : 'bg-gray-200'} rounded-md shadow-md`}>
                  <div className="grid grid-cols-3 items-start gap-4">
                    <div className="col-span-2 flex items-start gap-4">
                      <div className="flex flex-col">
                        <h3 className="text-sm font-semibold text-gray-700">
                          Date: {new Date(notification.createdAt).toLocaleDateString()}
                        </h3>
                        <p className="text-gray-600">{notification.content}</p>
                      </div>
                    </div>
                    <div className="ml-auto flex flex-col items-end">
                      <button
                        className={`mt-4 inline-block px-4 py-2 ${notification.read ? 'bg-green-500' : 'bg-red-500'} hover:bg-gray-700 text-white text-sm font-semibold rounded-md shadow-md transition duration-300`}
                        onClick={() => markAsRead(notification.id)} // Mark as read onClick
                        disabled={notification.read} // Disable button if already read
                      >
                        {notification.read ? 'Read' : 'Mark as Read'}
                      </button>
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

export default Notifications;
