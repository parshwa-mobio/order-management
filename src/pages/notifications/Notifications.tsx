import { useState } from 'react';

import { toast } from 'react-toastify';
import { NotificationItem } from '../../components/notifications/NotificationItem';
import { useNotifications } from '../../hooks/useNotifications';

const Notifications = () => {
  const [filter, setFilter] = useState<string>('all');
  const { notifications, loading, error, markAsRead } = useNotifications({ filter });

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      toast.success('Notification marked as read');
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option value="all">All</option>
            <option value="low_stock">Low Stock</option>
            <option value="promotion">Promotions</option>
            <option value="delay">Delays</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications found.</p>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;