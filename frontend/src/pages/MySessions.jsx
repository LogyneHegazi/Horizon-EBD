
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function MySessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(
          'http://localhost:3000/api/session-requests/my-sessions',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load your sessions');
        }

        setSessions(data.sessions || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) return <p>Loading your sessions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>My Tutoring Sessions</h1>

      {sessions.length === 0 ? (
        <p>You haven't requested any tutoring sessions yet.</p>
      ) : (
        sessions.map((session) => {
          const tutorId = session.listing?.tutor?._id;

          return (
            <div key={session._id}>
              <h2>{session.listing?.title || 'Tutoring session'}</h2>
              <p>Subject: {session.listing?.subject || 'N/A'}</p>
              <p>
                Tutor: {session.listing?.tutor?.name || 'Unknown'}
              </p>
              <p>
                Date: {new Date(session.scheduledAt).toLocaleString()}
              </p>
              <p>Status: {session.status}</p>

              {session.status === 'Completed' && tutorId && (
                <Link to={`/review/${session._id}/${tutorId}`}>
                  Write Review
                </Link>
              )}

              <hr />
            </div>
          );
        })
      )}
    </div>
  );
}

export default MySessions;

