import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import service from '../../services/service';

export default function DeleteResidentModal({ open, onClose, resident, onDeleteSuccess }) {
  const handleDelete = async () => {
    try {
      await service.deleteResident(resident._id);
      onDeleteSuccess();
      onClose();
      
    } catch (error) {
      console.error('Error deleting resident:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-resident-dialog-title"
      aria-describedby="delete-resident-dialog-description"
    >
      <DialogTitle id="delete-resident-dialog-title">
        Confirm Deletion
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-resident-dialog-description">
          Are you sure you want to delete resident {resident?.first_name} {resident?.last_name}? 
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="error" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}