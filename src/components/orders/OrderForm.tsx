import {
  Grid,
  Typography,
  Divider,
} from '@mui/material';
import { FormPaper } from '../formCommon/FormPaper';
import { FormBox } from '../formCommon/FormBox';
import { FormGrid } from '../formCommon/FormGrid';
import { FormSelect } from '../formCommon/FormSelect';
import { FormTextField } from '../formCommon/FormTextField';

interface OrderFormProps {
  containerType: string;
  deliveryDate: string;
  notes: string;
  onContainerTypeChange: (value: string) => void;
  onDeliveryDateChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}

const containerOptions = [
  { value: '20ft', label: '20ft Container' },
  { value: '40ft', label: '40ft Container' },
  { value: '40ft-hc', label: '40ft High Cube' }
];

export const OrderForm = ({
  containerType,
  deliveryDate,
  notes,
  onContainerTypeChange,
  onDeliveryDateChange,
  onNotesChange
}: OrderFormProps) => {
  return (
    <FormPaper elevation={2}>
      <FormBox sx={{ p: 3 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 3, 
            fontWeight: 600,
            color: 'primary.main'
          }}
        >
          Order Details
        </Typography>

        <Grid container spacing={3}>
          <FormGrid item xs={12} md={6}>
            <FormSelect
              id="containerType"
              name="containerType"
              label="Container Type"
              value={containerType}
              onChange={(e) => onContainerTypeChange(e.target.value)}
              options={containerOptions}
              required
            />
          </FormGrid>

          <FormGrid item xs={12} md={6}>
            <FormTextField
              name="deliveryDate"
              label="Delivery Date"
              type="text"
              value={deliveryDate}
              onChange={(e) => onDeliveryDateChange(e.target.value)}
              required
              slotProps={{
                inputLabel: {
                  shrink: true
                }
              }}
            />
          </FormGrid>

          <FormGrid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </FormGrid>

          <FormGrid item xs={12}>
            <FormTextField
              name="notes"
              label="Order Notes"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              multiline
              rows={4}
              placeholder="Add any special instructions or notes for this order..."
            />
          </FormGrid>
        </Grid>
      </FormBox>
    </FormPaper>
  );
};
