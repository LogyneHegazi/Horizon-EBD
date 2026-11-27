
import { useEffect, useState } from 'react';

function BrowseListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedSlots, setSelectedSlots] = useState({});
  const [messages, setMessages] = useState({});
  const [feedback, setFeedback] = useState({});
  const [submitting, setSubmitting] = useState({});

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(
          'http://localhost:3000/api/session-requests/listings',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load listings');
        }

        setListings(data.listings || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleRequest = async (listingId) => {
    const slotId = selectedSlots[listingId];

    if (!slotId) {
      setFeedback((prev) => ({
        ...prev,
        [listingId]: 'Please select a time slot.'
      }));
      return;
    }

    try {
      setSubmitting((prev) => ({
        ...prev,
        [listingId]: true
      }));

      const token = localStorage.getItem('token');

      const response = await fetch(
        'http://localhost:3000/api/session-requests',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            listingId,
            slotId,
            message: messages[listingId] || ''
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      setFeedback((prev) => ({
        ...prev,
        [listingId]: 'Your tutoring request was submitted successfully!'
      }));

      setSelectedSlots((prev) => ({
        ...prev,
        [listingId]: ''
      }));

      setMessages((prev) => ({
        ...prev,
        [listingId]: ''
      }));

    } catch (err) {
      setFeedback((prev) => ({
        ...prev,
        [listingId]: err.message
      }));
    } finally {
      setSubmitting((prev) => ({
        ...prev,
        [listingId]: false
      }));
    }
  };

  if (loading) return <p>Loading tutoring listings...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Browse Tutoring Listings</h1>

      {listings.length === 0 ? (
        <p>No tutoring listings available yet.</p>
      ) : (
        listings.map((listing) => (
          <div key={listing._id}>
            <h2>{listing.title}</h2>

            <p>Subject: {listing.subject}</p>
            <p>{listing.description}</p>
            <p>
              Tutor: {listing.tutor?.name || 'Unknown'}
            </p>
            <p>Mode: {listing.mode}</p>

            <h3>Available Time Slots</h3>

            {listing.availableSlots?.length > 0 ? (
              <select
                value={selectedSlots[listing._id] || ''}
                onChange={(e) =>
                  setSelectedSlots((prev) => ({
                    ...prev,
                    [listing._id]: e.target.value
                  }))
                }
              >
                <option value="">Choose a time slot</option>

                {listing.availableSlots.map((slot) => (
                  <option key={slot._id} value={slot._id}>
                    {new Date(slot.startsAt).toLocaleString()}
                    {' - '}
                    {new Date(slot.endsAt).toLocaleTimeString()}
                  </option>
                ))}
              </select>
            ) : (
              <p>No available time slots.</p>
            )}

            <h3>Message to Tutor (Optional)</h3>

            <textarea
              placeholder="Write a message to your tutor..."
              value={messages[listing._id] || ''}
              onChange={(e) =>
                setMessages((prev) => ({
                  ...prev,
                  [listing._id]: e.target.value
                }))
              }
            />

            <br />

            <button
              onClick={() => handleRequest(listing._id)}
              disabled={
                !listing.availableSlots?.length ||
                submitting[listing._id]
              }
            >
              {submitting[listing._id]
                ? 'Submitting...'
                : 'Request Session'}
            </button>

            {feedback[listing._id] && (
              <p>{feedback[listing._id]}</p>
            )}

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default BrowseListings;

