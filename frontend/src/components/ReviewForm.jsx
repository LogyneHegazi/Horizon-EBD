import { useState } from 'react';

// One form for both writing a new review and editing an old one
function ReviewForm({ initialRating = 5, initialComment = '', buttonText, onSubmit, onCancel }) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(Number(rating), comment);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <label>
        Rating
        <select value={rating} onChange={(e) => setRating(e.target.value)} style={{ padding: '10px', width: '100%' }}>
          <option value="5">5 - Excellent</option>
          <option value="4">4 - Good</option>
          <option value="3">3 - Okay</option>
          <option value="2">2 - Poor</option>
          <option value="1">1 - Bad</option>
        </select>
      </label>
      <textarea
        placeholder="How was your session?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
        rows="4"
        style={{ padding: '10px' }}
      />
      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="submit" style={{ padding: '10px' }}>{buttonText}</button>
        {onCancel && <button type="button" onClick={onCancel} style={{ padding: '10px' }}>Cancel</button>}
      </div>
    </form>
  );
}

export default ReviewForm;
