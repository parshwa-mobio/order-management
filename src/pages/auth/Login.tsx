import { useNavigate } from "react-router-dom";
import { LoginForm } from "../../components/auth/LoginForm";
import { Container, Typography, Box } from "@mui/material";

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
    navigate(dashboardRoles.includes(role) ? "/" : "/");
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in to your account
        </Typography>
        <LoginForm onSuccess={handleLoginSuccess} />
      </Box>
    </Container>
  );
};

export default Login;
