'use client'
import { useEffect, useState } from "react";
import LogoutHeader from "../components/logoutHeader";
import Header from "../components/loginHeader";


export default function VerifyTokenHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for JWT token in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Manually decode the JWT token (Base64 decoding)
        const base64Url = token.split(".")[1]; // Extract the payload
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const decodedPayload = JSON.parse(atob(base64)) as {//+
          exp: number; // Assuming the decoded token has an 'exp' property for expiration time//+
        };//+;

        // Check token expiration
        const currentTime = Date.now() / 1000; // Current time in seconds
        if (decodedPayload.exp > currentTime) {
          setIsLoggedIn(true); // Token is valid and not expired
        } else {
          console.log("Token has expired");
          localStorage.removeItem("token"); // Optionally remove expired token
        }
      } catch (error) {
        console.log("Invalid token");
      }
    }
  }, []);

  return (
    <div>
        {isLoggedIn ? <Header /> : <LogoutHeader />}
    </div>
  );
}
