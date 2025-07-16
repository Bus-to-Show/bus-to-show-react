import React, {useState} from 'react'

import moment from 'moment';

import {sendRequest} from '../../api';

const Order = (props) => {
  const {order} = props;

  const [editing, setEditing] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [success, setSuccess] = useState();
  const [validationErrors, setValidationErrors] = useState({});

  const [inputs, setInputValues] = useState({
    willCallFirstName: order.reservations[0].willCallFirstName,
    willCallLastName: order.reservations[0].willCallLastName,
  });

  const onChange = (event) => {
    setInputValues({
      ...inputs,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const cancelEdit = (event) => {
    event.preventDefault();

    inputs.willCallFirstName = order.reservations[0].willCallFirstName;
    inputs.willCallLastName = order.reservations[0].willCallLastName;

    setEditing(false);
  };

  const editOrder = () => {
    setEditing(true);
    setSuccess();
  };

  const updateOrder = async (event) => {
    event.preventDefault();

    setError();

    if (!validate()) {
      return;
    }

    setLoading(true);

    const result = await sendRequest({
      path: `orders/${order.id}`,
      data: {
        willCallFirstName: inputs.willCallFirstName,
        willCallLastName: inputs.willCallLastName,
      },
      method: 'PATCH',
    });

    setLoading(false);

    if (result.error) {
      setError(`Unable to update order: ${result.error}`);
      return;
    }

    order.reservations[0].willCallFirstName = inputs.willCallFirstName;
    order.reservations[0].willCallLastName = inputs.willCallLastName;

    setEditing(false);
    setSuccess('Order updated.');
  };

  const validate = () => {
    const errors = {};

    if (!inputs.willCallFirstName) {
      errors.willCallFirstName = 'Please enter your first name.';
    }

    if (!inputs.willCallLastName) {
      errors.willCallLastName = 'Please enter your last name.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const {firstBusLoadTime, lastBusDepartureTime} = order.pickupParty;
  const {locationName, streetAddress} = order.pickupLocation;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURI(streetAddress)}`;

  return (
    <div className="card mb-3">
      <div className="card-header">
        {moment(order.event.date, 'MM/DD/YYYY').format('dddd, MMMM Do YYYY')}
      </div>
      <div className="card-body">
        <h5 className="card-title">
          {order.event.headliner} at {order.event.venue}
        </h5>
        <h6 className="card-subtitle">
          {order.reservations.length} round trip tickets
        </h6>
        <div className="mt-3">
          Departing from {locationName}
        </div>
        <div>
          {streetAddress}
          <a className="btn btn-link" href={mapUrl} rel="noreferrer" target="_blank">
            <i className="fas fa-map"></i> Map
          </a>
        </div>
        {firstBusLoadTime && lastBusDepartureTime ? (
          <>
            <div className="mt-3">
              First load @ {moment(firstBusLoadTime, 'hhmm').format('h:mm a')}
            </div>
            <div>
              Last departure @ {moment(lastBusDepartureTime, 'hhmm').format('h:mm a')}
            </div>
          </>
        ) : (
          <div>
            Departs @ {moment(lastBusDepartureTime, 'hhmm').format('h:mm a')}
          </div>
        )}
        {!editing ? (
          <div className="mt-3">
            Will call: {inputs.willCallFirstName} {inputs.willCallLastName}
            <button className="btn btn-link" onClick={editOrder}>
              <i className="fas fa-edit"></i> Edit
            </button>
          </div>
        ) : (
          <form className="mt-3">
            <div className="form-group">
              <label htmlFor="willCallFirstName">First name</label>
              <input type="text" className="form-control" id="willCallFirstName" name="willCallFirstName"
                onChange={onChange} value={inputs.willCallFirstName} />
              {validationErrors.willCallFirstName && (
                <div className="validation-error">{validationErrors.willCallFirstName}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="willCallLastName">Last name</label>
              <input type="text" className="form-control" id="willCallLastName" name="willCallLastName"
                onChange={onChange} value={inputs.willCallLastName} />
              {validationErrors.willCallLastName && (
                <div className="validation-error">{validationErrors.willCallLastName}</div>
              )}
            </div>
            <button className="btn btn-primary" disabled={loading} onClick={updateOrder}>
              Update
            </button>
            <button className="btn btn-outline-primary ml-3" disabled={loading} onClick={cancelEdit}>
              Cancel
            </button>
          </form>
        )}
        {loading && (
          <div className="loading mt-3"></div>
        )}
        {error && (
          <div className="alert alert-danger mt-3" role="alert">{error}</div>
        )}
        {success && (
          <div className="alert alert-success mt-3" role="alert">{success}</div>
        )}
      </div>
    </div>
  );
};

export default Order;
