import { useState, useEffect } from 'react';
import api from '../api';

export interface Notification {
  id: string;
  message: string;
  type: 'low_stock' | 'promotion' | 'delay';
  createdAt: string;
  read: boolean;
}

interface UseNotificationsProps {
  filter?: string;
}

export const useNotifications = ({ filter = 'all' }: UseNotificationsProps = {}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await api.get('/notifications');
        const data = response.data;
        setNotifications(data as Notification[]);
        setError(null);
      } catch (error) {
        setError('Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter(
    notification => filter === 'all' || notification.type === filter
  );

  const markAsRead = async (notificationId: string) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      setError('Failed to mark notification as read');
    }
  };

  return {
    notifications: filteredNotifications,
    loading,
    error,
    markAsRead
  };
};