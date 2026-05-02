// stores/useAuthStore.ts
import { create } from "zustand";
import { User } from "@/types";

import { axiosInstance } from "@/lib/axios";

interface AuthStore {
  authUser: User | null;
  isCheckingAuth: boolean;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;  // Add success message state
  isAdmin: boolean;
  users: User[];
  selectedUser: User | null;


  fetchUsers: () => Promise<void>;
  signup: (data: any) => Promise<void>;
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  verifyEmail: (email: string, otp: string) => Promise<void>;
  resendOTP: (email: string) => Promise<{ success: boolean; message: string }>;
  checkAdminStatus: () => Promise<void>;
  clearMessages: () => void;  // Add clear messages function
}

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isLoading: false,
  error: null,
  successMessage: null,  // Initialize success message
  isAdmin: false,
  users: [],
  selectedUser: null,

  clearMessages: () => {
    set({ error: null, successMessage: null });
  },

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
	  const res = await axiosInstance.get(`/auth/me`);
	  ////console.log('mmmmmmmm', res.data.user)
      set({ authUser: res.data.user, isCheckingAuth: false });
    } catch (error: any) {
		////console.error("error: error.response?.data?.message",error)
      set({ authUser: null, isCheckingAuth: false, //error: error.response?.data?.message

	   });
    }
  },

  signup: async (data) => {
    set({ isLoading: true, error: null, successMessage: null });
    ////console.log({data})
    try {
      const res = await axiosInstance.post(`/auth/signup`, data);
      set({ authUser: res.data.user, successMessage: res.data.message });
      return res.data;
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Signup failed" });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (data) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const res = await axiosInstance.post(`/auth/login`, data);
      set({ authUser: res.data.user, successMessage: "Login successful!" });
      return res.data;
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Login failed" });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  verifyEmail: async (email: string, otp: string) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      await axiosInstance.post(`/auth/verify-email`, { email, otp });
     
      const res = await axiosInstance.get(`/auth/me`);
      set({ authUser: res.data.user, successMessage: "Email verified successfully!" });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Verification failed" });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  resendOTP: async (email: string) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const response = await axiosInstance.post(`/auth/resend-otp`, { email });
      set({ successMessage: response.data.message });
      return { success: true, message: response.data.message };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to resend OTP";
      set({ error: errorMessage });
      return { success: false, message: errorMessage };
    } finally {
      set({ isLoading: false });
    }
  },

  	fetchUsers: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/users");
			set({ users: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

  logout: async () => {
    set({ isLoading: true });
    try {
      await axiosInstance.post(`/auth/logout`);
      set({ authUser: null, successMessage: "Logged out successfully" });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Logout failed" });
    } finally {
      set({ isLoading: false });
    }
  },

  checkAdminStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/admin/check`);
      set({ isAdmin: response.data.admin });
    } catch (error: any) {
      set({ isAdmin: false, error: error.response?.data?.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));


