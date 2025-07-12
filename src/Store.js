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

  showForgotForm: false,
  toggleShowForgotForm: (bool) => set((state) => ({ showForgotForm: bool })),

  passStatus: {},
  setPassStatus: (status) => set((state) => ({ passStatus: status })),

  userReservations: [],
  setUserReservations: (reservations) => set((state) => ({ userReservations: reservations })),

  displayUserReservationSummary: false,
  setDisplayUserReservationSummary: (bool) => set((state) => ({ displayUserReservationSummary: bool })),

  reservationDetail: null,
  setReservationDetail: (reservation) => set((state) => ({ reservationDetail: reservation })),

  displayReservationDetail: false,
  setDisplayReservationDetail: (bool) => set((state) => ({ displayReservationDetail: bool })),

  displayEditSuccess: false,
  setDisplayEditSuccess: (bool) => set((state) => ({ displayEditSuccess: bool })),

  displayEditReservation: false,
  setDisplayEditReservation: (bool) => set((state) => ({ displayEditReservation: bool })),
}))
