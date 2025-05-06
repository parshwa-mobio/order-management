import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar";
import Header from "../components/navigation/Header";
import { Box, useTheme } from "@mui/material";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();

  // Calculate sidebar width for proper margin
  const SIDEBAR_WIDTH = 240;

  return (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      overflow: 'hidden',
      bgcolor: 'background.default'
    }}>
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        width: { xs: '100%', md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
        ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` },
        overflow: 'hidden',
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}>
        <Header setSidebarOpen={setSidebarOpen} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            position: 'relative',
            overflowY: 'auto',
            overflowX: 'hidden',
            '&:focus': { outline: 'none' },
            zIndex: 1, // Ensure content is above sidebar
          }}
        >
          <Box sx={{ py: 3, px: { xs: 2, sm: 3, lg: 4 } }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
