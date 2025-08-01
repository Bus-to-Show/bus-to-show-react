import React from 'react'
import moment from 'moment'

const CartItem = (props) => {
  const pickupTime = props.lastDepartureTime
  const firstBusLoad = props.firstBusLoad
  const pickupLocation = props.pickupLocations.find(location => parseInt(location.id) === parseInt(props.pickupLocationId))

  let time1 = pickupTime.split(':')
  let time2 = time1[1].split(' PM')[0] - 15
  let time3 = time1[0].concat(time2)

  if (time2 < 0) {
    time2 = 45
    time3 = [(time3.split('-')[0] - 1)].concat(time2).join('')
  }

  const defaultFirstBus = moment(time3, 'hmm').format('h:mm')

  return (
    <div className='CartItem'>
        {props.displayConfirmRemove ? '' :
          props.showsInCart.map(show =>
            <li className="px-4 py-2 list-item" key={show.id} id={show.id}>
              <div className="row border-top border-left border-right border-secondary bg-light p-2" id={show.id}>
                <div className="col-sm-12 cart-item-font pl-0">{props.ticketQuantity} Roundtrip Bus Spot(s) on {moment(show.date, "MM-DD-YYYY").format("dddd")}, {show.date}
                </div>
                <div className="col-sm-12 cart-item-font" id={show.id}>
                  <div className="row">For: {show.headliner} at {show.venue.split(' Amphitheatre')[0]}
                  </div>
                  <div className="row" id={show.id}>Departing From: {pickupLocation.locationName} <br />{pickupLocation.streetAddress}
                  </div>
                </div>
                <div className="cart-item-font" id={show.id}>
                  <button onClick={props.removeFromCart} type="button" className="btn-sm btn-outline-danger"> Remove </button>
                </div>
              </div>
              <div className="row border-left border-right border-bottom border-secondary bg-light p-2">
                <div className="col-md-12 cart-item-font pl-0">
                  First bus loads around: {firstBusLoad ?
                    firstBusLoad : defaultFirstBus}
                </div>
                <div className="col-md-12 cart-item-font red-text pl-0 mt-1">
                  Last bus departs at: {pickupTime}
                </div>
              </div>
            </li>)
        }
    </div>
  )
}

export default CartItem;
