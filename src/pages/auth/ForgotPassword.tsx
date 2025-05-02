import { useState } from "react";
import { Alert } from "@mui/material";
import { FormContainer } from "../../components/formCommon/FormContainer";
import { FormTextField } from "../../components/formCommon/FormTextField";
import { FormButton } from "../../components/formCommon/FormButton";
import { FormTypography } from "../../components/formCommon/FormTypography";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // This is a placeholder for the actual password reset API call
      // In a real implementation, you would call your API here
      // For now, we'll just simulate a successful submission

      // Example of how the actual implementation might look:
      // const response = await fetch('/api/auth/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Failed to send reset email');
      // }

      setSubmitted(true);
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Failed to send reset email";
      setError(errorMessage);
    }
  };

  if (submitted) {
    return (
      <FormContainer title="Check your email" onSubmit={() => {}}>
        <FormTypography variant="body2" color="text.secondary">
          If an account exists for {email}, you will receive a password reset link.
        </FormTypography>
      </FormContainer>
    );
  }

  return (
    <FormContainer title="Reset your password" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <FormTextField
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
      />

      <FormButton
        type="submit"
        fullWidth
        variant="contained"
      >
        Reset Password
      </FormButton>
    </FormContainer>
  );
};

export default ForgotPassword;
