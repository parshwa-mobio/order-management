import { useState, useEffect } from "react";
import { FormContainer } from "../../components/formCommon/FormContainer";
import { FormCheckbox } from "../../components/formCommon/FormCheckbox";
import { FormSelect } from "../../components/formCommon/FormSelect";
import { FormAlert } from "../../components/formCommon/FormAlert";
import { FormButton } from "../../components/formCommon/FormButton";
import { FormGrid } from "../../components/formCommon/FormGrid";
import { FormBox } from "../../components/formCommon/FormBox";
import { FormPaper } from "../../components/formCommon/FormPaper";
import { useSettings } from "../../hooks/settings/useSettings";

const Settings = () => {
  const { settings, updateSettings, isLoading, error, resetError } = useSettings();
  const [formData, setFormData] = useState({
    notifications: settings?.notifications || false,
    emailUpdates: settings?.emailUpdates || false,
    language: settings?.language || "en",
    theme: settings?.theme || "light",
    timezone: settings?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    currency: settings?.currency || "USD"
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        notifications: settings.notifications || false,
        emailUpdates: settings.emailUpdates || false,
        language: settings.language || "en",
        theme: settings.theme || "light",
        timezone: settings.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        currency: settings.currency || "USD"
      });
    }
  }, [settings]);

  const handleChange = (field: keyof typeof formData) => (
    value: any
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(formData);
    } catch (err) {
      console.error("Failed to update settings:", err);
    }
  };

  return (
    <FormBox maxWidth="lg" py={6}>
      {error && (
        <FormAlert
          severity="error"
          title="Error"
          message={error}
          onClose={resetError}
          sx={{ mb: 3 }}
        />
      )}
      <FormPaper>
        <FormContainer title="Settings" onSubmit={handleSubmit}>
          <FormGrid container spacing={3}>
            <FormGrid item xs={12} md={4}>
              <FormBox display="flex" flexDirection="column" gap={2}>
                <FormCheckbox
                  name="notifications"
                  value={formData.notifications}
                  onChange={(_, checked) => handleChange("notifications")(checked)}
                  label="Enable push notifications"
                  helperText="Receive notifications about orders and updates"
                />
                <FormCheckbox
                  name="emailUpdates"
                  value={formData.emailUpdates}
                  onChange={(_, checked) => handleChange("emailUpdates")(checked)}
                  label="Email updates"
                  helperText="Receive email notifications about important updates"
                />
              </FormBox>
            </FormGrid>
            <FormGrid item xs={12} md={8}>
              <FormBox display="flex" flexDirection="column" gap={3}>
                <FormSelect
                  id="language"
                  name="language"
                  label="Language"
                  value={formData.language}
                  onChange={(e) => handleChange("language")(e.target.value)}
                  options={[
                    { value: "en", label: "English" },
                    { value: "es", label: "Spanish" },
                    { value: "fr", label: "French" }
                  ]}
                />
                <FormSelect
                  id="theme"
                  name="theme"
                  label="Theme"
                  value={formData.theme}
                  onChange={(e) => handleChange("theme")(e.target.value)}
                  options={[
                    { value: "light", label: "Light" },
                    { value: "dark", label: "Dark" }
                  ]}
                />
                <FormSelect
                  id="timezone"
                  name="timezone"
                  label="Timezone"
                  value={formData.timezone}
                  onChange={(e) => handleChange("timezone")(e.target.value)}
                  options={[
                    { value: Intl.DateTimeFormat().resolvedOptions().timeZone, label: "Local Timezone" },
                    { value: "UTC", label: "UTC" }
                  ]}
                />
                <FormSelect
                  id="currency"
                  name="currency"
                  label="Currency"
                  value={formData.currency}
                  onChange={(e) => handleChange("currency")(e.target.value)}
                  options={[
                    { value: "USD", label: "US Dollar" },
                    { value: "EUR", label: "Euro" },
                    { value: "GBP", label: "British Pound" }
                  ]}
                />
                <FormBox display="flex" justifyContent="flex-end">
                  <FormButton
                    type="submit"
                    disabled={isLoading}
                    loading={isLoading}
                  >
                    Save Settings
                  </FormButton>
                </FormBox>
              </FormBox>
            </FormGrid>
          </FormGrid>
        </FormContainer>
      </FormPaper>
    </FormBox>
  );
};

export default Settings;
