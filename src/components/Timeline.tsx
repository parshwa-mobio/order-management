import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  TimelineItem as MuiTimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  Timeline as MuiTimeline
} from '@mui/lab';

interface TimelineEvent {
  status: string;
  date: string;
  description: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <MuiTimeline position="right" sx={{ p: 0, m: 0 }}>
      {events.map((event, index) => (
        <MuiTimelineItem
          key={`${event.status}-${event.date}-${index}`}
          sx={{
            '&:before': {
              display: 'none'
            },
            minHeight: index === events.length - 1 ? 'auto' : 60
          }}
        >
          <TimelineSeparator>
            <TimelineDot color="primary" sx={{ my: 0.5 }} />
            {index !== events.length - 1 && (
              <TimelineConnector sx={{ height: '100%' }} />
            )}
          </TimelineSeparator>

          <TimelineContent sx={{ py: 0, px: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                {event.status}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {event.date}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {event.description}
            </Typography>
          </TimelineContent>
        </MuiTimelineItem>
      ))}
    </MuiTimeline>
  );
};
