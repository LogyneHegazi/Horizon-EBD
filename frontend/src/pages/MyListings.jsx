import { useState, useEffect } from 'react';

import {
    getMyListings,
    updateListing as updateListingAPI,
    deactivateListing as deactivateListingAPI,
    reactivateListing as reactivateListingAPI,
    deleteListing as deleteListingAPI
} from '../services/listingService';

function MyListings() {

    // Store listings retrieved from MongoDB
    const [listings, setListings] = useState([]);

    // Track loading state
    const [loading, setLoading] = useState(true);

    // Store error messages
    const [error, setError] = useState('');

    // Store the ID of the listing being edited
    const [editingId, setEditingId] = useState(null);

    // Store the edited information
    const [editForm, setEditForm] = useState(null);

    // Convert dates to the format required by datetime-local
    const formatDateTime = (date) => {
        const d = new Date(date);

        const offset = d.getTimezoneOffset();
        return new Date(d.getTime() - offset * 60000)
            .toISOString()
            .slice(0, 16);
    };

    // Retrieve the tutor's listings when the page loads
    useEffect(() => {

        const fetchListings = async () => {
            try {
                setLoading(true);
                setError('');

                const data = await getMyListings();

                setListings(data.listings);

            } catch (error) {
                setError(error.message);

            } finally {
                setLoading(false);
            }
        };

        fetchListings();

    }, []);

    // Open the editing form
    const handleEdit = (listing) => {
        setEditingId(listing._id);

        setEditForm({
            ...listing,
            availableSlots: listing.availableSlots.map(slot => ({
                startsAt: formatDateTime(slot.startsAt),
                endsAt: formatDateTime(slot.endsAt)
            }))
        });
    };

    // Handle normal input changes
    const handleEditChange = (e) => {
        const { name, value } = e.target;

        setEditForm({
            ...editForm,
            [name]: value
        });
    };

    // Handle time slot changes
    const handleSlotChange = (index, e) => {
        const { name, value } = e.target;

        const updatedSlots = editForm.availableSlots.map((slot, i) =>
            i === index ? { ...slot, [name]: value } : slot
        );

        setEditForm({
            ...editForm,
            availableSlots: updatedSlots
        });
    };

    // Add another time slot
    const addSlot = () => {
        setEditForm({
            ...editForm,
            availableSlots: [
                ...editForm.availableSlots,
                { startsAt: '', endsAt: '' }
            ]
        });
    };

    // Remove a time slot
    const removeSlot = (index) => {
        setEditForm({
            ...editForm,
            availableSlots: editForm.availableSlots.filter(
                (_, i) => i !== index
            )
        });
    };

   // Save the edited listing to MongoDB
const saveChanges = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
        !editForm.title.trim() ||
        !editForm.subject.trim() ||
        !editForm.description.trim()
    ) {
        alert('Please complete all required fields.');
        return;
    }

    // Check that at least one time slot exists
    if (editForm.availableSlots.length === 0) {
        alert('At least one time slot is required.');
        return;
    }

    // Validate time slots
    const invalidSlot = editForm.availableSlots.some(slot =>
        !slot.startsAt ||
        !slot.endsAt ||
        new Date(slot.endsAt) <= new Date(slot.startsAt)
    );

    if (invalidSlot) {
        alert('Please check your available time slots.');
        return;
    }

    try {

        // Send updated information to the backend
        const data = await updateListingAPI(editingId, {
            title: editForm.title,
            subject: editForm.subject,
            description: editForm.description,
            mode: editForm.mode,
            availableSlots: editForm.availableSlots
        });

        setListings(previousListings =>
    previousListings.map(listing =>
        listing._id === editingId
            ? data.listing
            : listing
    )
);

        setEditingId(null);
        setEditForm(null);

        alert('Listing updated successfully!');

    } catch (error) {

        alert(error.message);

    }
};
    // Cancel editing
    const cancelEdit = () => {
        setEditingId(null);
        setEditForm(null);
    };

   // Deactivate a listing in MongoDB
const deactivateListing = async (id) => {
    try {

        const data = await deactivateListingAPI(id);

        setListings(listings.map(listing =>
            listing._id === id
                ? data.listing
                : listing
        ));

        alert('Listing deactivated successfully!');

    } catch (error) {

        alert(error.message);

    }
};

    // Reactivate a listing in MongoDB
const reactivateListing = async (id) => {
    try {

        const data = await reactivateListingAPI(id);

        setListings(listings.map(listing =>
            listing._id === id
                ? data.listing
                : listing
        ));

        alert('Listing reactivated successfully!');

    } catch (error) {

        alert(error.message);

    }
};

 // Delete a listing from MongoDB
const deleteListing = async (id) => {

    const confirmed = window.confirm(
        'Are you sure you want to delete this listing?'
    );

    if (!confirmed) {
        return;
    }

    try {

        // Send delete request to the backend
        await deleteListingAPI(id);

        // Remove the listing from the displayed list
        setListings(listings.filter(listing => listing._id !== id));

        alert('Tutoring listing deleted successfully!');

    } catch (error) {

        alert(error.message);

    }
};

    return (
        <div className="my-listings">

            {loading && <p>Loading your listings...</p>}

            {error && <p className="error-message">{error}</p>}

            <h1>My Tutoring Listings</h1>

            <p>Manage your tutoring services and availability.</p>

            {!loading && !error && listings.length === 0 ? (

                <p>You haven't created any tutoring listings yet.</p>

            ) : (

                !loading && !error && (
                    <div className="listings-container">

                        {listings.map(listing => (

                            <div className="listing-card" key={listing._id}>

                                {editingId === listing._id ? (

                                    // EDITING FORM
                                    <form onSubmit={saveChanges}>

                                        <h3>Edit Listing</h3>

                                        <label>Listing Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={editForm.title}
                                            onChange={handleEditChange}
                                            required
                                        />

                                        <label>Subject</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={editForm.subject}
                                            onChange={handleEditChange}
                                            required
                                        />

                                        <label>Description</label>
                                        <textarea
                                            name="description"
                                            value={editForm.description}
                                            onChange={handleEditChange}
                                            required
                                        />

                                        <label>Session Mode</label>
                                        <select
                                            name="mode"
                                            value={editForm.mode}
                                            onChange={handleEditChange}
                                        >
                                            <option value="Online">Online</option>
                                            <option value="OnCampus">On Campus</option>
                                        </select>

                                        <h4>Available Time Slots</h4>

                                        {editForm.availableSlots.map((slot, index) => (

                                            <div key={index} className="edit-slot">

                                                <label>Start Time</label>
                                                <input
                                                    type="datetime-local"
                                                    name="startsAt"
                                                    value={slot.startsAt}
                                                    onChange={(e) =>
                                                        handleSlotChange(index, e)
                                                    }
                                                    required
                                                />

                                                <label>End Time</label>
                                                <input
                                                    type="datetime-local"
                                                    name="endsAt"
                                                    value={slot.endsAt}
                                                    onChange={(e) =>
                                                        handleSlotChange(index, e)
                                                    }
                                                    required
                                                />

                                                {editForm.availableSlots.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSlot(index)}
                                                    >
                                                        Remove Slot
                                                    </button>
                                                )}

                                            </div>

                                        ))}

                                        <button type="button" onClick={addSlot}>
                                            + Add Another Slot
                                        </button>

                                        <div className="listing-actions">

                                            <button type="submit">
                                                Save Changes
                                            </button>

                                            <button
                                                type="button"
                                                onClick={cancelEdit}
                                            >
                                                Cancel
                                            </button>

                                        </div>

                                    </form>

                                ) : (

                                    // NORMAL LISTING CARD
                                    <>

                                        <div className="listing-header">

                                            <h3>{listing.title}</h3>

                                            <span className={
                                                listing.isActive
                                                    ? 'status active'
                                                    : 'status inactive'
                                            }>
                                                {listing.isActive ? 'Active' : 'Inactive'}
                                            </span>

                                        </div>

                                        <p>
                                            <strong>Subject:</strong> {listing.subject}
                                        </p>

                                        <p>
                                            <strong>Description:</strong> {listing.description}
                                        </p>

                                        <p>
                                            <strong>Mode:</strong>{' '}
                                            {listing.mode === 'OnCampus'
                                                ? 'On Campus'
                                                : 'Online'}
                                        </p>

                                        <h4>Available Time Slots</h4>

                                        {listing.availableSlots.map((slot, index) => (

                                            <p key={index}>
                                                {new Date(slot.startsAt).toLocaleString()}
                                                {' - '}
                                                {new Date(slot.endsAt).toLocaleString()}
                                            </p>

                                        ))}

                                        <div className="listing-actions">

                                            <button
                                                onClick={() => handleEdit(listing)}
                                            >
                                                Edit
                                            </button>

                                            {listing.isActive ? (

                                                <button
                                                    onClick={() => deactivateListing(listing._id)}
                                                >
                                                    Deactivate
                                                </button>

                                            ) : (

                                                <button
                                                    className="reactivate-button"
                                                    onClick={() => reactivateListing(listing._id)}
                                                >
                                                    Reactivate
                                                </button>

                                            )}

                                            <button
                                                className="delete-button"
                                                onClick={() => deleteListing(listing._id)}
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </>

                                )}

                            </div>

                        ))}

                    </div>
                )
            )}

        </div>
    );
}

export default MyListings;