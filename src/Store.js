import { create } from 'zustand'

export const useStore = create((set) => ({
  btsUser: {
    isLoggedIn: false,
    userID: '1',
    name: 'guest',
    email: '',
    picture: '',
    userDetails: {},
  },
  setBtsUser: (user) => set((state) => ({ btsUser: user })),

  passStatus: {},
  setPassStatus: (status) => set((state) => ({ passStatus: status })),
}))
