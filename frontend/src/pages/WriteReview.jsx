import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReviewForm from '../components/ReviewForm';

// Opened from "My Sessions" for a Completed session: /review/:sessionId/:tutorId
function WriteReview() {
  const { sessionId, tutorId } = useParams();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (rating, comment) => {
    setError('');
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:3000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ sessionRequest: sessionId, tutor: tutorId, rating, comment })
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      navigate('/my-reviews');
    } catch (err) {
      setError('Could not reach the server');
    }
  };

  return (
    <main style={{ padding: '40px 20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Review your tutor</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ReviewForm buttonText="Submit review" onSubmit={handleSubmit} />
    </main>
  );
}

export default WriteReview;
