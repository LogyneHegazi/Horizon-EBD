import { useEffect, useState } from 'react';
import ReviewForm from '../components/ReviewForm';

function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const loadReviews = () => {
    fetch('http://localhost:3000/api/reviews/mine', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews) {
          setReviews(data.reviews);
        } else {
          setError(data.message);
        }
      })
      .catch(() => setError('Could not reach the server'));
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleUpdate = async (id, rating, comment) => {
    setError('');
    const res = await fetch(`http://localhost:3000/api/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ rating, comment })
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

    setEditingId(null);
    loadReviews();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    setError('');

    const res = await fetch(`http://localhost:3000/api/reviews/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

    loadReviews();
  };

  return (
    <main style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>My reviews</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {reviews.length === 0 && !error && <p>You have not written any reviews yet.</p>}

      {reviews.map((review) => (
        <div key={review._id} style={{ border: '1px solid #444', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
          <p><strong>Tutor:</strong> {review.tutor ? review.tutor.name : 'Unknown'}</p>

          {editingId === review._id ? (
            <ReviewForm
              initialRating={review.rating}
              initialComment={review.comment}
              buttonText="Save"
              onSubmit={(rating, comment) => handleUpdate(review._id, rating, comment)}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <>
              <p><strong>Rating:</strong> {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
              <p>{review.comment}</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setEditingId(review._id)} style={{ padding: '6px 12px' }}>Edit</button>
                <button onClick={() => handleDelete(review._id)} style={{ padding: '6px 12px' }}>Delete</button>
              </div>
            </>
          )}
        </div>
      ))}
    </main>
  );
}

export default MyReviews;
