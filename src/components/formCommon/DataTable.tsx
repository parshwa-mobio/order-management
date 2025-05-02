import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

interface Column {
  field: string;
  headerName: string;
  width?: number;
  renderCell?: (row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  rows: any[];
  loading?: boolean;
  emptyMessage?: string;
}

const renderTableBody = (columns: Column[], rows: any[], loading: boolean, emptyMessage: string) => {
  if (loading) {
    return (
      <TableRow>
        <TableCell colSpan={columns.length} align="center">
          Loading...
        </TableCell>
      </TableRow>
    );
  }

  if (rows.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={columns.length} align="center">
          {emptyMessage}
        </TableCell>
      </TableRow>
    );
  }

  return rows.map((row) => (
    <TableRow key={row?.id ?? row?._id} hover>
      {columns.map((column) => (
        <TableCell key={`${row?.id ?? row?._id}-${column.field}`}>
          {column.renderCell ? column.renderCell({ row }) : row?.[column.field]}
        </TableCell>
      ))}
    </TableRow>
  ));
};

export const DataTable = ({ columns, rows, loading = false, emptyMessage = 'No data available' }: DataTableProps) => {
  return (
    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.field}
                sx={{ fontWeight: 'bold', bgcolor: 'primary.light', color: 'primary.contrastText' }}
              >
                {column.headerName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {renderTableBody(columns, rows, loading, emptyMessage)}
        </TableBody>
      </Table>
    </TableContainer>
  );
}; 