import React from 'react'
import moment from 'moment'

const Show = (props) => {
  const filterString = props.filterString.toLowerCase()
  let filterShows = props.shows.filter(show => show.headliner.toLowerCase().includes(filterString))

  if (filterShows.length === 0) {
    filterShows = props.shows.filter(show => show.venue.toLowerCase().includes(filterString))
  }

  const onEmptyCartDetailClick = event => {
    props.confirmedRemove()
    props.showsExpandClick(event)
    props.tabClicked(event)
  }

  return (
    <div className='Shows'>
        {filterShows.length > 0 ? filterShows.map(show =>
          <li className="list-group-item highlightOnHover show-list-item" key={show.id} id={show.id}>
            <div className="row" id={show.id}>
              <div className="col-md-3 list-item-font" id={show.id}>{show.date} <br /> {moment(show.date, "MM-DD-YYYY").format("dddd")}</div>
              <div className="col-md-7 list-item-font" id={show.id}>
                <strong>{show.headliner}</strong> <br />
                {show.support1 ? <React.Fragment> with {show.support1} <br /> </React.Fragment> : ''}
                {show.support2 ? <React.Fragment> and more! <br /> </React.Fragment> : ''}
                {show.venue}
              </div>
                <button
                  id={show.id}
                  onClick={e => {
                    if (props.inCart.length > 0) props.handleWarning()
                    else onEmptyCartDetailClick(e)
                  }}
                  type="button"
                  className='btn detail-btn my-4 col-md-2'>Details</button>
            </div>
          </li>) :
          <li className="list-group-item highlightOnHover">
            <div className="row add-a-show">
              <div className="col-md-12 col-xs-12">
                <h5 className='black-text'>I find our lack of that show disturbing.</h5>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 col-xs-12">
                <button type="button" disabled='disabled' className="btn btn-outline-primary mt-2">Add that show feature coming soon!</button>
              </div>
            </div>
          </li>}
    </div>
  )
}

export default Show;
