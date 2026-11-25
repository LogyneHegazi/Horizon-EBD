import { useEffect, useState } from 'react';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:3000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setProfile(data.user);
        } else {
          setError(data.message);
        }
      })
      .catch(() => setError('Could not reach the server'));
  }, []);

  return (
    <main style={{ padding: '40px 20px', maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>My profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {profile && (
        <>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
        </>
      )}
    </main>
  );
}

export default Profile;