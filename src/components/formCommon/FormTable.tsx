import { memo, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableProps,
  TableContainerProps,
  Typography,
  Box,
  CircularProgress
} from "@mui/material";

interface Column<T = any> {
  field: keyof T | string;
  headerName: string;
  width?: number;
  renderCell?: (row: T) => React.ReactNode;
}

interface FormTableProps<T = any> extends TableContainerProps {
  columns: Column<T>[];
  rows: T[];
  title?: string;
  loading?: boolean;
  emptyMessage?: string;
  tableProps?: TableProps;
  getRowId?: (row: T) => string | number;
}

const TableHeader = memo(({ columns }: { columns: Column[] }) => (
  <TableHead>
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.field as string}
          sx={{ 
            fontWeight: 'bold', 
            bgcolor: 'primary.light', 
            color: 'primary.contrastText',
            whiteSpace: 'nowrap'
          }}
        >
          {column.headerName}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
));

const TableBodyContent = memo(({ 
  columns, 
  rows, 
  loading, 
  emptyMessage,
  getRowId 
}: { 
  columns: Column[]; 
  rows: any[]; 
  loading: boolean; 
  emptyMessage: string;
  getRowId?: (row: any) => string | number;
}) => {
  if (loading) {
    return (
      <TableRow>
        <TableCell colSpan={columns.length} align="center">
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
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

  return (
    <>
      {rows.map((row) => {
        const rowId = getRowId ? getRowId(row) : row?.id ?? row?._id;
        return (
          <TableRow 
            key={rowId}
            hover
            sx={{ '&:hover': { bgcolor: 'action.hover' } }}
          >
            {columns.map((column) => {
              const value = typeof column.field === 'string' && column.field.includes('.') 
                ? column.field.split('.').reduce((obj: any, key: string) => obj?.[key], row)
                : row?.[column.field];
              
              return (
                <TableCell key={`${rowId}-${String(column.field)}`}>
                  {column.renderCell ? column.renderCell(row) : value}
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}
    </>
  );
});

export const FormTable = memo(<T extends object>({
  columns,
  rows,
  title,
  loading = false,
  emptyMessage = 'No data available',
  tableProps,
  getRowId,
  ...props
}: FormTableProps<T>) => {
  const tableContainerStyles = useMemo(() => ({
    borderRadius: 2,
    position: 'relative',
    zIndex: 1,
    boxShadow: (theme: any) => theme.shadows[2],
    '&::-webkit-scrollbar': {
      height: 8,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,0.2)',
      borderRadius: 4
    }
  }), []);

  return (
    <TableContainer 
      component={Paper} 
      elevation={2}
      sx={tableContainerStyles}
      {...props}
    >
      {title && (
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
      )}
      <Table {...tableProps}>
        <TableHeader columns={columns} />
        <TableBody>
          <TableBodyContent 
            columns={columns} 
            rows={rows} 
            loading={loading} 
            emptyMessage={emptyMessage}
            getRowId={getRowId}
          />
        </TableBody>
      </Table>
    </TableContainer>
  );
}); 