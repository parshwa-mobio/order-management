import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { TextField, Button, Alert, Box } from "@mui/material";

interface LoginFormProps {
  onSuccess?: (role: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [mfaRequired, setMfaRequired] = useState(false);

  const { login, verifyMFA, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mfaRequired) {
        const result = await verifyMFA(otp, email, password);
        if (!result.role) {
          throw new Error("Role not found in MFA verification response");
        }
        onSuccess?.(result.role);
      } else {
        const result = await login(email, password);
        if (result.requiresMFA) {
          setMfaRequired(true);
          return;
        }
        if (!result.role) {
          throw new Error("Role not found in login response");
        }
        onSuccess?.(result.role);
      }
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={mfaRequired}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={mfaRequired}
      />
      {mfaRequired && (
        <TextField
          margin="normal"
          required
          fullWidth
          name="otp"
          label="One-Time Password (OTP)"
          type="text"
          id="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      )}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? "Signing in..." : mfaRequired ? "Verify OTP" : "Sign in"}
      </Button>
    </Box>
  );
};
