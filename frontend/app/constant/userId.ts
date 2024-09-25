import jwt from 'jsonwebtoken';

let User: any = null; // Initialize user variable

const token = localStorage.getItem("token");

if (token) {
  try {
    const payload = jwt.verify(token, "user_key") as { user: any };
    User = payload.user; // Assign the user from payload
    console.log(payload);
  } catch (err) {
    console.error("Invalid token", err);
  }
} else {
  console.error("No token found");
}

export default User;
