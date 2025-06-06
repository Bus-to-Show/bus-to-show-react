import React from 'react'
import '../../App.css';

const ReservationsList = (props) => {
  let { filterString, reservations, toggleCheckedIn } = props

  reservations = reservations.sort((a, b) => {
    let aLastName = a.willCallLastName.toLowerCase()
    let bLastName = b.willCallLastName.toLowerCase()
    if(aLastName < bLastName) {return -1}
    if(aLastName > bLastName) {return 1}
    if(aLastName === bLastName) return (a.id - b.id)
    return 0
  })

  filterString = filterString.toLowerCase()
  let filterRezzies = reservations.filter(rezzy => rezzy.orderedByFirstName.toLowerCase().includes(filterString) || rezzy.orderedByLastName.toLowerCase().includes(filterString) ||rezzy.willCallLastName.toLowerCase().includes(filterString) || rezzy.willCallFirstName.toLowerCase().includes(filterString))

  const isPresent =(status)=>{
    if (~~status === 1) return( <span id="switchLabel" style={{color: '#ff420f'}}>Absent</span>)
    else if (~~status === 2) return (<span id="switchLabel" style={{color: '#460088'}}>Present</span>)
  }

  return (
    <div className='Reservations'>
      {filterRezzies.length > 0 ?
        filterRezzies.forEach(reservation => {
          const { willCallFirstName, willCallLastName, orderedByFirstName, orderedByLastName } = reservation
          let toggleStatus = ~~reservation.status

          if (toggleStatus === 3 || toggleStatus === 4) return null  //reservation status 3 === refunded (don't display)
          if (toggleStatus === 1 || toggleStatus === 2)

          return <li className="list-group-item admin-list-item"
            key={reservation.id}
            id={reservation.id}
            style={{  borderRadius: '1px', padding: '.1rem .5rem' }}>
          <div className="row" id={reservation.id}>
            <div className="col-sm-8 list-item-font" id={reservation.id}>
              <strong style={{fontSize: '18px'}}>{willCallLastName}, {willCallFirstName}</strong>
              <br />
              Alt: {orderedByLastName}, {orderedByFirstName}
            </div>
            <div className="col-md-4 text-right" id={reservation.id}>
              Status: {isPresent(reservation.status)}
              <label className="switch ml-2">
                <input type="checkbox"
                className="default"
                checked={toggleStatus === 2 ? 'checked' : ''}
                onChange={event=>{toggleStatus = (toggleStatus === 1 ? 2 : 1);  toggleCheckedIn(event.target.checked, reservation)}} />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </li>
        })
      : 'Reservations not found'}
    </div>
  )
}

export default ReservationsList;
