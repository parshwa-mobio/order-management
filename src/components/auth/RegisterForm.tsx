import React, { useState, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Alert, SelectChangeEvent, MenuItem } from "@mui/material";
import { FormBox } from "../formCommon/FormBox";
import { FormButton } from "../formCommon/FormButton";
import { FormTextField } from "../formCommon/FormTextField";
import { FormSelect } from "../formCommon/FormSelect";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "dealer", // Default role
  });

  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const { register, loading, error } = useAuth();

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'password' || name === 'confirmPassword') {
      setPasswordMismatch(false);
    }
  }, []);

  const handleSelectChange = useCallback((e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      onSuccess?.();
    } catch (err) {
      console.error('Registration error:', err);
    }
  }, [formData, register, onSuccess]);

  return (
    <FormBox>
        {error && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

      <form onSubmit={handleSubmit} noValidate>
        <FormTextField
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={formData.email}
          onChange={handleTextChange}
          sx={{ mb: 2 }}
        />

        <FormTextField
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleTextChange}
          error={passwordMismatch}
          sx={{ mb: 2 }}
        />

        <FormTextField
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleTextChange}
          error={passwordMismatch}
          helperText={passwordMismatch ? "Passwords do not match" : ""}
          sx={{ mb: 2 }}
        />

        <FormSelect
            id="role"
            name="role"
          label="Role"
            value={formData.role}
            onChange={handleSelectChange}
          sx={{ mb: 2 }}
          >
            <MenuItem value="dealer">Dealer</MenuItem>
            <MenuItem value="distributor">Distributor</MenuItem>
            <MenuItem value="sales">Sales Team</MenuItem>
            <MenuItem value="exportTeam">Export Team</MenuItem>
        </FormSelect>

        <FormButton
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </FormButton>
      </form>
    </FormBox>
  );
};

