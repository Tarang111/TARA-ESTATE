import axios from "axios";
import { create } from "zustand";

const initialState = {
  estates: [],
  featured: [],
  userr: null,
  isloading: false,
  saved: [],
  savedIds: [],
  isadmin: false,
  estatesFetched: false,
  featuredFetched: false,
  savedFetched: false,
  fetchuserr: false,
};

export const useEstateStore = create<any>((set, get) => ({
  ...initialState,

  fetchEstates: async () => {
    if ((get() as any).estatesFetched) return;
    set({ isloading: true });
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/properties`);
      set({ estates: response.data.pdata, isloading: false, estatesFetched: true });
    } catch (error) {
      set({ isloading: false });
      console.error("Error:", error);
    }
  },

  getFeaturedProperties: async () => {
    if ((get() as any).featuredFetched) return;
    set({ isloading: true });
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/featuredproperties`);
      set({ featured: response.data.pfdata, isloading: false, featuredFetched: true });
    } catch (error) {
      set({ isloading: false });
      console.error("Error:", error);
    }
  },

  fetchuser: async (user: any) => {
    if ((get() as any).fetchuserr) return;
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/useradd`, {
        id: user?.id,
        first_name: user?.firstName,
        lastname: user?.lastName,
        email: user?.primaryEmailAddress?.emailAddress
      }, { headers: { 'Content-Type': 'application/json' } });
      set({ userr: response.data, fetchuserr: true });
    } catch (error) { console.error("Error:", error); }
  },

  fetchuserbyid: async (userId: string) => {
    if ((get() as any).userr && Object.keys((get() as any).userr).length > 0) return;
    try {
      const res = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/getuserbyid`, {
        params: { id: userId },
      });
      set({ isadmin: res.data.user.is_admin });
    } catch (error) { console.error("Error:", error); }
  },

  fetchSavedProperties: async (userId: string) => {
    if ((get() as any).savedFetched) return;
    set({ isloading: true });
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/savedproperties`, {
        params: { id: userId }
      });
      const ids = response.data.sdata.map((item: any) => item.property_id);
      set({ saved: response.data.sdata, savedIds: ids, isloading: false, savedFetched: true });
    } catch (error) {
      console.error(error);
      set({ isloading: false });
    }
  },

  // Reset Methods
  invalidatesave: () => set({ saved: [], savedIds: [], savedFetched: false }),
  invalidatemark: () => set({ estates: [], featured: [], estatesFetched: false, featuredFetched: false }),
  invalidatedelete: () => set({ estates: [], featured: [], estatesFetched: false, featuredFetched: false, savedFetched: false }),
  invalidatelogout: () => set(initialState),
}));