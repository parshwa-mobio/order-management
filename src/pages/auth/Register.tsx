import { RegisterForm } from "../../components/auth/RegisterForm";
import { useNavigate } from "react-router-dom";
import { Container } from "@mui/material";
import { FormContainer } from "../../components/formCommon/FormContainer";

const Register = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/login");
  };

  return (
    <Container component="main" maxWidth="xs">
      <FormContainer title="Create a new account" onSubmit={() => {}}>
        <RegisterForm onSuccess={handleSuccess} />
      </FormContainer>
    </Container>
  );
};

export default Register;
