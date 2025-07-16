import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom';

import Order from './Order';
import {sendRequest} from '../../api';
import {useStore} from '../../Store';

const Orders = () => {
  const navigate = useNavigate();

  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [orders, setOrders] = useState({});
  const [showPast, setShowPast] = useState(false);

  const {btsUser} = useStore();

  useEffect(() => {
    if (!btsUser.isLoggedIn) {
      navigate('/');
      return;
    }

    loadOrders();
  }, [btsUser]);

  const loadOrders = async () => {
    setLoading(true);

    const result = await sendRequest({
      path: `orders/${btsUser.userID}`,
    });

    setLoading(false);

    if (result.error) {
      setError(`Unable to load orders: ${result.error}`);
      return;
    }

    const orders = {};

    for (const row of result) {
      if (orders[row.orderId]) {
        orders[row.orderId].reservations.push({
          id: row.reservationsId,
          willCallFirstName: row.willCallFirstName,
          willCallLastName: row.willCallLastName,
        });
      } else {
        orders[row.orderId] = {
          id: row.orderId,
          event: {
            date: row.date,
            headliner: row.headliner,
            venue: row.venue,
          },
          pickupLocation: {
            locationName: row.locationName,
            latitude: row.latitude,
            longitude: row.longitude,
            streetAddress: row.streetAddress,
          },
          pickupParty: {
            firstBusLoadTime: row.firstBusLoadTime,
            lastBusDepartureTime: row.lastBusDepartureTime,
          },
          reservations: [{
            id: row.reservationsId,
            willCallFirstName: row.willCallFirstName,
            willCallLastName: row.willCallLastName,
          }],
        };
      }
    }

    setOrders(orders);
  };

  const renderOrders = () => {
    const filteredOrders = Object.values(orders).filter(order =>
      showPast
        ? new Date(order.event.date) < Date.now()
        : new Date(order.event.date) >= Date.now()
    );

    if (!filteredOrders.length) {
      return (
        <div className="alert alert-primary" role="alert">
          No {showPast ? 'past' : 'upcoming'} orders found.
        </div>
      );
    }

    return filteredOrders.map(order =>
      <Order key={order.id} order={order} />
    );
  };

  if (loading) {
    return <div className="loading"></div>;
  }

  if (error) {
    return <div className="alert alert-danger" role="alert">{error}</div>;
  }

  return (
    <>
      <h3 className="text-center">Orders</h3>
      <nav className="nav nav-tabs mb-3">
        <button className={`nav-item nav-link ${!showPast ? 'active' : ''}`}
          onClick={() => setShowPast(false)}>Upcoming</button>
        <button className={`nav-item nav-link ${showPast ? 'active' : ''}`}
          onClick={() => setShowPast(true)}>Past</button>
      </nav>
      {renderOrders()}
    </>
  );
};

export default Orders;
