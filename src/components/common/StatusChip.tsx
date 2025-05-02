import { Chip } from '@mui/material';

interface StatusChipProps {
  status: 'active' | 'inactive';
}

export const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  return (
    <Chip
      label={status === 'active' ? 'Active' : 'Inactive'}
      color={status === 'active' ? 'success' : 'error'}
      size="small"
    />
  );
}; 