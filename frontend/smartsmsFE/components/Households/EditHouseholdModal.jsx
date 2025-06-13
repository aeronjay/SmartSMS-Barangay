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
  Autocomplete,
  DialogContentText
} from '@mui/material';
import { Add, Delete, PersonAdd, Edit, SwapHoriz } from '@mui/icons-material';
import service from '../../services/service';

const EditHouseholdModal = ({ open, onClose, onHouseholdUpdated, householdData }) => {
  const [household, setHousehold] = useState({
    region: '',
    province: '',
    cityMunicipality: '',
    barangay: '',
    householdAddress: ''
  });
  
  const [members, setMembers] = useState([]);
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [showChangeHeadDialog, setShowChangeHeadDialog] = useState(false);
  const [selectedNewHead, setSelectedNewHead] = useState(null);
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
  const [addMode, setAddMode] = useState('new');
  const [removeAction, setRemoveAction] = useState('unassign'); // 'unassign' or 'delete'

  useEffect(() => {
    if (open && householdData) {
      setHousehold({
        region: householdData.household.region || '',
        province: householdData.household.province || '',
        cityMunicipality: householdData.household.cityMunicipality || '',
        barangay: householdData.household.barangay || '',
        householdAddress: householdData.household.householdAddress || ''
      });
      setMembers(householdData.members || []);
      fetchUnassignedResidents();
    }
  }, [open, householdData]);  const fetchUnassignedResidents = async () => {
    try {
      const residents = await service.getUnassignedResidents();
      setUnassignedResidents(residents);
    } catch (error) {
      console.error('Error fetching unassigned residents:', error);
      setUnassignedResidents([]); // Ensure it's always an array
    }
  };

  const handleHouseholdDataChange = (field, value) => {
    setHousehold(prev => ({
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
  };

  const handleAddMember = async () => {
    try {
      setLoading(true);
      let memberData;
      let isExisting = false;

      if (addMode === 'existing' && selectedExistingResident) {
        memberData = selectedExistingResident;
        isExisting = true;      } else if (addMode === 'new') {
        if (!memberFormData.first_name || !memberFormData.last_name || !memberFormData.birthdate || 
            !memberFormData.gender || !memberFormData.marital_status || !memberFormData.contact.phone ||
            !memberFormData.contact.email || !memberFormData.address.house_number || 
            !memberFormData.address.street || !memberFormData.address.barangay || 
            !memberFormData.address.city || !memberFormData.address.province) {
          setError('Please fill in all required fields for the new member');
          return;
        }
        memberData = memberFormData;
        isExisting = false;
      }
      
      await service.addHouseholdMember(householdData.household._id, memberData, isExisting);

      // Refresh household data
      const response = await service.getHousehold(householdData.household._id);
      setMembers(response.members);
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
      setSelectedExistingResident(null);
      setShowAddMemberForm(false);
      setError('');
      fetchUnassignedResidents();
    } catch (error) {
      setError(error.response?.data?.message || 'Error adding member');
    } finally {
      setLoading(false);
    }
  };
  const handleRemoveMember = (member) => {
    setMemberToRemove(member);
    setRemoveAction('unassign'); // Reset to default action
    setShowRemoveDialog(true);
  };const confirmRemoveMember = async () => {
    try {
      setLoading(true);
      
      await service.removeHouseholdMember(
        householdData.household._id, 
        memberToRemove._id, 
        removeAction
      );

      // Refresh household data
      const response = await service.getHousehold(householdData.household._id);
      setMembers(response.members);
        setShowRemoveDialog(false);
      setMemberToRemove(null);
      fetchUnassignedResidents();
    } catch (error) {
      console.error('Error removing member:', error);
      setError(error.response?.data?.error || error.message || 'Error removing member');
      // Don't close dialog on error so user can see the error and try again
    } finally {
      setLoading(false);
    }
  };

  const handleChangeHead = (member) => {
    setSelectedNewHead(member);
    setShowChangeHeadDialog(true);
  };
  const confirmChangeHead = async () => {
    try {
      setLoading(true);      await service.changeHouseholdHead(
        householdData.household._id, 
        selectedNewHead._id
      );

      // Refresh household data
      const response = await service.getHousehold(householdData.household._id);
      setMembers(response.members);
      
      setShowChangeHeadDialog(false);
      setSelectedNewHead(null);
    } catch (error) {
      setError(error.response?.data?.error || 'Error changing household head');
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      // Validate household data
      if (!household.region || !household.province || !household.cityMunicipality || 
          !household.barangay || !household.householdAddress) {
        setError('Please fill in all household information');
        return;
      }

      console.log('Updating household with data:', household);
      console.log('Household ID:', householdData.household._id);
      
      await service.updateHousehold(householdData.household._id, household);

      console.log('Household updated successfully');
      onHouseholdUpdated();
      handleClose(); // Close modal after successful update
    } catch (error) {
      console.error('Error updating household:', error);
      setError(error.response?.data?.message || error.message || 'Error updating household');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setShowAddMemberForm(false);
    setSelectedExistingResident(null);
    onClose();
  };

  const currentHead = members.find(member => member.isHouseholdHead);
  const nonHeadMembers = members.filter(member => !member.isHouseholdHead);

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>        <DialogTitle>
          Edit Household
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
                value={household.region}
                onChange={(e) => handleHouseholdDataChange('region', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Province *"
                value={household.province}
                onChange={(e) => handleHouseholdDataChange('province', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="City/Municipality *"
                value={household.cityMunicipality}
                onChange={(e) => handleHouseholdDataChange('cityMunicipality', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Barangay *"
                value={household.barangay}
                onChange={(e) => handleHouseholdDataChange('barangay', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Household Address *"
                value={household.householdAddress}
                onChange={(e) => handleHouseholdDataChange('householdAddress', e.target.value)}
              />
            </Grid>
          </Grid>

          {/* Household Members */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Household Members ({members.length}/18)
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => setShowAddMemberForm(true)}
              disabled={members.length >= 18}
            >
              Add Member
            </Button>
          </Box>

          {members.length === 0 ? (
            <Alert severity="warning">
              No members in this household.
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
                    <TableCell>Phone</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member._id}>
                      <TableCell>
                        <div>
                          {`${member.first_name} ${member.middle_name || ''} ${member.last_name}`.trim()}
                          {member.isHouseholdHead && (
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
                      <TableCell>{member.contact?.phone || 'N/A'}</TableCell>
                      <TableCell>
                        {!member.isHouseholdHead && (
                          <IconButton
                            size="small"
                            onClick={() => handleChangeHead(member)}
                            color="primary"
                            title="Make Household Head"
                          >
                            <SwapHoriz />
                          </IconButton>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveMember(member)}
                          color="error"
                          title="Remove Member"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Add Member Form - Similar to CreateHouseholdModal but simplified */}
          {showAddMemberForm && (
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
                <>                  <Autocomplete
                    fullWidth
                    options={unassignedResidents || []}
                    getOptionLabel={(option) => `${option.first_name} ${option.last_name} - ${option.contact?.phone || 'No phone'}`}
                    value={selectedExistingResident}
                    onChange={(event, newValue) => setSelectedExistingResident(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Select Existing Resident" />
                    )}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      variant="contained" 
                      onClick={handleAddMember} 
                      disabled={!selectedExistingResident || loading}
                    >
                      {loading ? 'Adding...' : 'Add Selected Resident'}
                    </Button>
                    <Button variant="outlined" onClick={() => setShowAddMemberForm(false)}>
                      Cancel
                    </Button>
                  </Box>
                </>
              ) : (
                <>                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="First Name *"
                        value={memberFormData.first_name}
                        onChange={(e) => handleMemberFormChange('first_name', e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="Middle Name"
                        value={memberFormData.middle_name}
                        onChange={(e) => handleMemberFormChange('middle_name', e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="Last Name *"
                        value={memberFormData.last_name}
                        onChange={(e) => handleMemberFormChange('last_name', e.target.value)}
                      />                    </Grid>
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
                    <Grid size={{ xs: 12, md: 2 }}>
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
                    <Grid size={{ xs: 12, md: 4 }}>
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
                        </Select>                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Phone *"
                        value={memberFormData.contact.phone}
                        onChange={(e) => handleMemberFormChange('contact.phone', e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Email *"
                        type="email"
                        value={memberFormData.contact.email}
                        onChange={(e) => handleMemberFormChange('contact.email', e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="House Number *"
                        value={memberFormData.address.house_number}
                        onChange={(e) => handleMemberFormChange('address.house_number', e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
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
                        label="Barangay *"
                        value={memberFormData.address.barangay}
                        onChange={(e) => handleMemberFormChange('address.barangay', e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="City *"
                        value={memberFormData.address.city}
                        onChange={(e) => handleMemberFormChange('address.city', e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="Province *"
                        value={memberFormData.address.province}
                        onChange={(e) => handleMemberFormChange('address.province', e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Occupation"
                        value={memberFormData.employment.occupation}
                        onChange={(e) => handleMemberFormChange('employment.occupation', e.target.value)}
                      />
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button 
                      variant="contained" 
                      onClick={handleAddMember}
                      disabled={loading}
                    >
                      {loading ? 'Adding...' : 'Add Member'}
                    </Button>
                    <Button variant="outlined" onClick={() => setShowAddMemberForm(false)}>
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
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Household'}
          </Button>
        </DialogActions>
      </Dialog>      {/* Remove Member Confirmation Dialog */}
      <Dialog open={showRemoveDialog} onClose={() => {
        setShowRemoveDialog(false);
        setMemberToRemove(null);
      }}>
        <DialogTitle>Remove Member</DialogTitle>
        <DialogContent>
          <DialogContentText>
            What would you like to do with {memberToRemove?.first_name} {memberToRemove?.last_name}?
          </DialogContentText>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Action</InputLabel>
            <Select
              value={removeAction}
              onChange={(e) => setRemoveAction(e.target.value)}
              label="Action"
            >
              <MenuItem value="unassign">Unassign from household (keep resident record)</MenuItem>
              <MenuItem value="delete">Delete resident entirely</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowRemoveDialog(false);
            setMemberToRemove(null);
          }}>Cancel</Button>
          <Button 
            onClick={confirmRemoveMember} 
            color="error"
            disabled={loading}
          >
            {loading ? 'Processing...' : (removeAction === 'delete' ? 'Delete' : 'Unassign')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Head Confirmation Dialog */}
      <Dialog open={showChangeHeadDialog} onClose={() => setShowChangeHeadDialog(false)}>
        <DialogTitle>Change Household Head</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to make {selectedNewHead?.first_name} {selectedNewHead?.last_name} the new household head?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowChangeHeadDialog(false)}>Cancel</Button>
          <Button 
            onClick={confirmChangeHead} 
            color="primary"
            disabled={loading}
          >
            {loading ? 'Changing...' : 'Change Head'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditHouseholdModal;
