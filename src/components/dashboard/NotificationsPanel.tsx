import {
  Paper,
  Typography,
  Box,
  Alert,
  Stack
} from "@mui/material";

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
  // Map notification type to MUI Alert severity
  const getSeverity = (type: string) => {
    switch (type) {
      case "error":
        return "error";
      case "warning":
        return "warning";
      case "success":
        return "success";
      default:
        return "info";
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        System Notifications
      </Typography>

      <Stack spacing={2}>
        {notifications.map((notification) => (
          <Alert
            key={notification.id}
            severity={getSeverity(notification.type)}
            variant="outlined"
            sx={{
              '& .MuiAlert-message': {
                width: '100%'
              }
            }}
          >
            <Box>
              <Typography variant="body2">
                {notification.message}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {notification.date}
              </Typography>
            </Box>
          </Alert>
        ))}
      </Stack>
    </Paper>
  );
};
