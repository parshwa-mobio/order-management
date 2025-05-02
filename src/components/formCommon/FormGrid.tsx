import { Grid, GridProps } from "@mui/material";
import { ElementType } from "react";

interface FormGridProps extends GridProps {
  children: React.ReactNode;
  component?: ElementType;
  item?: boolean;
  xs?: number | boolean;
  sm?: number | boolean;
  md?: number | boolean;
  lg?: number | boolean;
  xl?: number | boolean;
}

export const FormGrid: React.FC<FormGridProps> = ({ children, component = "div", item = true, ...props }) => {
  return (
    <Grid
      component={component}
      item={item}
      {...props}
    >
      {children}
    </Grid>
  );
};