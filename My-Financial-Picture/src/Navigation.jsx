import { Link } from 'react-router-dom';

    function Navigation() {
      return (
        <div className='nav'>
            <Link to="/">Login</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/about">About</Link>
        </div>
      );
    }

    export default Navigation;