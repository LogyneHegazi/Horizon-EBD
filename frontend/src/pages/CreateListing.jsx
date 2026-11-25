
import { createListing } from '../services/listingService';
import { useState } from 'react';

function CreateListing() {

    // Store the listing information
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        description: '',
        mode: 'Online',
        availableSlots: [
            {
                startsAt: '',
                endsAt: ''
            }
        ]
    });

    // Store success and error messages
    const [message, setMessage] = useState('');

    // Handle normal input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle time slot changes
    const handleSlotChange = (index, e) => {
        const { name, value } = e.target;

        const updatedSlots = formData.availableSlots.map((slot, i) =>
            i === index ? { ...slot, [name]: value } : slot
        );

        setFormData({
            ...formData,
            availableSlots: updatedSlots
        });
    };

    // Add another time slot
    const addSlot = () => {
        setFormData({
            ...formData,
            availableSlots: [
                ...formData.availableSlots,
                { startsAt: '', endsAt: '' }
            ]
        });
    };

    // Remove a time slot
    const removeSlot = (index) => {
        setFormData({
            ...formData,
            availableSlots: formData.availableSlots.filter(
                (_, i) => i !== index
            )
        });
    };

    // Submit the listing to MongoDB
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        // Validate required fields
        if (
            !formData.title.trim() ||
            !formData.subject.trim() ||
            !formData.description.trim()
        ) {
            setMessage('Please complete all required fields.');
            return;
        }
         if (formData.availableSlots.length === 0) {
            setMessage('Please add at least one available time slot.');
            return;
}
        // Validate time slots
        const invalidSlot = formData.availableSlots.some(slot =>
            !slot.startsAt ||
            !slot.endsAt ||
            new Date(slot.endsAt) <= new Date(slot.startsAt)
        );

        if (invalidSlot) {
            setMessage('Please check your available time slots.');
            return;
        }

        try {

            // Send listing information to the backend
            await createListing(formData);

            // Display success message
            setMessage('Your tutoring listing was created successfully!');

            // Clear the form after successful submission
            setFormData({
                title: '',
                subject: '',
                description: '',
                mode: 'Online',
                availableSlots: [
                    {
                        startsAt: '',
                        endsAt: ''
                    }
                ]
            });

        } catch (error) {

            // Display error message
            setMessage(error.message);

        }
    };

    return (
        <div className="create-listing">

            <h1>Create a Tutoring Listing</h1>

            <p>Share your knowledge and help other students.</p>

            <form onSubmit={handleSubmit}>

                <label>Listing Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Python Programming Tutoring"
                    required
                />

                <label>Subject</label>
                <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Python"
                    required
                />

                <label>Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your tutoring service..."
                    required
                />

                <label>Session Mode</label>
                <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleChange}
                >
                    <option value="Online">Online</option>
                    <option value="OnCampus">On Campus</option>
                </select>

                <h3>Available Time Slots</h3>

                {formData.availableSlots.map((slot, index) => (

                    <div key={index} className="edit-slot">

                        <h4>Time Slot {index + 1}</h4>

                        <label>Start Time</label>
                        <input
                            type="datetime-local"
                            name="startsAt"
                            value={slot.startsAt}
                            onChange={(e) => handleSlotChange(index, e)}
                            required
                        />

                        <label>End Time</label>
                        <input
                            type="datetime-local"
                            name="endsAt"
                            value={slot.endsAt}
                            onChange={(e) => handleSlotChange(index, e)}
                            required
                        />

                        {formData.availableSlots.length > 1 && (
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
                    + Add Another Time Slot
                </button>

                <button type="submit">
                    Create Listing
                </button>

                {message && <p>{message}</p>}

            </form>

        </div>
    );
}

export default CreateListing;
