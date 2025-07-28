import { create } from 'zustand'

export const useStore = create((set) => ({
  btsUser: {
    isLoggedIn: false,
    id: '1',
    firstName: 'Guest',
  },
  setBtsUser: (user) => set((state) => ({ btsUser: user })),

  passStatus: {},
  setPassStatus: (status) => set((state) => ({ passStatus: status })),
}))
