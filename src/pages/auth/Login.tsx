import { useNavigate } from "react-router-dom";
import { LoginForm } from "../../components/auth/LoginForm";
import { Container } from "@mui/material";
import { FormContainer } from "../../components/formCommon/FormContainer";

const Login = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (role: string) => {
    const dashboardRoles = [
      "admin",
      "distributor",
      "dealer",
      "sales",
      "exportTeam",
    ];
    navigate(dashboardRoles.includes(role) ? "/dashboard" : "/");
  };

  return (
    <Container component="main" maxWidth="xs">
      <FormContainer title="Sign in to your account">
        <LoginForm onSuccess={handleLoginSuccess} />
      </FormContainer>
    </Container>
  );
};

export default Login;
