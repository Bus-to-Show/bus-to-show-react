// Packages
import React, { Component } from 'react'
import Validator from 'validator'
import moment from 'moment'

// Components
import ShowList from '../Components/Shows/ShowList'
import DetailCartView from '../Components/DetailCartView'
import { useStore } from '../Store'

const fetchUrl = `${process.env.REACT_APP_API_URL}`

class LayoutPage extends Component {
  // Please keep sorted alphabetically so we don't duplicate keys :) Thanks!
  state = {
    afterDiscountObj: {},
    artistIcon: false,
    assignedParties: [],
    cartToSend: {
      eventId: null,
      pickupLocationId: null,
      firstName: '',
      lastName: '',
      email: '',
      willCallFirstName: '',
      willCallLastName: '',
      ticketQuantity: 0,
      totalCost: 0,
      discountCode: null,
      userId: null,
    },
    checked: false,
    dateIcon: true,
    discountApplied: false,
    displayAddBtn: false,
    displayCart: false,
    displayConfirmRemove: false,
    displayShow: null,
    displayWarning: false,
    displayQuantity: false,
    filterString: '',
    firstBusLoad: null,
    inCart: [],
    invalidFields: {},
    partyPrice: 0,
    pickupLocationId: null,
    pickupPartyId: null,
    purchaseFailed: false,
    purchasePending: false,
    purchaseSuccessful: false,
    ticketTimer: null,
    ticketsAvailable: [],
    ticketQuantity: null,
    totalCost: 0,
    validated: false,
    validatedElements: {
      fName: null,
      lName: null,
      email: null,
      wCFName: null,
      wCLName: null
    },
  }

  async componentDidMount() {
    await this.getVerify()

    const today = new Date().toLocaleDateString('en-US');

    const eventsParams = new URLSearchParams([
      ['startDate', today],
      ['sort', 'date'],
    ]);

    const eventsResponse = await fetch(`${fetchUrl}/events?${eventsParams}`)
    const upcomingShows = await eventsResponse.json()

    const pickupLocationsResponse = await fetch(`${fetchUrl}/pickup_locations`)
    const pickupLocations = await pickupLocationsResponse.json()

    this.setState({ pickupLocations, upcomingShows })
  }

  getVerify = async () => {
    const response = await fetch(`${fetchUrl}/api`)
    const json = await response.json()
    document.cookie = `token=${json.token}; secure`
  }

  getPickupParties = async (eventId) => {
    const response = await fetch(`${fetchUrl}/pickup_parties/findParties`, {
      method: 'PATCH',
      body: JSON.stringify({ eventId }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    let result = await response.json()

    result = result.sort((a, b) => {
      return a.id - b.id
    })

    return result
  }

  refreshPickupParty = async (pickupId) => {
    const response = await fetch(`${fetchUrl}/pickup_parties/${pickupId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const result = await response.json()
    return result
  }

  // Called in show details view; requires selection of location before corresponding times and quantities are displayed
  selectPickupLocationId = async (event, timer) => {
    const newState = { ...this.state }
    const oldPickup = parseInt(newState.pickupPartyId)

    if (!timer) {
      this.clearTicketsInCart(oldPickup, newState.ticketQuantity)
      newState.ticketQuantity = 0
      this.ticketTimer(false)
      this.setState({ ticketQuantity: newState.ticketQuantity })
    }

    newState.pickupPartyId = parseInt(event.target.value)

    if (event.target.value === "Select a Departure Option...") {
      newState.displayQuantity = false
      newState.ticketsAvailable = null
      newState.ticketQuantity = 0
      newState.displayAddBtn = false

      this.setState({
        displayQuantity: newState.displayQuantity,
        ticketsAvailable: newState.ticketsAvailable,
        ticketQuantity: newState.ticketQuantity,
        displayAddBtn: newState.displayAddBtn,
      })

      return
    }

    if (parseInt(newState.ticketQuantity)) {
      this.clearTicketsInCart(oldPickup, newState.ticketQuantity)
      newState.ticketQuantity = 0
      newState.displayQuantity = false
      newState.displayAddBtn = false

      this.setState({
        ticketQuantity: newState.ticketQuantity,
        displayQuantity: newState.displayQuantity,
        displayAddBtn: newState.displayAddBtn
      })
    } else if (parseInt(event.target.value) !== oldPickup) {
      newState.ticketQuantity = 0
      newState.displayQuantity = false
      newState.displayAddBtn = false

      this.setState({
        ticketQuantity: newState.ticketQuantity,
        displayQuantity: newState.displayQuantity,
        displayAddBtn: newState.displayAddBtn
      })
    }

    newState.displayQuantity = true

    const statePickupPartyId = parseInt(newState.pickupPartyId)
    const stateEventId = parseInt(newState.displayShow.id)
    const parties = newState.assignedParties
    let matchedParty = await parties.find(party => (parseInt(party.id) === statePickupPartyId) && (parseInt(party.eventId) === stateEventId))
    newState.pickupLocationId = matchedParty.pickupLocationId

    if (matchedParty.firstBusLoadTime) {
      newState.firstBusLoad = moment(matchedParty.firstBusLoadTime, 'LT').format('h:mm A')
    }

    newState.lastDepartureTime = moment(matchedParty.lastBusDepartureTime, 'LT').format('h:mm A')

    let numArray = []

    let matchedPartyPrice = matchedParty.partyPrice

    if (matchedParty) {
      const availableTickets = await this.refreshAvailableTickets(matchedParty.id)

      if (availableTickets < 1) {
        newState.ticketsAvailable = []
      } else if (availableTickets >= 1) {
        numArray = [...Array(availableTickets).keys()].map(i => i + 1)
        newState.ticketsAvailable = numArray
      }
    } else {
      console.error('Error!! No MatchedParty in selectPickupLocationId')
    }

    this.setState({
      ticketsAvailable: newState.ticketsAvailable,
      partyPrice: matchedPartyPrice,
      pickupLocationId: newState.pickupLocationId,
      pickupPartyId: newState.pickupPartyId,
      firstBusLoad: newState.firstBusLoad,
      lastDepartureTime: newState.lastDepartureTime,
      displayQuantity: newState.displayQuantity,
      displayAddBtn: newState.displayAddBtn
    })
  }

  refreshAvailableTickets = async (pickupPartyId) => {
    const matchedParty = await this.refreshPickupParty(pickupPartyId)

    const currentReservations = await fetch(`${fetchUrl}/reservations/findOrders`, {
      method: 'PATCH',
      body: JSON.stringify({
        pickupPartiesId: pickupPartyId,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const reservations = await currentReservations.json()
    const activeReservations = reservations.filter(rezzie => rezzie.status < 3)
    const availableTickets = parseInt(matchedParty.capacity) - parseInt(activeReservations.length) - parseInt(matchedParty.inCart)
    return availableTickets
  }

  selectTicketQuantity = (event) => {
    this.ticketTimer(false)
    const newState = { ...this.state }
    let oldQty = 0

    if (parseInt(newState.ticketQuantity) > 0) {
      oldQty = parseInt(newState.ticketQuantity)
    }

    const pickupPartyId = parseInt(newState.pickupPartyId)

    oldQty > 0 && this.clearTicketsInCart(pickupPartyId, oldQty)
    event.target.value && (newState.displayAddBtn = true)

    const subTotal = (Number(newState.partyPrice) * Number(event.target.value)).toFixed(2)
    const total = ((Number(subTotal) * .1) + Number(subTotal)).toFixed(2)
    newState.ticketQuantity = ~~event.target.value

    newState.totalCost = newState.displayShow.id === 40300786 ? Number(subTotal).toFixed(2) : total

    this.setState({
      displayAddBtn: newState.displayAddBtn,
      ticketQuantity: newState.ticketQuantity,
      totalCost: newState.totalCost
    })

    this.addTicketsInCart(pickupPartyId, newState.ticketQuantity)
    this.ticketTimer(true, 120000, false)
    window.addEventListener("beforeunload", this.clearCartOnClose)
  }

  updateDiscountCode = event => {
    const newState = { ...this.State }
    newState.discountCode = event.target.value
    this.setState({ discountCode: newState.discountCode })
  }

  applyDiscountCode = async () => {
    const response = await fetch(`${fetchUrl}/discount_codes`, {
      method: 'PATCH',
      body: JSON.stringify({
        discountCode: this.state.discountCode,
        ticketQuantity: this.state.ticketQuantity,
        totalPrice: this.state.totalCost,
        eventId: this.state.displayShow.id,
        applyOrRelease: 'apply',
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const {
      discountCodeId,
      totalPriceAfterDiscount,
      totalSavings,
    } = await response.json();

    if (!discountCodeId || !totalPriceAfterDiscount || !totalSavings) {
      // TODO: make this prettier
      alert('Sorry, that discount code is invalid.');
      return;
    }

    this.setState({
      afterDiscountObj: {
        discountCodeId,
        totalPriceAfterDiscount,
        totalSavings,
      },
      discountApplied: true,
      totalCost: totalPriceAfterDiscount,
    });
  };

  releaseDiscountCode = async () => {
    const response = await fetch(`${fetchUrl}/discount_codes`, {
      method: 'PATCH',
      body: JSON.stringify({
        discountCode: this.state.discountCode,
        eventId: this.state.displayShow.id,
        applyOrRelease: 'release',
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      // No need to show this
      const error = await response.text();
      console.error('Unable to release discount code', error);
    }
  };

  // Header Functions
  searchShows = event => {
    const newState = { ...this.state }
    newState.filterString = event.target.value
    this.setState({ filterString: newState.filterString })
  }

  // Tab Functions
  tabClicked = event => {
    const newState = { ...this.state }

    if (event.target.id === 'cart-tab' && newState.inCart.length > 0) {
      newState.displayCart = true
    }

    if (event.target.innerHTML === 'Details' && newState.inCart.length === 0) {
      newState.displayCart = false
    }

    if (!newState.inCart.length > 0 && event.target.id === 'showDetails-tab') {
      newState.displayCart = false
    }

    if (newState.inCart.length > 0 && event.target.id === 'showDetails-tab') {
      newState.displayWarning = true
    }

    this.setState({
      displayCart: newState.displayCart,
      displayWarning: newState.displayWarning
    })
  }

  backToCalendar = event => {
    const newState = { ...this.state }

    if (parseInt(newState.ticketQuantity)) {
      let oldPickup = parseInt(newState.pickupPartyId)
      this.clearTicketsInCart(oldPickup, newState.ticketQuantity)
      newState.ticketQuantity = null
      newState.displayQuantity = false
      newState.displayAddBtn = false
      this.ticketTimer(false)

      this.setState({
        ticketQuantity: newState.ticketQuantity,
        displayQuantity: newState.displayQuantity,
        displayAddBtn: newState.displayAddBtn
      })
    }

    newState.displayShow = null
    newState.displayCart = false

    this.setState({
      displayShow: newState.displayShow,
      displayCart: newState.displayCart
    })
  }

  // Show Functions
  showsExpandClick = async (event) => {
    const newState = { ...this.state }
    //immediately clear previously selected pickupPartyId from State.
    newState.pickupPartyId = null

    this.setState({
      pickupPartyId: newState.pickupPartyId
    })

    const clickedShow = newState.upcomingShows.find(show => (parseInt(show.id) === parseInt(event.target.id)))
    const assignedPickupParties = await this.getPickupParties(clickedShow.id)
    const currentPickups = assignedPickupParties.map(party => party.pickupLocationId)
    const pickupLocations = newState.pickupLocations.filter(loc => currentPickups.includes(loc.id))

    await assignedPickupParties.forEach(party => pickupLocations.forEach(location => {
      if (location.id === party.pickupLocationId) {
        party.LocationName = location.locationName
      }
    }))

    //set initial state of show details view
    newState.displayQuantity = false
    newState.displayShow = clickedShow
    newState.assignedParties = assignedPickupParties

    this.setState({
      displayQuantity: newState.displayQuantity,
      displayShow: newState.displayShow,
      assignedParties: newState.assignedParties,
    })

    if (document.querySelector('#departureOption')) {
      document.querySelector('#departureOption').value = "Select a Departure Option..."
    }
  }

  handleWarning = () => {
    const newState = { ...this.state }
    newState.displayWarning = true
    this.setState({ displayWarning: newState.displayWarning })
  }

  addToCart = async () => {
    this.ticketTimer(false)
    const newState = { ...this.state }
    const sPickupId = parseInt(this.state.pickupLocationId)
    const sEventId = parseInt(this.state.displayShow.id)
    const pickupParty = this.state.assignedParties.find(party => party.pickupLocationId === sPickupId && party.eventId === sEventId)
    const firstBusLoad = pickupParty.firstBusLoadTime
    const lastDepartureTime = moment(pickupParty.lastBusDepartureTime, 'hhmm').format('h:mm')

    newState.purchaseSuccessful = false
    newState.cartToSend.eventId = null
    newState.cartToSend.pickupLocationId = null
    newState.cartToSend.firstName = ''
    newState.cartToSend.lastName = ''
    newState.cartToSend.email = ''
    newState.cartToSend.willCallFirstName = ''
    newState.cartToSend.willCallLastName = ''
    newState.cartToSend.ticketQuantity = 0
    newState.cartToSend.totalCost = 0
    newState.cartToSend.discountCode = null
    newState.cartToSend.userId = useStore.getState().btsUser.userDetails.id

    newState.validatedElements = {
      firstName: null,
      lastName: null,
      email: null,
      orderedByPhone: null,
      wcFirstName: null,
      wcLastName: null
    }

    this.setState({
      purchaseSuccessful: newState.purchaseSuccessful,
      cartToSend: newState.cartToSend,
      validatedElements: newState.validatedElements
    })

    this.setState({ lastDepartureTime, firstBusLoad })

    if (newState.inCart.length === 0) {
      newState.inCart.push(newState.displayShow)
      newState.displayCart = true
    } else {
      newState.displayWarning = true
    }

    this.setState(newState)
    this.ticketTimer(true, 360000, true)
  }

  // functions to handle setting and clearing of timer and incart qtys
  ticketTimer = (timerOn, time, addedToCart) => {
    let newState = { ...this.state }
    const pickupPartyId = parseInt(newState.pickupPartyId)
    let event = { target: { value: pickupPartyId } }

    if (timerOn) {
      console.log('ticketTimer a', timerOn, time, addedToCart)

      const newTicketTimer = addedToCart ?
        setTimeout(() => {
          console.log('ticketTimer b', timerOn, time, addedToCart)
          this.confirmedRemove()
        }, time)
        :
        setTimeout(() => {
          console.log('ticketTimer c', timerOn, time, addedToCart)
          this.selectPickupLocationId(event, true)
        }, time)

      newState.ticketTimer = newTicketTimer
      this.setState({ ticketTimer: newState.ticketTimer })
    } else {
      console.log('ticketTimer d', timerOn, time, addedToCart)
      clearTimeout(this.state.ticketTimer)
      newState.ticketTimer = null
      this.setState({ ticketTimer: newState.ticketTimer })
    }
  }

  addTicketsInCart = async (pickupPartyId, ticketQty) => {
    if (pickupPartyId && ticketQty) {
      let timeStamp = new Date()

      await fetch(`${fetchUrl}/pickup_parties/${pickupPartyId}/cartQty`, {
        method: 'PATCH',
        body: JSON.stringify({
          inCart: ticketQty,
          updated_at: timeStamp
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  }

  clearTicketsInCart = async (pickupPartyId, ticketQty) => {
    if (pickupPartyId && ticketQty) {
      console.log('clearing ticketQty', ticketQty)
      let timeStamp = new Date()

      await fetch(`${fetchUrl}/pickup_parties/${pickupPartyId}/cartQty`, {
        method: 'PATCH',
        body: JSON.stringify({
          inCart: parseInt(ticketQty) * -1,
          updated_at: timeStamp
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  }

  clearCartOnClose = (ev) => {
    const pickupPartyId = parseInt(this.state.pickupPartyId)
    const ticketQty = parseInt(this.state.ticketQuantity)
    ev.preventDefault();
    this.clearTicketsInCart(pickupPartyId, ticketQty)
    return ev.returnValue = 'Leaving the page will clear your cart, continue?';
  }

  viewCart = () => {
    const newState = { ...this.state }
    newState.displayCart = true
    this.setState({ displayCart: newState.displayCart })
  }

  // Cart Functions
  handleCheck = () => {
    const newState = { ...this.state }

    if (newState.checked === true) {
      this.updatePurchaseField({ target: { id: 'willCallFirstName', value: '' } })
      this.updatePurchaseField({ target: { id: 'willCallLastName', value: '' } })
    }

    newState.checked = !newState.checked

    this.setState({
      checked: newState.checked,
    })
  }

  purchase = async (err) => {
    this.ticketTimer(false)

    if (err) {
      console.log('purchase error', err)
      this.ticketTimer(false)
      this.ticketTimer(true, 360000, true)
      return this.setState({ purchaseFailed: true, purchasePending: false })
    }

    const cartObj = this.state.cartToSend
    cartObj.discountCode = this.state.afterDiscountObj.discountCodeId
    cartObj.userId = useStore.getState().btsUser.userDetails.id

    const response = await fetch(`${fetchUrl}/orders`, {
      method: 'POST',
      body: JSON.stringify(cartObj),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const json = await response.json()
    await this.clearTicketsInCart(json.pickupPartiesId, cartObj.ticketQuantity)

    this.setState({
      purchaseSuccessful: true,
      purchaseFailed: false,
      purchasePending: false,
      inCart: [],
      ticketQuantity: null,
      discountApplied: false,
      discountCode: null,
      afterDiscountObj: {},
    })

    window.removeEventListener("beforeunload", this.clearCartOnClose)
  }

  comp = async (details) => {
    this.ticketTimer(false)
    const cartObj = this.state.cartToSend
    cartObj.userId = useStore.getState().btsUser.userDetails.id
    cartObj.discountCode = this.state.afterDiscountObj.discountCodeId

    const response = await fetch(`${fetchUrl}/orders`, {
      method: 'POST',
      body: JSON.stringify(cartObj),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const json = await response.json()
    await this.clearTicketsInCart(json.pickupPartiesId, cartObj.ticketQuantity)

    this.setState({
      purchaseSuccessful: true,
      purchaseFailed: false,
      purchasePending: false,
      displayQuantity: false,
      inCart: [],
      ticketQuantity: null,
      discountApplied: false,
      discountCode: null,
      afterDiscountObj: {},
    })

    window.removeEventListener("beforeunload", this.clearCartOnClose)
  }

  updatePurchaseField = event => {
    const newState = { ...this.state }
    const updateField = event.target.id
    const value = event.target.value
    const newValidElems = newState.validatedElements
    const invalidFields = newState.invalidFields

    const validatePhone = value => {
      var regex = /^\(?[(]([0-9]{3})\)?[) ]([0-9]{3})[-]([0-9]{4})$/;
      return regex.test(value);
    };

    const validateText = value => {
      // Allow space, apostrophe, hyphen, and period so e.g. "Dr. Hans-Peter O'Donnell" is valid
      return Validator.isAlpha(value, 'en-US', {ignore: " '-."});
    };

    switch (updateField) {
      case 'email':
        if (Validator.isEmail(value)) {
          newValidElems.email = value.trim();
          invalidFields.invalidEmail = false;
        } else {
          newValidElems.email = null;
        }

        break;
      case 'firstName':
        if (validateText(value)) {
          newValidElems.firstName = value.trim();
          invalidFields.invalidFirstName = false;
        } else {
          newValidElems.firstName = null;
        }

        break;
      case 'lastName':
        if (validateText(value)) {
          newValidElems.lastName = value.trim();
          invalidFields.invalidLastName = false;
        } else {
          newValidElems.lastName = null;
        }

        break;
      case 'willCallFirstName':
        if (validateText(value)) {
          newValidElems.wcFirstName = value.trim();
        } else {
          newValidElems.wcFirstName = null;
        }

        break;
      case 'willCallLastName':
        if (validateText(value)) {
          newValidElems.wcLastName = value.trim();
        } else {
          newValidElems.wcLastName = null;
        }

        break;
      case 'orderedByPhone':
        if (validatePhone(value)) {
          newValidElems.orderedByPhone = value.trim();
          invalidFields.invalidPhone = false;
        } else {
          newValidElems.orderedByPhone = null;
        }

        break;
      default:
        return 'Please input valid items';
    }

    // Populate cartToSend
    if (newValidElems.firstName
      && newValidElems.lastName
      && newValidElems.email
      && newValidElems.orderedByPhone) {
      newState.validated = true

      newState.cartToSend = {
        firstName: newValidElems.firstName,
        lastName: newValidElems.lastName,
        email: newValidElems.email,
        orderedByPhone: newValidElems.orderedByPhone,
        eventId: this.state.inCart[0].id,
        ticketQuantity: parseInt(this.state.ticketQuantity),
        pickupLocationId: parseInt(this.state.pickupLocationId),
        totalCost: Number(this.state.totalCost),
        userId: useStore.getState().btsUser.userDetails.userId,
        willCallFirstName: (newValidElems.wcFirstName || newValidElems.firstName),
        willCallLastName: (newValidElems.wcLastName || newValidElems.lastName)
      }

      this.setState({
        invalidFields,
        validatedElements: newValidElems,
        cartToSend: newState.cartToSend,
        validated: newState.validated
      })
    } else {
      newState.validated = false

      this.setState({
        validated: newState.validated,
        validatedElements: newValidElems
      })
    }
  }

  invalidOnSubmit = (e) => {
    let validElems = { ...this.state.validatedElements }
    let invalidFields = { ...this.state.invalidFields }

    invalidFields.invalidFirstName = validElems.firstName ? false : true
    invalidFields.invalidLastName = validElems.lastName ? false : true
    invalidFields.invalidEmail = validElems.email ? false : true
    invalidFields.invalidPhone = validElems.orderedByPhone ? false : true

    this.setState({ invalidFields })
  }

  removeFromCart = () => {
    const newState = { ...this.state }
    newState.displayWarning = false
    newState.displayConfirmRemove = true

    this.setState({
      displayConfirmRemove: newState.displayConfirmRemove,
      displayWarning: newState.displayWarning,
    })

    window.removeEventListener("beforeunload", this.clearCartOnClose)
  }

  confirmedRemove = () => {
    if (this.state.discountApplied) {
      this.releaseDiscountCode()
    }

    const newState = { ...this.state }

    const pickupPartyId = parseInt(newState.pickupPartyId)
    const ticketQty = parseInt(newState.ticketQuantity)
    this.clearTicketsInCart(pickupPartyId, ticketQty)
    this.ticketTimer(false)

    newState.inCart = []
    newState.displayConfirmRemove = false
    newState.displayWarning = false
    newState.displayQuantity = false
    newState.displayAddBtn = false
    newState.ticketQuantity = 0
    newState.pickupLocationId = null
    newState.validated = false
    newState.purchasePending = false
    newState.purchaseFailed = false
    newState.discountApplied = false
    newState.discountCode = null
    newState.afterDiscountObj = {}

    this.setState({
      validated: newState.validated,
      inCart: newState.inCart,
      displayConfirmRemove: newState.displayConfirmRemove,
      displayWarning: newState.displayWarning,
      displayQuantity: newState.displayQuantity,
      displayAddBtn: newState.displayAddBtn,
      ticketQuantity: newState.ticketQuantity,
      purchasePending: newState.purchasePending,
      purchaseFailed: newState.purchaseFailed,
      discountApplied: newState.discountApplied,
      discountCode: newState.discountCode,
      afterDiscountObj: newState.afterDiscountObj,
    })

    window.removeEventListener("beforeunload", this.clearCartOnClose)
  }

  closeAlert = () => {
    const newState = { ...this.state }
    newState.displayConfirmRemove = false
    newState.displayWarning = false
    this.setState({ displayConfirmRemove: newState.displayConfirmRemove, displayWarning: newState.displayWarning })
  }

  sortByArtist = () => {
    let newState = this.state.upcomingShows.sort((show1, show2) => {
      let a = show1.headliner.toLowerCase().split(" ").join("")
      let b = show2.headliner.toLowerCase().split(" ").join("")

      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    })

    this.setState({ shows: newState, artistIcon: true, dateIcon: false })
  }

  sortByDate = () => {
    let newState = this.state.upcomingShows.sort((show1, show2) => {
      let a = new Date(show1.date)
      let b = new Date(show2.date)
      return a - b
    })

    this.setState({ shows: newState, artistIcon: false, dateIcon: true })
  }

  makePurchase = event => {
    event.preventDefault()
    const newState = { ...this.state }

    newState.displayQuantity = false
    newState.displayAddBtn = false
    newState.purchasePending = true
    newState.purchaseFailed = false

    this.setState({
      purchaseFailed: newState.purchaseFailed,
      purchasePending: newState.purchasePending,
      displayQuantity: newState.displayQuantity,
      displayAddBtn: newState.displayAddBtn,
    })
  }

  render() {
    if (!this.state.upcomingShows) {
      return <div className="p-4 text-center">Loading...</div>;
    }

    if (this.state.displayCart || this.state.displayShow) {
      return <DetailCartView
        addToCart={this.addToCart}
        afterDiscountObj={this.state.afterDiscountObj}
        assignedParties={this.state.assignedParties}
        backToCalendar={this.backToCalendar}
        cartToSend={this.state.cartToSend}
        checked={this.state.checked}
        closeAlert={this.closeAlert}
        comp={this.comp}
        confirmedRemove={this.confirmedRemove}
        discountApplied={this.state.discountApplied}
        displayAddBtn={this.state.displayAddBtn}
        displayCart={this.state.displayCart}
        displayConfirmRemove={this.state.displayConfirmRemove}
        displayQuantity={this.state.displayQuantity}
        displayShow={this.state.displayShow}
        displayWarning={this.state.displayWarning}
        applyDiscountCode={this.applyDiscountCode}
        firstBusLoad={this.state.firstBusLoad}
        handleCheck={this.handleCheck}
        invalidFields={this.state.invalidFields}
        invalidOnSubmit={this.invalidOnSubmit}
        inCart={this.state.inCart}
        lastDepartureTime={this.state.lastDepartureTime}
        makePurchase={this.makePurchase}
        pickupLocations={this.state.pickupLocations}
        pickupLocationId={this.state.pickupLocationId}
        pickupPartyId={this.state.pickupPartyId}
        purchase={this.purchase}
        purchaseFailed={this.state.purchaseFailed}
        purchasePending={this.state.purchasePending}
        purchaseSuccessful={this.state.purchaseSuccessful}
        removeFromCart={this.removeFromCart}
        selectPickupLocationId={this.selectPickupLocationId}
        selectTicketQuantity={this.selectTicketQuantity}
        shows={this.state.upcomingShows}
        tabClicked={this.tabClicked}
        ticketsAvailable={this.state.ticketsAvailable}
        ticketTimer={this.ticketTimer}
        ticketQuantity={this.state.ticketQuantity}
        totalCost={this.state.totalCost}
        updateDiscountCode={this.updateDiscountCode}
        updatePurchaseField={this.updatePurchaseField}
        validated={this.state.validated}
        validatedElements={this.state.validatedElements}
        viewCart={this.viewCart} />;
    }

    return <ShowList
      confirmedRemove={this.confirmedRemove}
      filterString={this.state.filterString}
      handleWarning={this.handleWarning}
      inCart={this.state.inCart}
      searchShows={this.searchShows}
      shows={this.state.upcomingShows}
      showsExpandClick={this.showsExpandClick}
      sortByArtist={this.sortByArtist}
      sortByDate={this.sortByDate}
      sortedByArtist={this.state.artistIcon}
      sortedByDate={this.state.dateIcon}
      tabClicked={this.tabClicked} />;
  }
}

export default LayoutPage;
