import { Link, useNavigate } from 'react-router-dom';

function Header({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <header style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '10px', padding: '15px 20px', borderBottom: '1px solid #444', fontFamily: 'sans-serif' }}>
      <Link to="/" style={{ fontWeight: 'bold', fontSize: '20px', textDecoration: 'none' }}>Study Bridge</Link>

      <nav style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {user ? (
          <>
            <Link to="/profile">Profile</Link>
            <span>Hi, {user.name}</span>
            <button onClick={handleLogout} style={{ padding: '6px 12px' }}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;