import { useState, useCallback, useMemo } from "react";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { Box, IconButton, Button, Typography, Container } from "@mui/material";
import { useUsers } from "../../hooks/useUsers";
import { DataTable } from "../../components/common/DataTable";
import { DynamicFilter } from "../../components/common/DynamicFilter";
import { StatusChip } from "../../components/common/StatusChip";

interface ExtendedUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  companyName: string;
  status: "active" | "inactive";  // Update the type here
}

interface FilterValues extends Record<string, string> {
  search: string;
  role: string;
}

const Users = () => {
  const { users, loading } = useUsers();
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
    console.log('Edit user:', user);
  }, []);

  const handleDelete = useCallback((user: ExtendedUser) => {
    console.log('Delete user:', user);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = !filterValues.search || 
        user.name.toLowerCase().includes(filterValues.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filterValues.search.toLowerCase());
      const matchesRole = filterValues.role === "all" || user.role === filterValues.role;
      return matchesSearch && matchesRole;
    });
  }, [users, filterValues]);

  const columns = useMemo(() => [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    { field: "companyName", headerName: "Company", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (row: ExtendedUser) => (
        <StatusChip 
          status={row.status === "active" ? "active" : "inactive"} 
        />
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (row: ExtendedUser) => (
        <Box>
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

  const styles = {
    headerButton: {
      bgcolor: "primary.main",
      "&:hover": {
        bgcolor: "primary.dark",
      }
    }
  } as const;

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
            sx={styles.headerButton}
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
      </Box>
    </Container>
  );
};

export default Users;
