import { useState, useEffect } from 'react'
import MainTemplate from '../MainTemplate'
import '../../styles/resident.css'
import SearchInput from '../SearchInput'
import service from '../../services/service'
import AddResidentModal from './AddResidentModal'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import DeleteResidentModal from './DeleteResidentModal'
import EditResidentModal from './EditResidentModal';

export default function Residents() {

    const [search, setSearch] = useState('')

    const [allResidents, setallResidents] = useState([])

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOpenDialog = () => setIsDialogOpen(true);
    const handleCloseDialog = () => setIsDialogOpen(false);

    const openDialog = () => {
        handleOpenDialog()
    }
    // deletion of resident 
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedResident, setSelectedResident] = useState(null);

    const handleOpenDeleteDialog = (resident) => {
        setSelectedResident(resident);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setSelectedResident(null);
    };

    const handleDeleteSuccess = () => {
        const fetchResidents = async () => {
            try {
                const response = await service.getResidents();
                setallResidents(response.data);
            } catch (err) {
                console.error('Error fetching residents:', err);
            }
        };
        fetchResidents();
        alert(`Successfully Deleted Resident`)
    };

    // edit resident
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const handleOpenEditDialog = (resident) => {
        setSelectedResident(resident);
        setEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setEditDialogOpen(false);
        setSelectedResident(null);
    };
    useEffect(() => {
        const fetchResidents = async () => {
            try {
                const response = await service.getResidents();

                setallResidents(response.data);
            } catch (err) {
                console.error('Error fetching residents:', err);
            }
        };

        fetchResidents();
    }, [])

    return (
        <>
            <MainTemplate headerName={"Residents"} cardHeader={"Resident Management"}>
                <div className='main-section'>
                    <ResidentOptions search={search} setSearch={setSearch} handleOpenDialog={handleOpenDialog} />
                    <ResidentsTable
                        residents={allResidents}
                        search={search}
                        onDeleteClick={handleOpenDeleteDialog}
                        onEditClick={handleOpenEditDialog}
                    />
                </div>
                <AddResidentModal open={isDialogOpen} onClose={handleCloseDialog} />
                <DeleteResidentModal
                    open={deleteDialogOpen}
                    onClose={handleCloseDeleteDialog}
                    resident={selectedResident}
                    onDeleteSuccess={handleDeleteSuccess}
                />
                <EditResidentModal
                    open={editDialogOpen}
                    onClose={handleCloseEditDialog}
                    resident={selectedResident}
                />
            </MainTemplate>
        </>
    )
}
const ResidentOptions = ({ search, setSearch, handleOpenDialog }) => {
    return (
        <div className='resident-options'>
            <div>
                <SearchInput search={search} setSearch={setSearch} />
            </div>
            <Button onClick={handleOpenDialog} variant="contained" startIcon={<AddIcon />}>
                Add New Resident
            </Button>
        </div>
    )
}

const ResidentsTable = ({ residents, search, onDeleteClick, onEditClick }) => {
    return (
        <div className='residents'>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Contact Number</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Household ID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {displayResidents(residents, search, onDeleteClick, onEditClick)}
                </tbody>
            </table>
        </div>
    )
}
const displayResidents = (recipients, search, onDeleteClick, onEditClick) => {
    const filteredResidents = search !== ""
        ? recipients.filter(person => {
            const fullName = `${person.first_name} ${person.middle_name || ''} ${person.last_name}`.toLowerCase();
            return fullName.includes(search.toLowerCase());
        })
        : recipients;    return filteredResidents.map(resident => (
        <tr key={resident._id}>
            <td>{resident.first_name} {resident.middle_name} {resident.last_name}</td>
            <td>{resident.contact.phone}</td>
            <td>{resident.contact.email}</td>
            <td>{resident.address.street}</td>
            <td>{resident.householdId?.householdId || "Unassigned"}</td>
            <td className='Actions'>
                <IconButton
                    aria-label='Edit-Icon'
                    className='Icon'
                    size="small"
                    color="primary"
                    onClick={() => onEditClick(resident)}
                >
                    <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                    aria-label='Delete-Icon'
                    className='Icon'
                    size="small"
                    color="error"
                    onClick={() => onDeleteClick(resident)}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </td>
        </tr>
    ));
};