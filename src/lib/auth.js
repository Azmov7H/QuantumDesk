// lib/auth.js
import { jwtDecode } from "jwt-decode";

export function checkAuth(token) {
  try {
    const decoded = jwt_decode(token);
    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch (err) {
    return false;
  }
}
