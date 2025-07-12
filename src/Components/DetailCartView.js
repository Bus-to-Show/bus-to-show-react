import React from 'react'
import '../App.css';
import ShowDetailView from './Shows/ShowDetailView'
import Cart from './Cart/Cart'
import MediaQuery from 'react-responsive';

const DetailCartView = (props) => {

  return (
    <div className="DetailCartView">
      {/* // Desktop View */}
      <MediaQuery minWidth={8}>
        <React.Fragment>
          <div className='container'>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item">
                <a
                  onClick={props.tabClicked}
                  className={`nav-link ${props.displayCart ? '' : 'active'} ${props.displayCart && props.inCart.length > 0 ? 'disabled' : ''}`}
                  id="showDetails-tab"
                  data-toggle="tab"
                  href="#showDetails"
                  role="tab"
                  aria-controls="showDetails"
                  aria-selected="true">Show Details</a>
              </li>
              <li className="nav-item">
                <a
                  onClick={props.tabClicked}
                  className={`nav-link ${props.displayCart ? 'active' : ''}`}
                  id='cart-tab'
                  data-toggle="tab"
                  href="#cart"
                  role="tab"
                  aria-controls="cart"
                  aria-selected="false">My Cart</a>
              </li>
            </ul>

            <div className="tab-content" id="desktop-tab-content">
              {props.displayCart ?
                <Cart
                  afterDiscountObj={props.afterDiscountObj}
                  backToCalendar={props.backToCalendar}
                  cartToSend={props.cartToSend}
                  checked={props.checked}
                  comp={props.comp}
                  confirmedRemove={props.confirmedRemove}
                  closeAlert={props.closeAlert}
                  discountApplied={props.discountApplied}
                  displayConfirmRemove={props.displayConfirmRemove}
                  displayShow={props.displayShow}
                  displayWarning={props.displayWarning}
                  applyDiscountCode={props.applyDiscountCode}
                  firstBusLoad={props.firstBusLoad}
                  handleCheck={props.handleCheck}
                  inCart={props.inCart}
                  invalidFields={props.invalidFields}
                  invalidOnSubmit={props.invalidOnSubmit}
                  lastDepartureTime={props.lastDepartureTime}
                  makePurchase={props.makePurchase}
                  pickupLocationId={props.pickupLocationId}
                  pickupLocations={props.pickupLocations}
                  purchase={props.purchase}
                  purchaseFailed={props.purchaseFailed}
                  purchasePending={props.purchasePending}
                  purchaseSuccessful={props.purchaseSuccessful}
                  removeFromCart={props.removeFromCart}
                  shows={props.shows}
                  showsInCart={props.inCart}
                  ticketTimer={props.ticketTimer}
                  ticketQuantity={props.ticketQuantity}
                  totalCost={props.totalCost}
                  updateDiscountCode={props.updateDiscountCode}
                  updatePurchaseField={props.updatePurchaseField}
                  validated={props.validated}
                  validatedElements={props.validatedElements} /> :
                <ShowDetailView
                  addToCart={props.addToCart}
                  assignedParties={props.assignedParties}
                  backToCalendar={props.backToCalendar}
                  displayAddBtn={props.displayAddBtn}
                  displayCart={props.displayCart}
                  displayQuantity={props.displayQuantity}
                  displayShow={props.displayShow}
                  pickupPartyId={props.pickupPartyId}
                  selectPickupLocationId={props.selectPickupLocationId}
                  selectTicketQuantity={props.selectTicketQuantity}
                  ticketsAvailable={props.ticketsAvailable}
                  totalCost={props.totalCost}
                  viewCart={props.viewCart} />}
            </div>
          </div>
        </React.Fragment>
      </MediaQuery>
      {/* // End DesktopView */}


    </div>
  )
}

export default DetailCartView;
