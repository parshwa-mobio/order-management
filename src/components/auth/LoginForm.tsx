import React, { useState, useCallback, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Alert } from "@mui/material";
import { FormBox } from "../formCommon/FormBox";
import { FormButton } from "../formCommon/FormButton";
import { FormTextField } from "../formCommon/FormTextField";

interface LoginFormProps {
  onSuccess?: (role: string) => void;
}

interface AuthResult {
  role?: string;
  requiresMFA?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
  });
  const [mfaRequired, setMfaRequired] = useState(false);
  const { login, verifyMFA, loading, error } = useAuth();

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleAuthSuccess = useCallback(
    (result: AuthResult) => {
      if (!result.role) {
        throw new Error("Role not found in response");
      }
      onSuccess?.(result.role);
    },
    [onSuccess]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (mfaRequired) {
          const result = await verifyMFA(
            formData.otp,
            formData.email,
            formData.password
          );
          handleAuthSuccess(result);
        } else {
          const result = await login(formData.email, formData.password);
          if (result.requiresMFA) {
            setMfaRequired(true);
            return;
          }
          handleAuthSuccess(result);
        }
      } catch (err) {
        console.error("Login error:", err);
      }
    },
    [mfaRequired, formData, login, verifyMFA, handleAuthSuccess]
  );

  const buttonText = useMemo(() => {
    if (loading) return "Signing in...";
    return mfaRequired ? "Verify OTP" : "Sign in";
  }, [loading, mfaRequired]);

  return (
    <FormBox>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <FormTextField
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={formData.email}
          onChange={handleInputChange}
          disabled={mfaRequired}
          sx={{ mb: 2 }}
        />
        <FormTextField
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleInputChange}
          disabled={mfaRequired}
          sx={{ mb: 2 }}
        />
        {mfaRequired && (
          <FormTextField
            required
            fullWidth
            name="otp"
            label="One-Time Password (OTP)"
            type="text"
            id="otp"
            value={formData.otp}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
        )}
        <FormButton
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
        >
          {buttonText}
        </FormButton>
      </form>
    </FormBox>
  );
};
