// The API requires a Bearer token on almost every request. Attach the logged-in user's token
// (saved in localStorage by useLogin) to every same-origin /api request, for both fetch and axios.
import axios from "axios";

const getToken = () => {
  try {
    return JSON.parse(localStorage.getItem("user"))?.token;
  } catch (error) {
    return null;
  }
};

const nativeFetch = window.fetch.bind(window);

window.fetch = (input, init = {}) => {
  const url = typeof input === "string" ? input : input.url;
  const token = getToken();

  if (token && url.startsWith("/api")) {
    const headers = new Headers(init.headers || (typeof input === "string" ? undefined : input.headers));
    if (!headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    init = { ...init, headers };
  }

  return nativeFetch(input, init);
};

axios.interceptors.request.use((config) => {
  const token = getToken();

  if (token && config.url.startsWith("/api") && !config.headers.get("Authorization")) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});
