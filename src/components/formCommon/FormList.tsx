import { Paper, Typography, Box, List, ListItem, ListItemText, Divider } from "@mui/material";
import React from "react";

interface FormListProps {
  title: string;
  items: Array<{
    id: string;
    title: string;
    subtitle?: string;
    secondary?: string | React.ReactNode;
    status?: 'success' | 'warning' | 'error' | 'info';
  }>;
  emptyMessage?: string;
}

export const FormList: React.FC<FormListProps> = ({
  title,
  items,
  emptyMessage = 'No items available'
}) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        position: 'relative',
        zIndex: 1,
        boxShadow: (theme) => theme.shadows[2]
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {title}
      </Typography>
      <List sx={{ width: '100%' }}>
        {items.length === 0 ? (
          <ListItem>
            <ListItemText primary={emptyMessage} />
          </ListItem>
        ) : (
          items.map((item, index) => (
            <React.Fragment key={item.id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  borderLeft: item.status ? 4 : 0,
                  borderColor: item.status ? `${item.status}.main` : 'transparent',
                  pl: item.status ? 2 : 0,
                  mb: 1,
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {item.title}
                      </Typography>
                      {item.secondary && (
                        <Typography variant="caption" color="text.secondary">
                          {item.secondary}
                        </Typography>
                      )}
                    </Box>
                  }
                  secondary={
                    item.subtitle && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {item.subtitle}
                      </Typography>
                    )
                  }
                />
              </ListItem>
              {index < items.length - 1 && <Divider sx={{ my: 1 }} />}
            </React.Fragment>
          ))
        )}
      </List>
    </Paper>
  );
}; 