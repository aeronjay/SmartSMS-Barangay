import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Box,
  Divider
} from '@mui/material';
import { Warning, Delete, PersonOff } from '@mui/icons-material';
import service from '../../services/service';

const DeleteHouseholdModal = ({ open, onClose, household, onDeleteSuccess }) => {
  const [deleteOption, setDeleteOption] = useState('household-only');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    setDeleteOption('household-only');
    setError('');
    onClose();
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError('');

      if (deleteOption === 'household-only') {
        await service.deleteHousehold(household._id);
      } else {
        await service.deleteHouseholdWithResidents(household._id);
      }

      onDeleteSuccess();
      handleClose();
    } catch (error) {
      console.error('Error deleting household:', error);
      setError(error.response?.data?.error || 'Error deleting household');
    } finally {
      setLoading(false);
    }
  };

  if (!household) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="delete-household-dialog-title"
    >
      <DialogTitle id="delete-household-dialog-title">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="warning" />
          Delete Household
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Household: {household.householdId}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Address: {household.householdAddress}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Members: {household.memberCount} member{household.memberCount !== 1 ? 's' : ''}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          What would you like to delete?
        </Typography>
        
        <RadioGroup
          value={deleteOption}
          onChange={(e) => setDeleteOption(e.target.value)}
        >
          <FormControlLabel
            value="household-only"
            control={<Radio />}
            label={
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonOff fontSize="small" />
                  <Typography variant="body1">Delete household only</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 3 }}>
                  Remove the household but keep all residents in the system as unassigned residents
                </Typography>
              </Box>
            }
          />
          
          <FormControlLabel
            value="household-and-residents"
            control={<Radio />}
            label={
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Delete fontSize="small" />
                  <Typography variant="body1" color="error">
                    Delete household and all residents
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 3 }}>
                  Permanently delete the household and all {household.memberCount} resident{household.memberCount !== 1 ? 's' : ''}
                </Typography>
              </Box>
            }
          />
        </RadioGroup>

        {deleteOption === 'household-and-residents' && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <Typography variant="body2" fontWeight="bold">
              ⚠️ This action cannot be undone!
            </Typography>
            <Typography variant="body2">
              All resident records will be permanently deleted from the system.
            </Typography>
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button 
          onClick={handleClose} 
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={loading}
          startIcon={deleteOption === 'household-and-residents' ? <Delete /> : <PersonOff />}
        >
          {loading ? 'Deleting...' : (
            deleteOption === 'household-and-residents' 
              ? 'Delete Household & Residents' 
              : 'Delete Household Only'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteHouseholdModal;
