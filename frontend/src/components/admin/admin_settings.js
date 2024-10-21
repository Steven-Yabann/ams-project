import React, { useState } from 'react';
import './css_files/admin_settings.css';

//TEST PUSH
export default function AdminSettings() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        newPassword: '',
        confirmPassword: '',
        preferences: {
            notifications: false,
            darkMode: false,
            emailUpdates: false,
        },
        profilePicture: null,
        twoFactorAuth: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'checkbox') {
            setFormData({
                ...formData,
                preferences: {
                    ...formData.preferences,
                    [name]: checked
                }
            });
        } else if (type === 'file') {
            setFormData({
                ...formData,
                profilePicture: files[0]
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            alert('New passwords do not match');
            return;
        }
        // Handle form submission, e.g., send data to server
        console.log('Form data submitted:', formData);
    };

    const handlePasswordReset = () => {
        // Handle password reset logic
        console.log('Password reset request');
    };

    return (
        <div className="settings-container">
            <h1>Admin Settings</h1>
            <form onSubmit={handleSubmit} className="settings-form">
                <fieldset>
                    <legend>Profile</legend>
                    <label>
                        Username:
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Profile Picture:
                        <input
                            type="file"
                            name="profilePicture"
                            onChange={handleChange}
                        />
                    </label>
                </fieldset>
                <fieldset>
                    <legend>Change Password</legend>
                    <label>
                        Current Password:
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        New Password:
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Confirm New Password:
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <button type="button" onClick={handlePasswordReset} className="reset-btn">
                        Request Password Reset
                    </button>
                </fieldset>
                <fieldset>
                    <legend>Preferences</legend>
                    <label>
                        <input
                            type="checkbox"
                            name="notifications"
                            checked={formData.preferences.notifications}
                            onChange={handleChange}
                        />
                        Enable Notifications
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="darkMode"
                            checked={formData.preferences.darkMode}
                            onChange={handleChange}
                        />
                        Dark Mode
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="emailUpdates"
                            checked={formData.preferences.emailUpdates}
                            onChange={handleChange}
                        />
                        Receive Email Updates
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="twoFactorAuth"
                            checked={formData.twoFactorAuth}
                            onChange={handleChange}
                        />
                        Enable Two-Factor Authentication
                    </label>
                </fieldset>
                <button type="submit" className="submit-btn">Save Changes</button>
            </form>
        </div>
    );
}

