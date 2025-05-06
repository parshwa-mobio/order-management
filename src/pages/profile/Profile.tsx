import { useState } from "react";
import { User as UserIcon, Save } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { FormContainer } from "../../components/formCommon/FormContainer";
import { FormButton } from "../../components/formCommon/FormButton";
import { FormGrid } from "../../components/formCommon/FormGrid";
import { FormBox } from "../../components/formCommon/FormBox";
import { FormPaper } from "../../components/formCommon/FormPaper";
import { FormTypography } from "../../components/formCommon/FormTypography";
import { FormTextField } from "../../components/formCommon/FormTextField";

interface ProfileForm {
  name: string;
  email: string;
  companyName: string;
  distributorCode: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileForm>({
    name: user?.name || "",
    email: user?.email || "",
    companyName: user?.companyName || "",
    distributorCode: user?.distributorCode || "",
    phone: (user as any)?.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (field: keyof ProfileForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setProfile(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your submit logic here
  };

  const renderProfilePicture = () => (
    <FormGrid item xs={12}>
      <FormBox
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 3, md: 6 },
          p: 3,
          backgroundColor: "background.paper",
          borderRadius: 1,
          boxShadow: 1
        }}
      >
        <FormBox
          sx={{
            width: { xs: 72, sm: 96 },
            height: { xs: 72, sm: 96 },
            borderRadius: "50%",
            backgroundColor: "grey.100",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: 1,
            borderColor: "divider"
          }}
        >
          <UserIcon size={36} />
        </FormBox>
        <FormBox>
          <FormTypography variant="h6" gutterBottom>
            Profile Picture
          </FormTypography>
          <FormTypography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Update your profile picture
          </FormTypography>
          <FormButton
            variant="outlined"
            size="small"
          >
            Change
          </FormButton>
        </FormBox>
      </FormBox>
    </FormGrid>
  );

  const renderPersonalInfo = () => (
    <FormGrid item xs={12}>
      <FormBox
        sx={{
          backgroundColor: "background.paper",
          p: 3,
          borderRadius: 1,
          boxShadow: 1
        }}
      >
        <FormTypography variant="h6" gutterBottom>
          Personal Information
        </FormTypography>
        <FormGrid container spacing={3}>
          <FormGrid item xs={12} sm={6}>
            <FormTextField
              fullWidth
              label="Full Name"
              name="name"
              value={profile.name}
              onChange={handleChange("name")}
            />
          </FormGrid>
          <FormGrid item xs={12} sm={6}>
            <FormTextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange("email")}
            />
          </FormGrid>
          <FormGrid item xs={12} sm={6}>
            <FormTextField
              fullWidth
              label="Company Name"
              name="companyName"
              value={profile.companyName}
              onChange={handleChange("companyName")}
            />
          </FormGrid>
          <FormGrid item xs={12} sm={6}>
            <FormTextField
              fullWidth
              label="Distributor Code"
              name="distributorCode"
              value={profile.distributorCode}
              onChange={() => {}}
              readOnly
            />
          </FormGrid>
          <FormGrid item xs={12} sm={6}>
            <FormTextField
              fullWidth
              label="Phone Number"
              name="phone"
              type="text"
              value={profile.phone}
              onChange={handleChange("phone")}
            />
          </FormGrid>
        </FormGrid>
      </FormBox>
    </FormGrid>
  );

  const renderPasswordSection = () => (
    <FormGrid item xs={12}>
      <FormBox
        sx={{
          backgroundColor: "background.paper",
          p: 3,
          borderRadius: 1,
          boxShadow: 1
        }}
      >
        <FormTypography variant="h6" gutterBottom>
          Change Password
        </FormTypography>
        <FormGrid container spacing={3}>
          <FormGrid item xs={12}>
            <FormTextField
              fullWidth
              label="Current Password"
              name="currentPassword"
              type="password"
              value={profile.currentPassword}
              onChange={handleChange("currentPassword")}
            />
          </FormGrid>
          <FormGrid item xs={12}>
            <FormTextField
              fullWidth
              label="New Password"
              name="newPassword"
              type="password"
              value={profile.newPassword}
              onChange={handleChange("newPassword")}
            />
          </FormGrid>
          <FormGrid item xs={12}>
            <FormTextField
              fullWidth
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={profile.confirmPassword}
              onChange={handleChange("confirmPassword")}
            />
          </FormGrid>
        </FormGrid>
      </FormBox>
    </FormGrid>
  );

  return (
    <FormBox sx={{ p: { xs: 2, sm: 4, md: 6 } }}>
      <FormBox
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          borderBottom: 1,
          borderColor: "divider",
          pb: 2
        }}
      >
        <FormTypography variant="h4" component="h1">
          Profile Settings
        </FormTypography>
      </FormBox>

      <FormPaper elevation={2}>
        <FormContainer title="Profile" onSubmit={handleSubmit}>
          <FormBox sx={{ p: { xs: 2, sm: 4, md: 6 } }}>
            <FormGrid container spacing={{ xs: 3, md: 6 }}>
              {renderProfilePicture()}
              {renderPersonalInfo()}
              {renderPasswordSection()}
              
              <FormGrid item xs={12}>
                <FormBox
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 2
                  }}
                >
                  <FormButton
                    type="submit"
                    startIcon={<Save size={16} />}
                    variant="contained"
                    color="primary"
                  >
                    Save Changes
                  </FormButton>
                </FormBox>
              </FormGrid>
            </FormGrid>
          </FormBox>
        </FormContainer>
      </FormPaper>
    </FormBox>
  );
};

export default Profile;
