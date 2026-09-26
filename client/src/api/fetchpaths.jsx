// The Express server serves this client and the API from the same origin, so paths are relative.
// In local dev, CRA proxies /api to http://localhost:5001 (see "proxy" in client/package.json).

export const signupAdminFetchPath = "/api/organizations/signup";
export const signupFetchPath = "/api/user/signup/";
export const taskFetchPath = "/api/tasks/";
export const loginFetchPath = "/api/user/login";
export const orgFetchPath = "/api/organizations";
export const userFetchPath = "/api/user/";
