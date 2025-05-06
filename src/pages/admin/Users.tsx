import { useState, useCallback, useMemo } from "react";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { Box, IconButton, Button, Typography, Container } from "@mui/material";

import { DataTable } from "../../components/common/DataTable";
import { DynamicFilter } from "../../components/common/DynamicFilter";
import { StatusChip } from "../../components/common/StatusChip";
import { CreateUserDialog } from "../../components/admin/CreateUserDialog";
import { EditUserDialog } from "../../components/admin/EditUserDialog";
import { useUsers } from "../../hooks/user/useUsers";

interface ExtendedUser {
  id: string;
  _id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}

interface FilterValues extends Record<string, string> {
  search: string;
  role: string;
}

const Users = () => {
  const { users, loading, createUser, updateUser } = useUsers();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null);
  const [filterValues, setFilterValues] = useState<FilterValues>({
    search: "",
    role: "all"
  });

  const userFilters = useMemo(() => [
    {
      field: "search",
      label: "Search Users",
      type: "text" as const
    },
    {
      field: "role",
      label: "Role",
      type: "select" as const,
      options: [
        { value: "all", label: "All Roles" },
        { value: "distributor", label: "Distributor" },
        { value: "dealer", label: "Dealer" },
        { value: "sales", label: "Sales" },
        { value: "exportTeam", label: "Export Team" }
      ]
    }
  ], []);

  const handleFilterChange = useCallback((field: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleEdit = useCallback((user: ExtendedUser) => {
    setSelectedUser({
      ...user,
      id: user._id // Map _id to id for compatibility
    });
    setIsEditDialogOpen(true);
  }, []);

  const handleDelete = useCallback((user: ExtendedUser) => {
    console.log('Delete user:', user);
  }, []);

  const handleUpdateUser = async (userData: {
    name: string;
    email: string;
    role: string;
  }) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, userData);
        setIsEditDialogOpen(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleCreateUser = async (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    try {
      await createUser(userData);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const searchTerm = filterValues.search.toLowerCase();
      const matchesSearch = !searchTerm || 
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm);
      const matchesRole = filterValues.role === "all" || user.role === filterValues.role;
      return matchesSearch && matchesRole;
    });
  }, [users, filterValues]);

  const columns = useMemo(() => [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (row: ExtendedUser) => (
        <StatusChip status={row.status === "active" ? "active" : "inactive"} />
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (row: ExtendedUser) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            size="small" 
            onClick={() => handleEdit(row)}
            color="primary"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => handleDelete(row)}
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )
    }
  ], [handleEdit, handleDelete]);

  return (
    <Container maxWidth="xl">
      <Box p={3}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" component="h1" color="primary.main">
            User Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateDialogOpen(true)}
            sx={{
              bgcolor: "primary.main",
              "&:hover": {
                bgcolor: "primary.dark",
              }
            }}
          >
            New User
          </Button>
        </Box>

        <DynamicFilter
          filters={userFilters}
          values={filterValues}
          onChange={handleFilterChange}
        />

        <DataTable
          columns={columns}
          rows={filteredUsers}
          loading={loading}
          emptyMessage="No users found"
        />

        <CreateUserDialog
          open={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSubmit={handleCreateUser}
        />

        <EditUserDialog
          open={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedUser(null);
          }}
          onSubmit={handleUpdateUser}
          user={selectedUser}
        />
      </Box>
    </Container>
  );
};

export default Users;
