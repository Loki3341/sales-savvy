import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            // Extract user data with fallbacks for different property names
            const userData = {
                firstName: user.firstName || user.firstname || user.name?.split(' ')[0] || '',
                lastName: user.lastName || user.lastname || user.name?.split(' ')[1] || '',
                email: user.email || user.username || '',
                phone: user.phone || user.phoneNumber || user.mobile || '',
                address: user.address || user.shippingAddress || ''
            };
            
            setFormData(userData);
            setIsLoading(false);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        
        try {
            await updateProfile(formData);
            setIsEditing(false);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setMessage({ type: '', text: '' });
            }, 3000);
            
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Failed to update profile. Please try again.' 
            });
        }
    };

    const handleCancel = () => {
        // Reset form to original user data
        if (user) {
            const userData = {
                firstName: user.firstName || user.firstname || user.name?.split(' ')[0] || '',
                lastName: user.lastName || user.lastname || user.name?.split(' ')[1] || '',
                email: user.email || user.username || '',
                phone: user.phone || user.phoneNumber || user.mobile || '',
                address: user.address || user.shippingAddress || ''
            };
            setFormData(userData);
        }
        setIsEditing(false);
        setMessage({ type: '', text: '' });
    };

    if (isLoading) {
        return (
            <>
                <Header />
                <div className="profile-page">
                    <div className="profile-container">
                        <div className="loading-spinner">Loading your profile...</div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="profile-page">
                <div className="profile-container">
                    <h1>My Profile</h1>
                    
                    {/* Display messages */}
                    {message.text && (
                        <div className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="profile-card">
                        <div className="profile-header">
                            <div className="avatar">
                                {formData.firstName?.charAt(0) || 'U'}{formData.lastName?.charAt(0) || ''}
                            </div>
                            <h2>{formData.firstName} {formData.lastName}</h2>
                            <p className="member-since">
                                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'recently'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="profile-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name *</label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                        disabled={!isEditing}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name *</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                        disabled={!isEditing}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Email Address *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="disabled-field"
                                />
                                <small className="field-note">Email cannot be changed</small>
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    disabled={!isEditing}
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            <div className="form-group">
                                <label>Shipping Address</label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    disabled={!isEditing}
                                    rows="3"
                                    placeholder="Enter your complete shipping address"
                                />
                            </div>

                            <div className="profile-actions">
                                {isEditing ? (
                                    <>
                                        <button type="submit" className="btn-primary">Save Changes</button>
                                        <button type="button" onClick={handleCancel} className="btn-secondary">
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button type="button" onClick={() => setIsEditing(true)} className="btn-primary">
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProfilePage;