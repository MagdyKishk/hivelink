import { create } from "zustand";
import api from "../service/api/api";
import getAxiosErrorMessage from "../utils/errors/getAxiosErrorMessage";
import useUser, { UserObject } from "./useUser";

/**
 * Interface defining the authentication state and methods
 */
interface useAuthState {
  /** Error message from last auth operation */
  authError: string | null;
  /** Flag indicating if auth check is in progress */
  isLoadingAuth: boolean;
  /** Flag indicating if auth check has been completed */
  checkedAuth: boolean;
  /** Flag indicating if user is authenticated */
  isAuthenticated: boolean;
  /** Access token data */
  accessToken: {
    value: string | null;
    expiresDate: Date | null;
  };

  /** Get current access token or refresh if expired */
  getAccessToken: () => Promise<string | null>;
  /** Log in with email and password */
  login: (email: string, password: string) => Promise<void>;
  /** Sign up new user account */
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  /** Check if current auth is valid */
  checkAuth: () => Promise<void>;
}

const useAuth = create<useAuthState>((set, get) => ({
  // used to store any auth error message
  authError: null,

  // used to mark if any auth operation is in progress
  isLoadingAuth: false,

  // used to mark if auth check has been completed
  checkedAuth: false,

  // used to mark if user is authenticated
  isAuthenticated: false,

  // used to store access token data
  accessToken: {
    value: null,
    expiresDate: null,
  },

  async signup(firstName: string, lastName: string, email: string, password: string) {
    set({isLoadingAuth: true, isAuthenticated: false, authError: null});

    try {
      const response = await api.post("/auth/signup", {firstName, lastName, email, password});

      const { value, expiresDate } = response.data.data.accessToken;
      const _user = response.data.data.user;

      if (!value || !expiresDate || !_user) {
        throw new Error("Missing required data in response");
      }

      const userData = { ..._user, dreams: undefined } as UserObject;
      const userDreamsIds = _user.dreams || []; // Default to empty array if undefined

      const { setUser, setUserDreams } = useUser.getState();
      setUser(userData);
      setUserDreams(userDreamsIds);

      set({
        isAuthenticated: true,
        authError: null,
        checkedAuth: true,
        accessToken: {
          value,
          expiresDate: new Date(expiresDate),
        },
      });
    } catch (error) {
      const message = getAxiosErrorMessage(error, "Failed to create account");

      set({authError: message, isAuthenticated: false, checkedAuth: true, });
    } finally {
      set({ isLoadingAuth: false });
    }
  },

  async login(email: string, password: string) {
    set({ isLoadingAuth: true, authError: null, isAuthenticated: false });
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      // Validate response data
      if (!response.data.data.accessToken || !response.data.data.user) {
        throw new Error("Invalid response format from server");
      }

      const { value, expiresDate } = response.data.data.accessToken;
      const _user = response.data.data.user;

      // Validate required user data
      if (!value || !expiresDate || !_user) {
        throw new Error("Missing required data in response");
      }

      const userData = { ..._user, dreams: undefined } as UserObject;
      const userDreamsIds = _user.dreams || []; // Default to empty array if undefined

      const { setUser, setUserDreams } = useUser.getState();
      setUser(userData);
      setUserDreams(userDreamsIds);

      set({
        isAuthenticated: true,
        accessToken: {
          value,
          expiresDate: new Date(expiresDate),
        },
        authError: null,
        checkedAuth: true,
      });
    } catch (error) {
      console.log(error);
      const message = getAxiosErrorMessage(error, "Invalid email or password");
      set({
        authError: message,
        isAuthenticated: false,
        checkedAuth: true,
      });
    } finally {
      set({ isLoadingAuth: false });
    }
  },

  async logout() {
    set({ isLoadingAuth: true, authError: null });
    try {
      const accessToken = await get().getAccessToken();
      if (!accessToken) {
        throw new Error("No access token available");
      }

      await api.post("/auth/logout", {
        accessToken,
      });

      const { setUser, setUserDreams } = useUser.getState();
      setUser(null);
      setUserDreams(null);

      set({
        isAuthenticated: false,
        accessToken: {
          value: null,
          expiresDate: null,
        },
        authError: null,
      });
    } catch (error) {
      const message = getAxiosErrorMessage(error, "Failed to log out");
      console.error("Logout failed:", error);
      set({
        authError: message,
        isAuthenticated: false,
      });
      throw Error(message);
    } finally {
      set({ isLoadingAuth: false });
    }
  },

  async checkAuth() {
    set({
      isLoadingAuth: true,
      checkedAuth: false,
    });

    try {
      const accessToken = await get().getAccessToken();
      if (!accessToken) {
        throw new Error("No access token available");
      }

      const response = await api.post("/auth/check", {
        accessToken,
      });

      const _user = response.data.data.user;
      const userData = { ..._user, dreams: undefined } as UserObject;
      const userDreams = _user.dreams;

      const { setUser, setUserDreams } = useUser.getState();
      setUser(userData);
      setUserDreams(userDreams);

      set({
        isAuthenticated: true,
        checkedAuth: true,
      });
    } catch {
      set({
        isAuthenticated: false,
        checkedAuth: true,
      });
    } finally {
      set({ isLoadingAuth: false });
    }
  },

  async getAccessToken() {
    const currentState = get();

    if (
      currentState.accessToken.expiresDate !== null &&
      currentState.accessToken.expiresDate > new Date()
    ) {
      console.log("value");
      return currentState.accessToken.value;
    }

    try {
      const response = await api.post("/auth/refresh");
      console.log(response.data.data);
      const { value, expiresDate } = response.data.data.accessToken;
      set({
        accessToken: {
          value,
          expiresDate: new Date(expiresDate),
        },
      });

      return value;
    } catch {
      return null;
    }
  },
}));

export default useAuth;
