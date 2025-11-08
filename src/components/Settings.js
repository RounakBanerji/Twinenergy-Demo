import React from 'react';
import './Settings.css'; // We will create this CSS file next

const Settings = () => {
    // In a real app, these would be <Link> tags from react-router-dom
    // leading to other pages, e.g., <Link to="/settings/privacy">
    return (
        <div className="settings-container">
            <h1>Settings</h1>
            <ul className="settings-list">
                <li className="settings-item">
                    <span className="settings-icon">🔗</span>
                    Data Connections
                </li>
                <li className="settings-item">
                    <span className="settings-icon">🛡️</span>
                    Privacy Settings
                </li>
                <li className="settings-item">
                    <span className="settings-icon">🔔</span>
                    Notifications
                </li>
                <li className="settings-item">
                    <span className="settings-icon">❓</span>
                    Help & Support
                </li>
            </ul>
        </div>
    );
};

export default Settings;