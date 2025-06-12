import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Chip,
  Typography,
  Box,
  Dialog
} from '@mui/material';
import { Edit, Add, Visibility, Delete, Print } from '@mui/icons-material';
import { MdFamilyRestroom } from "react-icons/md";
import CreateHouseholdModal from './CreateHouseholdModal_v2';
import EditHouseholdModal from './EditHouseholdModal';
import DeleteHouseholdModal from './DeleteHouseholdModal';
import service from '../../services/service';
import { printHouseholdForm } from '../../src/utils/householdPrintUtils';
import '../../styles/resident.css';

const Households = () => {
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);  const [selectedHousehold, setSelectedHousehold] = useState(null);
  const [error, setError] = useState('');
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    fetchHouseholds();
  }, []);    const fetchHouseholds = async () => {
        try {
            setLoading(true);
            console.log('Fetching households...'); // Debug log
            const response = await service.getHouseholds();
            console.log('Households response:', response); // Debug log
            setHouseholds(response || []); // Handle undefined response
            setError('');
        } catch (err) {
            console.error('Error fetching households:', err);
            setError(`Failed to fetch households: ${err.message}`);
            setHouseholds([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

  const handleCreateHousehold = () => {
    setCreateModalOpen(true);
  };  const handleEditHousehold = async (householdId) => {
    try {
      const response = await service.getHousehold(householdId);
      setSelectedHousehold(response || null);
      setEditModalOpen(true);
    } catch (error) {
      console.error('Error fetching household details:', error);
    }
  };  const handleDeleteHousehold = (household) => {
    setSelectedHousehold(household);
    setDeleteModalOpen(true);
  };
  const handlePrintHousehold = async (householdId) => {
    try {
      setIsPrinting(true);
      setError('');
      
      // Fetch detailed household data with all members
      const householdData = await service.getHouseholdForPrint(householdId);
      
      // Use the simple print function (opens in new window)
      printHouseholdForm(householdData);
      
      // Alternative: Generate PDF download
      // await generateHouseholdRegistryForm(householdData);
      
    } catch (error) {
      console.error('Error printing household:', error);
      setError(`Failed to print household: ${error.message}`);
    } finally {
      setIsPrinting(false);
    }
  };

  const handleCloseModals = () => {
    setCreateModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedHousehold(null);
  };

  const handleHouseholdCreated = () => {
    fetchHouseholds();
    handleCloseModals();
  };

  const handleHouseholdUpdated = () => {
    fetchHouseholds();
    handleCloseModals();
  };

  const handleHouseholdDeleted = () => {
    fetchHouseholds();
    handleCloseModals();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
      if (loading) {
    return (
      <div className="resident-container">
        <div className="loading">Loading households...</div>
      </div>
    );
  }

  if (isPrinting) {
    return (
      <div className="resident-container">
        <div className="loading">Preparing household registry form for printing...</div>
      </div>
    );
  }

  return (
    <div className="resident-container">
      <div className="resident-header">
        <div className="header-left">
          <MdFamilyRestroom className="header-icon" />
          <div>
            <h1>Household Management</h1>
            <p>Manage households and their inhabitants</p>
          </div>
        </div>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateHousehold}
          className="add-resident-btn"
          sx={{ 
            backgroundColor: '#1976d2',
            '&:hover': { backgroundColor: '#1565c0' }
          }}
        >
          Create New Household        </Button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}      <TableContainer component={Paper} className="resident-table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Household ID</strong></TableCell>
              <TableCell><strong>Head Member</strong></TableCell>
              <TableCell><strong>No. of Members</strong></TableCell>
              <TableCell><strong>Household Address</strong></TableCell>
              <TableCell><strong>Date Created</strong></TableCell>
              <TableCell><strong>Created By</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!households || households.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" color="text.secondary">
                    No households found. Create your first household to get started.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              households.map((household) => (
                <TableRow key={household._id}>
                  <TableCell>
                    <Chip 
                      label={household.householdId} 
                      color="primary" 
                      variant="outlined" 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {household.headMemberId ? 
                          `${household.headMemberId.first_name} ${household.headMemberId.middle_name || ''} ${household.headMemberId.last_name}`.trim()
                          : 'No head assigned'
                        }
                      </Typography>
                      <Chip 
                        label="HOUSEHOLD HEAD" 
                        size="small" 
                        color="success"
                        sx={{ fontSize: '0.7rem', height: '20px' }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={`${household.memberCount} member${household.memberCount !== 1 ? 's' : ''}`}
                      color="info"
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {household.householdAddress}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {household.barangay}, {household.cityMunicipality}
                    </Typography>                  </TableCell>
                  <TableCell>{formatDate(household.dateCreated)}</TableCell>
                  <TableCell>
                    {household.createdBy?.fullname || household.createdBy?.username || 'Unknown'}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEditHousehold(household._id)}
                      color="primary"
                      size="small"
                      title="Edit Household"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handlePrintHousehold(household._id)}
                      color="success"
                      size="small"
                      title="Print Household Registry Form"
                      disabled={isPrinting}
                    >
                      <Print />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteHousehold(household)}
                      color="error"
                      size="small"
                      title="Delete Household"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Household Modal */}
      <CreateHouseholdModal
        open={createModalOpen}
        onClose={handleCloseModals}
        onHouseholdCreated={handleHouseholdCreated}
      />

      {/* Edit Household Modal */}
      {selectedHousehold && (
        <EditHouseholdModal
          open={editModalOpen}
          onClose={handleCloseModals}
          onHouseholdUpdated={handleHouseholdUpdated}
          householdData={selectedHousehold}
        />
      )}      {/* Delete Household Modal */}
      <DeleteHouseholdModal
        open={deleteModalOpen}
        onClose={handleCloseModals}
        onDeleteSuccess={handleHouseholdDeleted}
        household={selectedHousehold}
      />
    </div>
  );
};

export default Households;
