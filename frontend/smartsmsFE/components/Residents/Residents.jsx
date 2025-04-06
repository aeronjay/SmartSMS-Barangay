import { useState, useEffect } from 'react'
import MainTemplate from '../MainTemplate'
import '../../styles/resident.css'
import SearchInput from '../SearchInput'
import service from '../../services/service'

export default function Residents() {

    const [search, setSearch] = useState('')

    const [allResidents, setallResidents] = useState([])

    const tryResidents = [
        {first_name: "asd", last_name: "asd", middle_name: "asd", contact: {phone: "1231", email: "asdasd@gam"}, registration: {status: "active"}, address: {street: "asdas"}},
        {first_name: "asd", last_name: "asd", middle_name: "asd", contact: {phone: "1231", email: "asdasd@gam"}, registration: {status: "active"}, address: {street: "asdas"}},
        {first_name: "asd", last_name: "asd", middle_name: "asd", contact: {phone: "1231", email: "asdasd@gam"}, registration: {status: "active"}, address: {street: "asdas"}},
        {first_name: "asd", last_name: "asd", middle_name: "asd", contact: {phone: "1231", email: "asdasd@gam"}, registration: {status: "active"}, address: {street: "asdas"}},
        {first_name: "asd", last_name: "asd", middle_name: "asd", contact: {phone: "1231", email: "asdasd@gam"}, registration: {status: "active"}, address: {street: "asdas"}},
        {first_name: "asd", last_name: "asd", middle_name: "asd", contact: {phone: "1231", email: "asdasd@gam"}, registration: {status: "active"}, address: {street: "asdas"}},
        {first_name: "asd", last_name: "asd", middle_name: "asd", contact: {phone: "1231", email: "asdasd@gam"}, registration: {status: "active"}, address: {street: "asdas"}},
        {first_name: "asd", last_name: "asd", middle_name: "asd", contact: {phone: "1231", email: "asdasd@gam"}, registration: {status: "active"}, address: {street: "asdas"}},
        {first_name: "asd", last_name: "asd", middle_name: "asd", contact: {phone: "1231", email: "asdasd@gam"}, registration: {status: "active"}, address: {street: "asdas"}},
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
                    <ResidentOptions search={search} setSearch={setSearch}/>
                    <ResidentsTable residents={tryResidents} search={search}/>
                </div>
            </MainTemplate>
        </>
    )
}
const ResidentOptions = ({  search, setSearch  }) => {
    return (
        <div className='resident-options'>
            <div>
                <SearchInput search={search} setSearch={setSearch} />
            </div>
            <button>+ Add New Resident</button>
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
                <td>✎  🗑</td>
            </tr>
    ));
  };