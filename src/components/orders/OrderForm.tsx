import {
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid
} from "@mui/material";
import { FormGrid } from "../formCommon/FormGrid";
import { PaperBox } from "../formCommon/PaperBox";

interface OrderFormProps {
  containerType: string;
  deliveryDate: string;
  onContainerTypeChange: (value: string) => void;
  onDeliveryDateChange: (value: string) => void;
}

export const OrderForm = ({
  containerType,
  deliveryDate,
  onContainerTypeChange,
  onDeliveryDateChange
}: OrderFormProps) => {
  const handleContainerTypeChange = (event: SelectChangeEvent) => {
    onContainerTypeChange(event.target.value);
  };

  return (
    <FormGrid item xs={12} md={8}>
      <PaperBox sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Order Details
        </Typography>
        <Grid container spacing={2}>
          <FormGrid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="container-type-label">Container Type</InputLabel>
              <Select
                labelId="container-type-label"
                value={containerType}
                label="Container Type"
                onChange={handleContainerTypeChange}
              >
                <MenuItem value="20ft">20ft Container</MenuItem>
                <MenuItem value="40ft">40ft Container</MenuItem>
                <MenuItem value="40ft-hc">40ft High Cube</MenuItem>
              </Select>
            </FormControl>
          </FormGrid>
          <FormGrid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Delivery Date"
              type="date"
              value={deliveryDate}
              onChange={(e) => onDeliveryDateChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </FormGrid>
        </Grid>
      </PaperBox>
    </FormGrid>
  );
};
