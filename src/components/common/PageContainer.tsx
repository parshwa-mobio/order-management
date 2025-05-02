import { Container, Box, Paper } from '@mui/material';
import { ReactNode } from 'react';

interface PageContainerProps {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

export const PageContainer = ({ title, children, actions }: PageContainerProps) => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <h1 className="text-2xl font-bold">{title}</h1>
          {actions}
        </Box>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          {children}
        </Paper>
      </Box>
    </Container>
  );
}; 