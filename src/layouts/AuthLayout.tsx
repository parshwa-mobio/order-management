import { Outlet } from "react-router-dom";
import { PackageCheck } from "lucide-react";
import { Box, Typography, Paper, Container } from "@mui/material";

const AuthLayout = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        py: 6,
        px: { sm: 3, lg: 4 }
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <PackageCheck style={{ width: 48, height: 48, color: 'primary.main' }} />
          </Box>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              mt: 3,
              textAlign: 'center',
              fontWeight: 700,
              color: 'text.primary'
            }}
          >
            Web Ordering Portal
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Paper
            elevation={2}
            sx={{
              py: 4,
              px: { xs: 2, sm: 5 },
              borderRadius: 2
            }}
          >
            <Outlet />
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthLayout;
