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


export default function Residents() {

    const [search, setSearch] = useState('')

    const [allResidents, setallResidents] = useState([])

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOpenDialog = () => setIsDialogOpen(true);
    const handleCloseDialog = () => setIsDialogOpen(false);

    const openDialog = () => {
        handleOpenDialog()
    }

    const tryResidents = [
        { first_name: "asd", last_name: "asd", middle_name: "asd", contact: { phone: "1231", email: "asdasd@gam" }, registration: { status: "active" }, address: { street: "asdas" } },
        { first_name: "asd", last_name: "asd", middle_name: "asd", contact: { phone: "1231", email: "asdasd@gam" }, registration: { status: "active" }, address: { street: "asdas" } },
        { first_name: "asd", last_name: "asd", middle_name: "asd", contact: { phone: "1231", email: "asdasd@gam" }, registration: { status: "active" }, address: { street: "asdas" } },
        { first_name: "asd", last_name: "asd", middle_name: "asd", contact: { phone: "1231", email: "asdasd@gam" }, registration: { status: "active" }, address: { street: "asdas" } },
        { first_name: "asd", last_name: "asd", middle_name: "asd", contact: { phone: "1231", email: "asdasd@gam" }, registration: { status: "active" }, address: { street: "asdas" } },
        { first_name: "asd", last_name: "asd", middle_name: "asd", contact: { phone: "1231", email: "asdasd@gam" }, registration: { status: "active" }, address: { street: "asdas" } },
        { first_name: "asd", last_name: "asd", middle_name: "asd", contact: { phone: "1231", email: "asdasd@gam" }, registration: { status: "active" }, address: { street: "asdas" } },
        { first_name: "asd", last_name: "asd", middle_name: "asd", contact: { phone: "1231", email: "asdasd@gam" }, registration: { status: "active" }, address: { street: "asdas" } },
        { first_name: "asd", last_name: "asd", middle_name: "asd", contact: { phone: "1231", email: "asdasd@gam" }, registration: { status: "active" }, address: { street: "asdas" } },
    ]

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
                    <ResidentsTable residents={allResidents} search={search} />
                </div>
                <AddResidentModal open={isDialogOpen} onClose={handleCloseDialog} />
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

const ResidentsTable = ({ residents, search }) => {
    return (
        <div className='residents'>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Contact Number</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {displayResidents(residents, search)}
                </tbody>
            </table>
        </div>
    )
}
const displayResidents = (receipients, search,) => {
    // If search is not empty, filter residents whose name includes the search term
    const filteredResidents = search !== ""
        ? receipients.filter(person => {
            const fullName = `${person.first_name} ${person.middle_name || ''} ${person.last_name}`.toLowerCase();
            return fullName.includes(search.toLowerCase());
        })
        : receipients;

    // Map the filtered residents to components
    return filteredResidents.map(resident => (
        <tr key={resident._id}>
            <td>{resident.first_name} {resident.middle_name} {resident.last_name}</td>
            <td>{resident.contact.phone}</td>
            <td>{resident.contact.email}</td>
            <td>{resident.address.street}</td>
            <td>{resident.registration.status}</td>
            <td className='Actions'>
                <IconButton aria-label='Edit-Icon' className='Icon' size="small" color="primary">
                    <EditIcon fontSize="small" />
                </IconButton>
                <IconButton aria-label='Delete-Icon' className='Icon' size="small" color="error">
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </td>
        </tr>
    ));
};