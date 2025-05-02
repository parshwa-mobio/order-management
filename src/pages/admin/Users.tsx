import { useState } from "react";
import { useUsers } from "../../hooks/useUsers";
import { Box, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { PageContainer } from "../../components/common/PageContainer";
import { FormTable } from "../../components/common/FormTable";
import { SearchField } from '../../components/common/SearchField';
import { FilterSelect } from '../../components/common/FilterSelect';
import { StatusChip } from '../../components/common/StatusChip';
import { FormGrid } from '../../components/formCommon/FormGrid';

const Users = () => {
  const { users, loading } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const handleEdit = (user: any) => {
    console.log('Edit user:', user);
  };

  const handleDelete = (user: any) => {
    console.log('Delete user:', user);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'role', headerName: 'Role', flex: 1 },
    { field: 'companyName', headerName: 'Company', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params: { row: any }) => (
        <StatusChip status={params?.row?.status ?? 'active'} />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params: { row: any }) => (
        <Box>
          <IconButton size="small" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton size="small" onClick={() => handleDelete(params.row)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <PageContainer title="User Management">
      <FormGrid container item={false} spacing={2} sx={{ mb: 2 }}>
        <FormGrid xs={12} md={6}>
          <SearchField
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search users..."
          />
        </FormGrid>
        <FormGrid xs={12} md={6}>
          <FilterSelect
            value={roleFilter}
            onChange={setRoleFilter}
            options={[
              { value: 'all', label: 'All Roles' },
              { value: 'distributor', label: 'Distributor' },
              { value: 'dealer', label: 'Dealer' },
              { value: 'sales', label: 'Sales' },
              { value: 'exportTeam', label: 'Export Team' },
            ]}
            label="Filter by Role"
          />
        </FormGrid>
      </FormGrid>

      <FormTable
        columns={columns}
        rows={filteredUsers}
        loading={loading}
        emptyMessage="No users found"
      />
    </PageContainer>
  );
};

export default Users;
