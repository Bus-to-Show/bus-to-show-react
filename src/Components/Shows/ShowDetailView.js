import React from 'react'
import logo from '../../Images/Logos/bts-logo-gray.png'
import moment from 'moment'

const ShowDetailView = (props) => {
  let show;
  let headlinerBio

  if (props.displayShow) {
    show = props.displayShow

    if(show.headlinerBio){
    headlinerBio = show.headlinerBio.split('<a')[0]
    }
  }

  console.log('show ==>>==>> ', show);

  let basePrice;

  if (props.pickupPartyId) {
    basePrice = props.assignedParties.find(party => parseInt(party.id) === parseInt(props.pickupPartyId)).partyPrice.toFixed(2)
  }

  return (
    <div className='ShowDetailView'>
        {props.displayShow && !props.displayCart ?
          <div className="show-details">
            <h3>Bus Rides to {show.headliner}</h3>
            <h4>{moment(show.date, "MM-DD-YYYY").format("dddd")} - {show.date} at {show.venue.split(' Amphitheatre')[0]} (and back)</h4>
            <div className="list-group">
              <div className="list-group-item">
                <div className='row container justify-content-center'>
                  <div className="col-7 artist-info bio-font">
                    {show.headlinerBio ? headlinerBio :
                      <div>
                        <div className='row'>
                          <div className="col-md-12">
                            {
                              <p>
                                Bus to Show was delivered to the present through intertemporal telepathic communication (ITC) from the future (13 years from now (the 5th year of the convergence)) as part of a strategy to implement systems in the past (present) designed to save the future (of existence) by reducing the impaired driving (preventing tragic disruptions in the trajectory of life energies embodied by future pivotal leaders) and fuel consumption  that results from events (acceleration of the consequences of climate change).  All you have to do be part of the solution, is ride the bus.
                                <br />
                                <br />
                                Bus to Show is a Colorado Nonprofit Corporation with the ability to accept 501(c)(3) tax-exempt donations through its fiscal sponsor partnership with The Nowak Society.
                              </p>
                            }
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6 offset-md-1 mt-3 no-info-logo">
                            <img src={logo} width="233" height="100" className="d-inline-block align-top" alt="bts-logo" />
                          </div>
                        </div>
                      </div>}
                  </div>
                  <div className="col-5 artist-image">
                    <div className="row bts-logo-flex">
                      {show.headlinerImgLink ?
                        <img className='headliner-img' src={show.headlinerImgLink} alt="headliner" />
                        :
                        <img src={logo} alt="bts-logo" className='bts-logo-sDV' />
                      }
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-7">
                    <div className='mt-2'>Departure Options</div>
                    <form className="needs-validation">
                      <div className="form-group">
                        <div>
                          <div id="departureOption" className={`mt-2 ${props.displayQuantity ? 'is-valid' : ''} `} onChange={props.selectPickupLocationId}  required>
                            {props.assignedParties ? props.assignedParties.map(location => {
                                return (
                                  <div className="radio btn-block-admin border-top border-bottom small pt-1"  key={location.id}>
                                    <label>
                                      <input
                                      className=""
                                      type="radio"
                                      name="optradio"
                                      key={location.id}
                                      id={location.id}
                                      value={location.id}/>{`${location.firstBusLoadTime ? `${moment(location.firstBusLoadTime, 'LT').format('h:mm A')} -` : ``}`} {moment(location.lastBusDepartureTime, 'LT').format('h:mm A')} || {location.LocationName} - ${location.partyPrice.toFixed(2)} each
                                    </label>
                                  </div>
                                )
                              })
                              : ''}
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="col-md-5 float-right add-top-margin">
                    {props.displayQuantity && props.ticketsAvailable ?
                      <React.Fragment>
                        <h5>
                          <span className='badge badge-secondary align-left'>
                            <div>${basePrice} per ticket</div>
                            <div>+ ${show.id === 40300786 ? 0.00 : (basePrice * .1).toFixed(2)} processing fee</div>
                          </span>
                        </h5>
                      </React.Fragment>
                      : ''}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-7">
                    {props.displayQuantity ?
                      <React.Fragment>
                        <div>
                          Ticket Quantity
                        </div>
                        <form className="needs-validation">
                          <div className="form-group">
                            {props.ticketsAvailable.length < 1 ?
                              <button
                                className="btn btn-danger"
                                disabled="disabled"
                                type="button">Currently sold out! Select another location or try back later. </button>
                              :
                              <select
                                className={`custom-select mt-2 ${props.displayAddBtn ? 'is-valid' : ''}`}
                                onChange={props.selectTicketQuantity}
                                disabled={props.ticketsAvailable.length === 0 ? 'disabled' : ''}
                                required>
                                <option value="">Select Quantity</option>
                                {props.ticketsAvailable.map(number => <option key={number} value={number}>{number}</option>)}
                              </select>}
                          </div>
                        </form>
                      </React.Fragment> : ''}
                  </div>
                  <div className="col-md-5 float-right mt-4 py-2">
                    {props.displayAddBtn && props.displayQuantity ?
                      <div>
                        <h3><span className="badge badge-success">
                          Total: ${props.totalCost}
                        </span></h3>
                      </div> : ''}
                  </div>
                </div>
              </div>
              <div className="list-group-item">
                <div className='row col-md-12'>
                  <button type="button" onClick={props.backToCalendar} className="btn btn-outline-danger return-btn float-right">Cancel</button>
                  {props.displayAddBtn ?
                    <button role="tabpanel" aria-labelledby="cart-tab" type="button" onClick={props.addToCart} className="btn btn-outline-primary return-btn ml-2 float-right">Add to Cart</button> : ''}
                </div>
              </div>
            </div>
          </div> : ''}
    </div>
  )
}

export default ShowDetailView;
