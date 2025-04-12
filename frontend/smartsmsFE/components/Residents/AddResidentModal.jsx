import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  Card,
  CardHeader,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function AddResidentModal({ open, onClose }) {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    birthdate: "",
    age: "",
    gender: "",
    marital_status: "",
    nationality: "Filipino",
    contact: {
      phone: "",
      email: "",
    },
    address: {
      house_number: "",
      street: "",
      barangay: "",
      city: "",
      province: "",
      zip_code: "",
    },
    medical_info: {
      blood_type: "",
      medical_conditions: [],
      disabilities: [],
      emergency_contact: {
        name: "",
        relationship: "",
        phone: "",
      },
    },
    employment: {
      occupation: "",
      employer: "",
      income_range: "",
    },
    education: {
      highest_education: "",
      field_of_study: "",
    },
    registration: {
      resident_type: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleMedicalInfoChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      medical_info: {
        ...prev.medical_info,
        [field]: value,
      },
    }));
  };

  const handleEmergencyContactChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      medical_info: {
        ...prev.medical_info,
        emergency_contact: {
          ...prev.medical_info.emergency_contact,
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = () => {
    console.log("Submitting:", formData);

    

    // Reset form
    setFormData({
      first_name: "",
      middle_name: "",
      last_name: "",
      suffix: "",
      birthdate: "",
      age: "",
      gender: "",
      marital_status: "",
      nationality: "Filipino",
      contact: {
        phone: "",
        email: "",
      },
      address: {
        house_number: "",
        street: "",
        barangay: "",
        city: "",
        province: "",
        zip_code: "",
      },
      medical_info: {
        blood_type: "",
        medical_conditions: [],
        disabilities: [],
        emergency_contact: {
          name: "",
          relationship: "",
          phone: "",
        },
      },
      employment: {
        occupation: "",
        employer: "",
        income_range: "",
      },
      education: {
        highest_education: "",
        field_of_study: "",
      },
      registration: {
        resident_type: "",
      },
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Add New Resident</Typography>
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent dividers>
        {/* BASIC INFORMATION */}
        <Card variant="outlined" sx={{ my: 3 }}>
          <CardHeader title={<Typography variant="subtitle1">Basic Information</Typography>} />
          <Divider />
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Middle Name"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Suffix"
                name="suffix"
                value={formData.suffix}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Birthdate"
                name="birthdate"
                type="date"
                value={formData.birthdate}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  label="Gender"
                  required
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Marital Status</InputLabel>
                <Select
                  name="marital_status"
                  value={formData.marital_status}
                  onChange={handleChange}
                  label="Marital Status"
                  required
                >
                  <MenuItem value="Single">Single</MenuItem>
                  <MenuItem value="Married">Married</MenuItem>
                  <MenuItem value="Widowed">Widowed</MenuItem>
                  <MenuItem value="Divorced">Divorced</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </Card>

        {/* CONTACT INFORMATION */}
        <Card variant="outlined" sx={{ my: 3 }}>
          <CardHeader title={<Typography variant="subtitle1">Contact Information</Typography>} />
          <Divider />
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Phone"
                value={formData.contact.phone}
                onChange={(e) => handleNestedChange("contact", "phone", e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Email"
                value={formData.contact.email}
                onChange={(e) => handleNestedChange("contact", "email", e.target.value)}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        </Card>

        {/* ADDRESS INFORMATION */}
        <Card variant="outlined" sx={{ my: 3 }}>
          <CardHeader title={<Typography variant="subtitle1">Address Information</Typography>} />
          <Divider />
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="House Number"
                value={formData.address.house_number}
                onChange={(e) => handleNestedChange("address", "house_number", e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Street"
                value={formData.address.street}
                onChange={(e) => handleNestedChange("address", "street", e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Barangay"
                value={formData.address.barangay}
                onChange={(e) => handleNestedChange("address", "barangay", e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="City"
                value={formData.address.city}
                onChange={(e) => handleNestedChange("address", "city", e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Province"
                value={formData.address.province}
                onChange={(e) => handleNestedChange("address", "province", e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Zip Code"
                value={formData.address.zip_code}
                onChange={(e) => handleNestedChange("address", "zip_code", e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        </Card>

        {/* MEDICAL INFORMATION */}
        <Card variant="outlined" sx={{ my: 3 }}>
          <CardHeader title={<Typography variant="subtitle1">Medical Information</Typography>} />
          <Divider />
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Blood Type</InputLabel>
                <Select
                  value={formData.medical_info.blood_type}
                  onChange={(e) => handleMedicalInfoChange("blood_type", e.target.value)}
                  label="Blood Type"
                  fullWidth
                >
                  <MenuItem value="O+">O+</MenuItem>
                  <MenuItem value="O-">O-</MenuItem>
                  <MenuItem value="A+">A+</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>
                  <MenuItem value="AB+">AB+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>
                  <MenuItem value="N/A">N/A</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Medical Conditions"
                value={formData.medical_info.medical_conditions.join(", ")}
                onChange={(e) =>
                  handleMedicalInfoChange(
                    "medical_conditions",
                    e.target.value.split(",").map((c) => c.trim())
                  )
                }
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Disabilities"
                value={formData.medical_info.disabilities.join(", ")}
                onChange={(e) =>
                  handleMedicalInfoChange(
                    "disabilities",
                    e.target.value.split(",").map((d) => d.trim())
                  )
                }
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Emergency Contact Name"
                value={formData.medical_info.emergency_contact.name}
                onChange={(e) => handleEmergencyContactChange("name", e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Relationship"
                value={formData.medical_info.emergency_contact.relationship}
                onChange={(e) => handleEmergencyContactChange("relationship", e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Emergency Contact Phone"
                value={formData.medical_info.emergency_contact.phone}
                onChange={(e) => handleEmergencyContactChange("phone", e.target.value)}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        </Card>

        {/* EMPLOYMENT INFORMATION */}
        <Card variant="outlined" sx={{ my: 3 }}>
          <CardHeader title={<Typography variant="subtitle1">Employment Information</Typography>} />
          <Divider />
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Occupation"
                value={formData.employment.occupation}
                onChange={(e) => handleNestedChange("employment", "occupation", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Employer"
                value={formData.employment.employer}
                onChange={(e) => handleNestedChange("employment", "employer", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Income Range"
                value={formData.employment.income_range}
                onChange={(e) => handleNestedChange("employment", "income_range", e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        </Card>

        {/* EDUCATION INFORMATION */}
        <Card variant="outlined" sx={{ my: 3 }}>
          <CardHeader title={<Typography variant="subtitle1">Education Information</Typography>} />
          <Divider />
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Highest Education"
                value={formData.education.highest_education}
                onChange={(e) => handleNestedChange("education", "highest_education", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Field of Study"
                value={formData.education.field_of_study}
                onChange={(e) => handleNestedChange("education", "field_of_study", e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        </Card>

        {/* REGISTRATION INFORMATION */}
        <Card variant="outlined" sx={{ my: 3 }}>
          <CardHeader title={<Typography variant="subtitle1">Registration Information</Typography>} />
          <Divider />
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Resident Type</InputLabel>
                <Select
                  value={formData.registration.resident_type}
                  onChange={(e) => handleNestedChange("registration", "resident_type", e.target.value)}
                  label="Resident Type"
                  fullWidth
                >
                  <MenuItem value="Permanent">Permanent</MenuItem>
                  <MenuItem value="Temporary">Temporary</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Card>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Save Resident
        </Button>
      </DialogActions>
    </Dialog>
  );
}