interface Notification {
  id: string;
  message: string;
  type: string;
  date: string;
}

interface NotificationsPanelProps {
  notifications: Notification[];
}

export const NotificationsPanel = ({
  notifications,
}: NotificationsPanelProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">System Notifications</h2>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg ${
              notification.type === "error" ? "bg-red-50" : "bg-blue-50"
            }`}
          >
            <p className="text-sm">{notification.message}</p>
            <span className="text-xs text-gray-500">{notification.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
