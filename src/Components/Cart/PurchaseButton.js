import React from 'react';
import StripeCheckout from 'react-stripe-checkout'

const stripePublic = `${process.env.REACT_APP_STRIPE_PUBLIC}`;
const fetchUrl = `${process.env.REACT_APP_API_URL}`

const PurchaseButton = (props) => {
  const onToken = (token) => {
    props.ticketTimer(false);
    const orderInfo = props.cartToSend;
    const totalCostInt = parseInt(props.totalCost * 100);
    orderInfo.receiptDescription = props.receiptDescription;

    fetch(`${fetchUrl}/orders/charge`, {
      method: 'POST',
      body: JSON.stringify({
        stripeEmail: token.email,
        stripeToken: token,
        amount: totalCostInt,
        metadata: orderInfo
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async response => {
      const json = await response.json()

      if (json.status === "succeeded") {
        props.purchase();
      } else {
        props.purchase(json);
      }
    });
  }

  const disabled = !props.validated || !props.waiverChecked || props.purchasePending;
  const email = props.cartToSend.email;

  const selectResponse = e => {
    !disabled ?
      props.makePurchase(e) :
      props.invalidOnSubmit(e)
  }

  const totalCostInt = parseInt(props.totalCost * 100);

  return (
    <React.Fragment>
      {!totalCostInt ?
        <button
          onClick={props.comp}
          className={`btn mr-1 ${!disabled ? 'btn-outline-success' : 'btn-secondary'}`}
        >
          Happy Birthday
        </button>
        :
        <StripeCheckout
          token={onToken}
          stripeKey={stripePublic}
          name='Bus To Show'
          description='Receipt will be emailed after purchase'
          email={email}
          amount={Number(props.totalCost) * 100}
          currency='USD'
          metadata={props.cartToSend}
          disabled={disabled}
        >
          <button
            onClick={e => selectResponse(e)}
            className={`btn mr-1 ${!disabled ? 'btn-outline-success' : 'btn-secondary'}`}
          >
            Purchase
          </button>
        </StripeCheckout>
      }
    </React.Fragment>
  );
};

export default PurchaseButton;
