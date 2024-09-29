export default function verifyTokenFunction(token: string | null) {
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
                return (true); // Token is valid and not expired
            } else {
                localStorage.removeItem("token"); // Optionally remove expired token
                return (false);
            }
        } catch (error) {
            console.log("Invalid token");
        }
    } else {
        localStorage.removeItem("token"); // Optionally remove expired token
        return (false);
    }
}
