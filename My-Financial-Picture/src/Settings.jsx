import React, {useState}  from 'react'
import './Settings.css';

function Settings() {
    const [settings, setSettings] = useState({
        theme: 'light',
        notifications: true,
        currency: 'USD',
        autoSave: true,
    });

    const handleChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = () => {
        localStorage.setItem('appSettings', JSON.stringify(settings));
        alert('Settings saved successfully!');
    };

    return (
        <div className="settings-container">
            <h1>Settings</h1>
            
            <div className="settings-section">
                <label>
                    <span>Theme:</span>
                    <select 
                        value={settings.theme}
                        onChange={(e) => handleChange('theme', e.target.value)}
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                </label>
            </div>

            <div className="settings-section">
                <label>
                    <span>Currency:</span>
                    <select 
                        value={settings.currency}
                        onChange={(e) => handleChange('currency', e.target.value)}
                    >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                    </select>
                </label>
            </div>

            <div className="settings-section">
                <label className='checkbox'>
                    <input 
                        type="checkbox" 
                        checked={settings.notifications}
                        onChange={(e) => handleChange('notifications', e.target.checked)}
                    />
                    <span>Enable Notifications</span>
                </label>
            </div>

            <div className="settings-section">
                <label>
                    <input 
                        type="checkbox" 
                        checked={settings.autoSave}
                        onChange={(e) => handleChange('autoSave', e.target.checked)}
                    />
                    <span>Auto-Save</span>
                </label>
            </div>

            <button onClick={handleSave} className="save-btn" style={{ marginTop: '20px', color: '#ffffffff' }}>Save Settings</button>
        </div>
    );
}

export default Settings;