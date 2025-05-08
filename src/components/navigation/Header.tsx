import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  Menu as MuiMenu,
  MenuItem,
  Box,
  alpha,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const SearchBox = () => (
  <Box sx={{
    position: 'relative',
    borderRadius: 1,
    bgcolor: (theme) => alpha(theme.palette.common.black, 0.05),
    '&:hover': {
      bgcolor: (theme) => alpha(theme.palette.common.black, 0.08),
    },
    mr: 2,
    ml: 0,
    width: { xs: '100%', sm: 'auto' },
    flexGrow: 1
  }}>
    <Box sx={{
      padding: theme => theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <SearchIcon />
    </Box>
    <InputBase
      placeholder="Search…"
      sx={{
        color: 'inherit',
        padding: theme => theme.spacing(1, 1, 1, 0),
        paddingLeft: theme => `calc(1em + ${theme.spacing(4)})`,
        transition: theme => theme.transitions.create('width'),
        width: '100%',
      }}
    />
  </Box>
);

const Header = ({ setSidebarOpen }: HeaderProps) => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={2}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: 'background.paper',
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        width: { xs: '100%', md: 'calc(100% - 240px)' },
        ml: { xs: 0, md: '240px' }
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={() => setSidebarOpen(true)}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <SearchBox />

        <Box sx={{ display: 'flex', ml: 'auto' }}>
          <IconButton
            component={Link}
            to="/notifications"
            color="inherit"
            size="large"
          >
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
            size="large"
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'primary.light',
                color: 'primary.dark',
                fontSize: 14
              }}
            >
              {user?.name?.charAt(0) || "U"}
            </Avatar>
          </IconButton>
        </Box>

        <MuiMenu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            component={Link}
            to="/profile"
            onClick={handleMenuClose}
          >
            Profile
          </MenuItem>
          <MenuItem
            component={Link}
            to="/settings"
            onClick={handleMenuClose}
          >
            Settings
          </MenuItem>
          <MenuItem onClick={handleLogout}>Sign out</MenuItem>
        </MuiMenu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
