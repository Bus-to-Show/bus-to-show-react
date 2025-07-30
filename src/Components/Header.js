import {useLocation, useNavigate} from 'react-router-dom';

import {useStore} from '../Store';

const Header = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const {btsUser, setBtsUser} = useStore();

  const logout = () => {
    localStorage.setItem('jwt', '');

    setBtsUser({
      isLoggedIn: false,
      id: '1',
      firstName: 'Guest',
    });
  };

  if (!btsUser.isLoggedIn) {
    return (
      <nav className="d-flex justify-content-between mb-3">
        <div>
          {location.pathname !== '/' && (
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              <i className="fas fa-arrow-left"></i> Back to Calendar
            </button>
          )}
        </div>
        <div>
          {location.pathname !== '/login' && (
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              Log In
            </button>
          )}
        </div>
      </nav>
    );
  }

  return (
    <nav className="d-flex justify-content-between mb-3">
      <div>
        {location.pathname !== '/' && (
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            <i className="fas fa-arrow-left"></i> Back to Calendar
          </button>
        )}
      </div>
      <div>
        <div className="btn-group">
          <button className="btn btn-primary dropdown-toggle" data-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false">
            {btsUser.firstName || 'Account'}
          </button>
          <div className="dropdown-menu dropdown-menu-right">
            <button className="dropdown-item" onClick={() => navigate('/orders')}>Orders</button>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item" onClick={logout}>Log Out</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
