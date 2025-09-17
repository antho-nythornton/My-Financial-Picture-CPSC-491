import { Link } from 'react-router-dom';

    function Navigation() {
      return (
        <div className='nav'>
            <Link to="/">Login</Link>
            <Link to="/Dashboard">Dashboard</Link>
            <Link to="/about">About</Link>
            {/* <Link to="/started">Started</Link> */}
        </div>
      );
    }

    export default Navigation;