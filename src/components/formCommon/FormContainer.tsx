import { ReactNode } from "react";
import { Container, ContainerProps, Theme } from "@mui/material";
import { FormBox } from "./FormBox";
import { FormPaper } from "./FormPaper";

// Default style configurations
const defaultStyles = {
  container: { maxWidth: "lg" } as const,
  box: {
    sx: {
      py: 4,
      px: 3,
      '& .MuiPaper-root': {
        boxShadow: (theme: Theme) => theme.shadows[2],
        borderRadius: 2,
        bgcolor: 'background.paper',
      }
    }
  }
};

interface FormContainerProps {
  title?: string;
  children: ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  containerProps?: ContainerProps;
  boxProps?: React.ComponentProps<typeof FormBox>;
}

export const FormContainer: React.FC<FormContainerProps> = ({
  title,
  children,
  onSubmit,
  containerProps = defaultStyles.container,
  boxProps = defaultStyles.box
}) => {
  const content = (
    <FormBox
      component={onSubmit ? "form" : "div"}
      onSubmit={onSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
    >
      {children}
    </FormBox>
  );

  return (
    <Container {...containerProps}>
      <FormBox {...boxProps}>
        {title ? (
          <FormPaper title={title}>
            {content}
          </FormPaper>
        ) : (
          content
        )}
      </FormBox>
    </Container>
  );
};