import { useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  PackageCheck,
  LayoutDashboard,
  ShoppingCart,
  Package,
  BarChart,
  Settings,
  User,
  Users,
  FileText,
  Boxes,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { user } = useAuth();
  const theme = useTheme();
  const location = useLocation();

  const navigation = useMemo(() => {
    const baseMenuItems = [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Orders", href: "/orders", icon: ShoppingCart },
    ];

    // Admin-specific menu items
    if (user?.role === "admin") {
      return [
        ...baseMenuItems,
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Products", href: "/products", icon: Package },
        { name: "Categories", href: "/categories", icon: Boxes },
        { name: "Settings", href: "/settings", icon: Settings },
        { name: "Profile", href: "/profile", icon: User },
      ];
    }

    // Distributor menu items
    if (user?.role === "distributor") {
      return [
        ...baseMenuItems,
        { name: "Products", href: "/products", icon: Package },
        { name: "Reports", href: "/reports", icon: BarChart },
        { name: "Contracts", href: "/contracts", icon: FileText },
        { name: "Settings", href: "/settings", icon: Settings },
        { name: "Profile", href: "/profile", icon: User },
      ];
    }

    // Dealer menu items
    if (user?.role === "dealer") {
      return [
        ...baseMenuItems,
        { name: "Products", href: "/products", icon: Package },
        { name: "Settings", href: "/settings", icon: Settings },
        { name: "Profile", href: "/profile", icon: User },
      ];
    }

    // Sales team menu items
    if (user?.role === "sales") {
      return [
        ...baseMenuItems,
        { name: "Products", href: "/products", icon: Package },
        { name: "Reports", href: "/reports", icon: BarChart },
        { name: "Contracts", href: "/contracts", icon: FileText },
        { name: "Settings", href: "/settings", icon: Settings },
        { name: "Profile", href: "/profile", icon: User },
      ];
    }

    // Export team menu items
    if (user?.role === "exportTeam") {
      return [
        ...baseMenuItems,
        { name: "Products", href: "/products", icon: Package },
        { name: "Reports", href: "/reports", icon: BarChart },
        { name: "Contracts", href: "/contracts", icon: FileText },
        { name: "Settings", href: "/settings", icon: Settings },
        { name: "Profile", href: "/profile", icon: User },
      ];
    }

    return baseMenuItems;
  }, [user]);

  const sidebarContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <PackageCheck style={{ width: 32, height: 32, color: theme.palette.primary.main }} />
        <Typography
          variant="h6"
          sx={{
            ml: 1,
            fontWeight: 600,
            color: theme.palette.primary.main
          }}
        >
          OrderPortal
        </Typography>
      </Box>

      <Divider />

      <List sx={{ flexGrow: 1, py: 2 }}>
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;

          return (
            <ListItem key={item.name} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.href}
                sx={{
                  borderRadius: 1,
                  my: 0.5,
                  color: isActive ? 'primary.main' : 'text.secondary',
                  bgcolor: isActive ? 'action.selected' : 'transparent',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
                onClick={() => setSidebarOpen(false)}
              >
                <ListItemIcon sx={{
                  minWidth: 40,
                  color: isActive ? 'primary.main' : 'text.secondary',
                }}>
                  <item.icon style={{ width: 20, height: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  sx={{
                    '& .MuiTypography-root': {
                      fontSize: 14,
                      fontWeight: isActive ? 600 : 500
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{
              bgcolor: 'primary.light',
              color: 'primary.dark',
              width: 36,
              height: 36,
              fontSize: 14
            }}
          >
            {user?.name?.charAt(0) ?? "U"}
          </Avatar>
          <Box sx={{ ml: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.role
                ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                : ""}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            boxShadow: 3
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', p: 1 }}>
          <IconButton
            onClick={() => setSidebarOpen(false)}
            size="small"
            edge="end"
            aria-label="close sidebar"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        {sidebarContent}
      </Drawer>

      {/* Desktop sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240,
            borderRight: `1px solid ${theme.palette.divider}`,
            zIndex: theme.zIndex.appBar - 1, // Below app bar but above content
            height: '100%',
            position: 'fixed',
            top: 0,
            left: 0
          },
        }}
        open
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};

export default Sidebar;

