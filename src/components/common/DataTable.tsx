import React, {  useMemo, memo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Skeleton
} from '@mui/material';

interface Column {
  field: string;
  headerName: string;
  flex?: number;
  renderCell?: (row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  rows: any[];
  loading?: boolean;
  title?: string;
  emptyMessage?: string;
}

const TableHeader = memo(({ columns }: { columns: Column[] }) => (
  <TableHead sx={{ bgcolor: 'primary.light' }}>
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.field}
          sx={{
            color: 'primary.contrastText',
            fontWeight: 'bold',
            flex: column.flex
          }}
        >
          {column.headerName}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
));

const LoadingSkeleton = memo(({ columns }: { columns: Column[] }) => (
  <TableBody>
    {[1, 2, 3].map((row) => (
      <TableRow key={row}>
        {columns.map((column) => (
          <TableCell key={column.field}>
            <Skeleton animation="wave" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableBody>
));

const EmptyState = memo(({ colSpan, message }: { colSpan: number; message: string }) => (
  <TableRow>
    <TableCell colSpan={colSpan} align="center">
      <Typography color="text.secondary">{message}</Typography>
    </TableCell>
  </TableRow>
));

export const DataTable = memo(({
  columns,
  rows,
  loading = false,
  title,
  emptyMessage = 'No data found'
}: DataTableProps) => {
  const tableContent = useMemo(() => {
    if (loading) {
      return <LoadingSkeleton columns={columns} />;
    }

    if (!rows.length) {
      return <EmptyState colSpan={columns.length} message={emptyMessage} />;
    }

    return (
      <TableBody>
        {rows.map((row, index) => (
          <TableRow key={row.id || index}>
            {columns.map((column) => (
              <TableCell key={column.field}>
                {column.renderCell ? column.renderCell(row) : row[column.field]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    );
  }, [columns, rows, loading, emptyMessage]);

  return (
    <Paper elevation={3} sx={{ borderRadius: 2 }}>
      {title && (
        <Box p={3} borderBottom={1} borderColor="divider">
          <Typography variant="h6">{title}</Typography>
        </Box>
      )}

      <TableContainer>
        <Table>
          <TableHeader columns={columns} />
          {tableContent}
        </Table>
      </TableContainer>
    </Paper>
  );
});