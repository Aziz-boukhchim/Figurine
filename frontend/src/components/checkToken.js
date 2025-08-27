import { jwtDecode } from "jwt-decode";

export function checkToken() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp < Date.now() / 1000) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  } catch (err) {
    // Invalid token
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
}
