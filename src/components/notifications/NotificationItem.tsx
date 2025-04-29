import { Notification } from '../../hooks/useNotifications';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

export const NotificationItem = ({ notification, onMarkAsRead }: NotificationItemProps) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'low_stock':
        return 'bg-red-100 text-red-800';
      case 'promotion':
        return 'bg-green-100 text-green-800';
      case 'delay':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className={`p-4 rounded-lg border ${
        notification.read ? 'bg-gray-50' : 'bg-white'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="mb-1">{notification.message}</p>
          <div className="flex gap-2 items-center">
            <span
              className={`text-xs px-2 py-1 rounded ${getTypeColor(
                notification.type
              )}`}
            >
              {notification.type.replace('_', ' ')}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(notification.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
        {!notification.read && (
          <button
            onClick={() => onMarkAsRead(notification.id)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Mark as read
          </button>
        )}
      </div>
    </div>
  );
};