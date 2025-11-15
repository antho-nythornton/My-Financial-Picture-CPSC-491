import React, { useState, useEffect } from 'react';
import './Notifications.css';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        setNotifications([
            {
                id: 1,
                title: 'Budget Alert',
                message: 'You are approaching your spending limit for groceries',
                timestamp: new Date(),
                read: false,
            },
            {
                id: 2,
                title: 'Payment Due',
                message: 'Your credit card payment is due on Dec 15',
                timestamp: new Date(Date.now() - 3600000),
                read: true,
            },
        ]);
    }, []);

    const markAsRead = (id) => {
        setNotifications(notifications.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
        ));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(notif => notif.id !== id));
    };

    return (
        <div className="notif-container">
            <h1>Notifications</h1>
            {notifications.length === 0 ? (
                <p className="no-notifications">No notifications</p>
            ) : (
                <ul className="notif-list">
                    {notifications.map(notif => (
                        <li key={notif.id} className={`notif ${notif.read ? 'read' : 'unread'}`}>
                            <div className="notif-content">
                                <h3>{notif.title}</h3>
                                <p>{notif.message}</p>
                                <span className="timestamp">{notif.timestamp.toLocaleString()}</span>
                            </div>
                            <div className="notif-actions">
                                {!notif.read && (
                                    <button onClick={() => markAsRead(notif.id)} style={{ backgroundColor: '#012c5bff', color: '#ffffff', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer',}}>Mark as read</button>
                                )}
                                <button onClick={() => deleteNotification(notif.id)} style={{ backgroundColor: '#dc3545', color: '#ffffff', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}  >Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}