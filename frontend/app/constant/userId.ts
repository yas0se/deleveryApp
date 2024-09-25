import jwt from 'jsonwebtoken';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  isAdmine: boolean;
  email: string;
  password: string;
  phone: string;
}

let user: User | null = null; // Initialize user variable

const token = localStorage.getItem("token");

if (token) {
  try {
    const payload = jwt.verify(token, "user_key") as { user: User  };
    user = payload.user; // Assign the user from payload
    console.log(payload);
  } catch (err) {
    console.error("Invalid token", err);
  }
} else {
  console.error("No token found");
}

export default User;
