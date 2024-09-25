import { jwtDecode } from "jwt-decode";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  isAdmine: boolean;
  email: string;
  password: string;
  phone: string;
}

interface DecodedPayload {
  user: User;
  iat: number; // Issued at time
  exp: number; // Expiration time
}

function verifyToken(token: string): User | null {
  try {
    console.log("verifyToken start : ", token)
    const decoded = jwtDecode<DecodedPayload>(token);
    console.log("decoded : ", decoded.user)
    return decoded.user; // Return the decoded user from token
  } catch (err) {
    console.error("Invalid token", err);
    return null; // Return null if the token is invalid
  }
}

export default verifyToken;