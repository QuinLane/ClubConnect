import { useState } from 'react';
import {
  Bell, UserPlus, Users, Calendar, Clock,
  X, Trash2, Filter
} from 'lucide-react';

export default function CampusNotificationPage() {
  const initialNotifications = [
    { id: 1, type: 'friend_request', title: 'New Friend Request', message: 'Sarah Johnson has added you as a friend.', time: '2 hours ago', read: false, actionable: true },
    { id: 2, type: 'group_joined', title: 'Group Joined', message: 'You have successfully joined "Photography Enthusiasts".', groupId: '123', time: '5 hours ago', read: false, actionable: false },
    { id: 3, type: 'event_reminder', title: 'Event Starting Soon', message: '"Campus Hackathon" is starting in 1 hour at Student Center.', eventId: '456', time: '1 day ago', read: true, actionable: true },
    { id: 4, type: 'group_removed', title: 'Removed from Group', message: 'You were removed from "Ultimate Frisbee Team" group.', time: '2 days ago', read: true, actionable: false },
    { id: 5, type: 'event_upcoming', title: 'Upcoming Event', message: '"Spring Career Fair" is happening tomorrow at 10 AM.', eventId: '789', time: '3 days ago', read: true, actionable: true },
    { id: 6, type: 'friend_accepted', title: 'Friend Request Accepted', message: 'Michael Chen accepted your friend request.', time: '4 days ago', read: true, actionable: false },
    { id: 7, type: 'group_post', title: 'New Group Post', message: 'Alex posted in "Computer Science Study Group".', groupId: '234', time: '5 days ago', read: true, actionable: true },
  ];

  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'friend_request':
      case 'friend_accepted':
        return <UserPlus className="text-blue-500" size={20} />;
      case 'group_joined':
      case 'group_removed':
      case 'group_post':
        return <Users className="text-green-500" size={20} />;
      case 'event_upcoming':
        return <Calendar className="text-purple-500" size={20} />;
      case 'event_reminder':
        return <Clock className="text-orange-500" size={20} />;
      default:
        return <Bell className="text-gray-500" size={20} />;
    }
  };

  const handleAction = (notification) => {
    switch (notification.type) {
      case 'friend_request':
        alert('Navigating to accept/reject friend request');
        break;
      case 'event_reminder':
      case 'event_upcoming':
        alert(`Navigating to event ID: ${notification.eventId}`);
        break;
      case 'group_post':
        alert(`Navigating to group ID: ${notification.groupId}`);
        break;
      default:
        break;
    }
    markAsRead(notification.id);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const filteredNotifications =
    filter === 'all' ? notifications :
    filter === 'unread' ? notifications.filter(n => !n.read) :
    filter === 'friends' ? notifications.filter(n => n.type.includes('friend')) :
    filter === 'groups' ? notifications.filter(n => n.type.includes('group')) :
    notifications.filter(n => n.type.includes('event'));

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <span className="text-sm text-gray-700 font-medium">Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded px-2 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="friends">Friends</option>
              <option value="groups">Groups</option>
              <option value="events">Events</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={markAllAsRead}
              className="px-3 py-1 text-sm bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100"
            >
              Mark all as read
            </button>
            <button
              onClick={clearAllNotifications}
              className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
            >
              Clear all
            </button>
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Bell size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-base font-medium">No notifications</p>
            <p className="text-sm mt-1">When something new happens, it will show up here.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredNotifications.map(notification => (
              <li
                key={notification.id}
                className={`p-4 transition ${
                  !notification.read ? 'bg-indigo-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getTypeIcon(notification.type)}</div>
                  <div
                    className={`flex-grow cursor-pointer ${
                      notification.actionable ? 'hover:text-indigo-700' : ''
                    }`}
                    onClick={() => notification.actionable && handleAction(notification)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className={`text-sm font-semibold ${
                        notification.read ? 'text-gray-800' : 'text-indigo-700'
                      }`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    {notification.actionable && (
                      <p className="text-xs text-indigo-600 mt-2">Tap to view details</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0 ml-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-1 text-indigo-500 hover:bg-indigo-100 rounded"
                        title="Mark as read"
                      >
                        <X size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-1 text-red-500 hover:bg-red-100 rounded"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
