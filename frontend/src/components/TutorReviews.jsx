import { useEffect, useState } from 'react';

// Shows all reviews of one tutor. To be placed on the tutor's listing page:
// <TutorReviews tutorId={listing.tutor._id} />
function TutorReviews({ tutorId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/api/reviews/tutor/${tutorId}`)
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews || []))
      .catch(() => setReviews([]));
  }, [tutorId]);

  if (reviews.length === 0) {
    return <p>No reviews yet.</p>;
  }

  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <section>
      <h3>Reviews ({average.toFixed(1)} ★ from {reviews.length})</h3>
      {reviews.map((review) => (
        <div key={review._id} style={{ borderTop: '1px solid #444', padding: '10px 0' }}>
          <p style={{ margin: 0 }}>
            <strong>{review.student ? review.student.name : 'Student'}</strong> · {'★'.repeat(review.rating)}
          </p>
          <p style={{ margin: '5px 0 0' }}>{review.comment}</p>
        </div>
      ))}
    </section>
  );
}

export default TutorReviews;
