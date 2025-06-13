import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Autocomplete
} from '@mui/material';
import { Add, Delete, PersonAdd } from '@mui/icons-material';
import service from '../../services/service';

const CreateHouseholdModal = ({ open, onClose, onHouseholdCreated }) => {
  const [householdData, setHouseholdData] = useState({
    region: '',
    province: '',
    cityMunicipality: '',
    barangay: '',
    householdAddress: ''
  });  const [members, setMembers] = useState([]);
  const [showAddMemberForm, setShowAddMemberForm] = useState(true); // Start with form shown
  const [memberFormData, setMemberFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    birthdate: '',
    age: '',
    gender: '',
    marital_status: '',
    nationality: 'Filipino',
    placeOfBirth: '',
    citizenship: 'Filipino',
    contact: { 
      phone: '+639', 
      email: '' 
    },
    address: {
      house_number: '',
      street: '',
      barangay: '551 ZONE 54',
      city: 'MANILA',
      province: 'METRO MANILA',
      zip_code: ''
    },
    medical_info: {
      blood_type: 'N/A',
      medical_conditions: [],
      disabilities: [],
      emergency_contact: {
        name: '',
        relationship: '',
        phone: ''
      }
    },
    employment: { 
      occupation: '',
      employer: '',
      income_range: ''
    },
    education: { 
      highest_education: '',
      field_of_study: ''
    },
    registration: {
      resident_type: 'Permanent'
    }
  });
  
  const [unassignedResidents, setUnassignedResidents] = useState([]);
  const [selectedExistingResident, setSelectedExistingResident] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addMode, setAddMode] = useState('new'); // 'new' or 'existing'
  useEffect(() => {
    if (open) {
      fetchUnassignedResidents();
    }
  }, [open, members]); // Add members as dependency
  const fetchUnassignedResidents = async () => {
    try {
      const residents = await service.getUnassignedResidents();
      console.log('Fetched unassigned residents:', residents); // Debug log
      
      // Filter out residents that are already in the current members list
      const filteredResidents = residents.filter(resident => 
        !members.some(member => 
          member._id === resident._id || 
          (member.isExisting && member._id && member._id === resident._id)
        )
      );
      
      setUnassignedResidents(filteredResidents);
    } catch (error) {
      console.error('Error fetching unassigned residents:', error);
      setUnassignedResidents([]); // Ensure it's always an array
      setError('Error loading available residents. Please try again.');
    }
  };

  const handleHouseholdDataChange = (field, value) => {
    setHouseholdData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMemberFormChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setMemberFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setMemberFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleBirthdateChange = (value) => {
    setMemberFormData(prev => ({
      ...prev,
      birthdate: value,
      age: value ? calculateAge(value) : ''
    }));
  };  const handleAddMember = () => {
    if (addMode === 'existing' && selectedExistingResident) {
      // Check if this resident is already in the members list
      const isAlreadyAdded = members.some(member => 
        member._id === selectedExistingResident._id || 
        (member.isExisting && member._id && member._id === selectedExistingResident._id)
      );
      
      if (isAlreadyAdded) {
        setError('This resident is already added to the household');
        return;
      }
        const newMember = {
        ...selectedExistingResident,
        isExisting: true
      };
      setMembers(prev => [...prev, newMember]);
        // Remove the selected resident from unassigned list
      setUnassignedResidents(prev => 
        prev.filter(resident => resident._id !== selectedExistingResident._id)
      );
      
      setSelectedExistingResident(null);
      setError(''); // Clear errors when successfully adding
    } else if (addMode === 'new') {// Validate required fields
      if (!memberFormData.first_name || !memberFormData.last_name || !memberFormData.birthdate || 
          !memberFormData.gender || !memberFormData.marital_status || !memberFormData.contact.phone || 
          !memberFormData.contact.email || !memberFormData.address.house_number || 
          !memberFormData.address.street) {
        setError('Please fill in all required fields for the new member (name, birthdate, gender, marital status, phone, email, house number, and street)');
        return;
      }

      const newMember = {
        ...memberFormData,
        isExisting: false,
        tempId: Date.now() // Temporary ID for new members
      };
      setMembers(prev => [...prev, newMember]);
        // Reset form
      setMemberFormData({
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix: '',
        birthdate: '',
        age: '',
        gender: '',
        marital_status: '',
        nationality: 'Filipino',
        placeOfBirth: '',
        citizenship: 'Filipino',
        contact: { 
          phone: '+639', 
          email: '' 
        },
        address: {
          house_number: '',
          street: '',
          barangay: '551 ZONE 54',
          city: 'MANILA',
          province: 'METRO MANILA',
          zip_code: ''
        },
        medical_info: {
          blood_type: 'N/A',
          medical_conditions: [],
          disabilities: [],
          emergency_contact: {
            name: '',
            relationship: '',
            phone: ''
          }
        },
        employment: { 
          occupation: '',
          employer: '',
          income_range: ''
        },
        education: { 
          highest_education: '',
          field_of_study: ''
        },
        registration: {
          resident_type: 'Permanent'
        }
      });
    }    
    // Hide form after adding member (users can click "Add Member" to add more)
    setShowAddMemberForm(false);
    setError(''); // Clear any errors after successful addition
  };
  const handleRemoveMember = (index) => {
    const memberToRemove = members[index];
    
    // If it's an existing resident, add them back to unassigned list
    if (memberToRemove.isExisting && memberToRemove._id) {
      setUnassignedResidents(prev => [...prev, memberToRemove]);
    }
    
    setMembers(prev => prev.filter((_, i) => i !== index));
  };const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      // Validate household data
      if (!householdData.region || !householdData.province || !householdData.cityMunicipality || 
          !householdData.barangay || !householdData.householdAddress) {
        setError('Please fill in all household information');
        return;
      }

      // Validate members
      if (members.length === 0) {
        setError('Please add at least one member (household head)');
        return;
      }      if (members.length > 18) {
        setError('Maximum 18 members allowed per household');
        return;
      }      await service.createHousehold(householdData, members);
      onHouseholdCreated();
    } catch (error) {
      setError(error.message || 'Error creating household');
    } finally {
      setLoading(false);
    }
  };
  const handleClose = () => {
    setHouseholdData({
      region: '',
      province: '',
      cityMunicipality: '',
      barangay: '',
      householdAddress: ''
    });
    setMembers([]);    setMemberFormData({
      first_name: '',
      middle_name: '',
      last_name: '',
      suffix: '',
      birthdate: '',
      age: '',
      gender: '',
      marital_status: '',
      nationality: 'Filipino',
      placeOfBirth: '',
      citizenship: 'Filipino',
      contact: { 
        phone: '+639', 
        email: '' 
      },
      address: {
        house_number: '',
        street: '',
        barangay: '551 ZONE 54',
        city: 'MANILA',
        province: 'METRO MANILA',
        zip_code: ''
      },
      medical_info: {
        blood_type: 'N/A',
        medical_conditions: [],
        disabilities: [],
        emergency_contact: {
          name: '',
          relationship: '',
          phone: ''
        }
      },
      employment: { 
        occupation: '',
        employer: '',
        income_range: ''
      },
      education: { 
        highest_education: '',
        field_of_study: ''
      },
      registration: {
        resident_type: 'Permanent'
      }
    });
    setShowAddMemberForm(true); // Reset to show form for next time
    setError('');
    setSelectedExistingResident(null);
    onClose();
  };

  return (    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Create New Household
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Household Information */}
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Household Information
        </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Region *"
              value={householdData.region}
              onChange={(e) => handleHouseholdDataChange('region', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Province *"
              value={householdData.province}
              onChange={(e) => handleHouseholdDataChange('province', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="City/Municipality *"
              value={householdData.cityMunicipality}
              onChange={(e) => handleHouseholdDataChange('cityMunicipality', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Barangay *"
              value={householdData.barangay}
              onChange={(e) => handleHouseholdDataChange('barangay', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Household Address *"
              value={householdData.householdAddress}
              onChange={(e) => handleHouseholdDataChange('householdAddress', e.target.value)}
            />
          </Grid>
        </Grid>

        {/* Household Members */}        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Household Members ({members.length}/18)
          </Typography>
          {members.length > 0 && (
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => setShowAddMemberForm(true)}
              disabled={members.length >= 18}
            >
              Add Another Member
            </Button>
          )}
        </Box>{members.length === 0 ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            Please add at least one member to create the household. The first member you add will automatically become the household head.
          </Alert>
        ) : (
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Occupation</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {members.map((member, index) => (
                  <TableRow key={member._id || member.tempId}>
                    <TableCell>
                      <div>
                        {`${member.first_name} ${member.middle_name || ''} ${member.last_name}`.trim()}
                        {index === 0 && (
                          <Chip 
                            label="HOUSEHOLD HEAD" 
                            size="small" 
                            color="success"
                            sx={{ ml: 1, fontSize: '0.7rem', height: '20px' }}
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{member.age}</TableCell>
                    <TableCell>{member.gender}</TableCell>
                    <TableCell>{member.employment?.occupation || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={member.isExisting ? "Existing" : "New"} 
                        size="small"
                        color={member.isExisting ? "primary" : "secondary"}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveMember(index)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}        {/* Add Member Form */}
        {(showAddMemberForm || members.length === 0) && (
          <Box sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Add Member
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Add Member Type</InputLabel>
              <Select
                value={addMode}
                onChange={(e) => setAddMode(e.target.value)}
                label="Add Member Type"
              >
                <MenuItem value="new">Create New Resident</MenuItem>
                <MenuItem value="existing">Select Existing Resident</MenuItem>
              </Select>
            </FormControl>

            {addMode === 'existing' ? (
              <>                <Autocomplete
                  fullWidth
                  options={unassignedResidents || []}
                  getOptionLabel={(option) => {
                    if (!option) return '';
                    const name = `${option.first_name || ''} ${option.last_name || ''}`.trim();
                    const phone = option.contact?.phone || 'No phone';
                    return `${name} - ${phone}`;
                  }}
                  value={selectedExistingResident}
                  onChange={(event, newValue) => {
                    setSelectedExistingResident(newValue);
                    setError(''); // Clear any previous errors
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Existing Resident" />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} key={option._id}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>
                          {`${option.first_name || ''} ${option.last_name || ''}`.trim()}
                        </div>
                        <div style={{ fontSize: '0.8em', color: 'gray' }}>
                          Phone: {option.contact?.phone || 'N/A'} | Age: {option.age || 'N/A'}
                        </div>
                      </div>
                    </li>
                  )}
                  sx={{ mb: 2 }}
                  noOptionsText="No unassigned residents available"
                /><Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="contained" onClick={handleAddMember} disabled={!selectedExistingResident}>
                    Add Selected Resident
                  </Button>
                  <Button variant="outlined" onClick={() => {
                    if (members.length > 0) {
                      setShowAddMemberForm(false);
                    }
                  }}>
                    Cancel
                  </Button>
                </Box>
              </>
            ) : (
              <>                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      fullWidth
                      label="First Name *"
                      value={memberFormData.first_name}
                      onChange={(e) => handleMemberFormChange('first_name', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      fullWidth
                      label="Middle Name"
                      value={memberFormData.middle_name}
                      onChange={(e) => handleMemberFormChange('middle_name', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      fullWidth
                      label="Last Name *"
                      value={memberFormData.last_name}
                      onChange={(e) => handleMemberFormChange('last_name', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      fullWidth
                      label="Suffix"
                      value={memberFormData.suffix}
                      onChange={(e) => handleMemberFormChange('suffix', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="Birthdate *"
                      type="date"
                      value={memberFormData.birthdate}
                      onChange={(e) => handleBirthdateChange(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <TextField
                      fullWidth
                      label="Age"
                      value={memberFormData.age}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <FormControl fullWidth>
                      <InputLabel>Gender *</InputLabel>
                      <Select
                        value={memberFormData.gender}
                        onChange={(e) => handleMemberFormChange('gender', e.target.value)}
                        label="Gender *"
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <FormControl fullWidth>
                      <InputLabel>Marital Status *</InputLabel>
                      <Select
                        value={memberFormData.marital_status}
                        onChange={(e) => handleMemberFormChange('marital_status', e.target.value)}
                        label="Marital Status *"
                      >
                        <MenuItem value="Single">Single</MenuItem>
                        <MenuItem value="Married">Married</MenuItem>
                        <MenuItem value="Widowed">Widowed</MenuItem>
                        <MenuItem value="Divorced">Divorced</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Place of Birth"
                      value={memberFormData.placeOfBirth}
                      onChange={(e) => handleMemberFormChange('placeOfBirth', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Occupation"
                      value={memberFormData.employment.occupation}
                      onChange={(e) => handleMemberFormChange('employment.occupation', e.target.value)}
                    />
                  </Grid>                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Phone *"
                      value={memberFormData.contact.phone}
                      onChange={(e) => handleMemberFormChange('contact.phone', e.target.value)}
                    />
                  </Grid><Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Email *"
                      type="email"
                      value={memberFormData.contact.email}
                      onChange={(e) => handleMemberFormChange('contact.email', e.target.value)}
                    />
                  </Grid>
                  
                  {/* Address Information */}
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                      Address Information
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="House Number *"
                      value={memberFormData.address.house_number}
                      onChange={(e) => handleMemberFormChange('address.house_number', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <TextField
                      fullWidth
                      label="Street *"
                      value={memberFormData.address.street}
                      onChange={(e) => handleMemberFormChange('address.street', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="Barangay"
                      value={memberFormData.address.barangay}
                      onChange={(e) => handleMemberFormChange('address.barangay', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="City"
                      value={memberFormData.address.city}
                      onChange={(e) => handleMemberFormChange('address.city', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="Province"
                      value={memberFormData.address.province}
                      onChange={(e) => handleMemberFormChange('address.province', e.target.value)}
                    />
                  </Grid>
                </Grid>
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button variant="contained" onClick={handleAddMember}>
                    Add Member
                  </Button>
                  <Button variant="outlined" onClick={() => {
                    if (members.length > 0) {
                      setShowAddMemberForm(false);
                    }
                  }}>
                    Cancel
                  </Button>
                </Box>
              </>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={loading || members.length === 0}
        >
          {loading ? 'Creating...' : 'Create Household'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateHouseholdModal;
