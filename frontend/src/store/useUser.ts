import { create } from "zustand";

export interface UserObject {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;

    createdAt: Date;
    updatedAt: Date;
}

interface UseUserState {
    user: UserObject | null;
    dreamsIds: object[] | null;
    emailsIds: object[] | null;
    isLoading: boolean;

    setUser: (user: UserObject | null) => void;
    setUserDreams: (dreamsIds: object[] | null) => void;
}

const useUser = create<UseUserState>((set) => ({
    user: null,
    dreamsIds: null,
    emailsIds: null,
    isLoading: false,

    setUser(user: UserObject | null) {
        if (user) {
            set({ user: { ...user } });
        } else {
            set({ user: null });
        }
    },
    setUserDreams(dreamsIds: object[] | null) {
        if (dreamsIds) {
            set({ dreamsIds: dreamsIds });
        } else {
            set({ dreamsIds: null });
        }
    },
    getMyProfile() {
        set({isLoading: true})
    }
}));

export default useUser;
