import { useNavigate, useLocation } from 'react-router-dom';

import '../App.css';
import { useStore } from '../Store';

const Header = (props) => {
  const {btsUser} = useStore();

  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (event) => {
    if (location.pathname === '/') {
      navigate('/login');
    } else {
      navigate('/');
    }
  };

  return (
    <nav className='Header pb-4'>
      <button className="btn detail-btn mr-2" onClick={handleClick}>
        {
          location.pathname === '/'
            ? btsUser.isLoggedIn
              ? 'Dashboard'
              : 'Sign In/Up'
            : 'Back to Events'
        }
      </button>
    </nav>
  );
}

export default Header;
