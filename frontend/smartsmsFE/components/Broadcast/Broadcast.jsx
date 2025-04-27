import '../../styles/Broadcast.css'

import { useState, useEffect, useMemo } from 'react'
import AnnouncementOptions from './announcementOptions'
import Receipients from './Receipients'
import SendMessage from './SendMessage'
import MainTemplate from '../MainTemplate'
import residentService from '../../services/service'

export default function Broadcast() {

    // broadcast Type
    const [broadcastValue, setBroadcastValue] = useState("");
    const broadcastTypes = ["Local", "Gift Giving", "Medicine", "Garbage Collection"]
    const setBroadcastOnChange = (e) => {
        setBroadcastValue(e.target.value)
    }

    // announcement area
    const [announcement, setAnnouncement] = useState('');
    const handleAnnouncementInputChange = (event) => {
        setAnnouncement(event.target.value);
    };

    const [allResidents, setallResidents] = useState([])

    useEffect(() => {
        const fetchResidents = async () => {
            try {
                const response = await residentService.getResidents();

                const mappedResidents = response.data.map((resident) => ({
                    id: resident._id,
                    name: `${resident.first_name} ${resident.middle_name ? resident.middle_name + ' ' : ''}${resident.last_name} ${resident.suffix || ''}`.trim(),
                    age: resident.age,
                    gender: resident.gender,
                    marital_status: resident.marital_status,
                    street: resident.address.street,
                    phone: resident.contact.phone,
                    highest_education: resident.education?.highest_education,
                    resident_type: resident.registration?.resident_type,
                    medical_conditions: resident.medical_info?.medical_conditions || [],
                    checked: false
                }));

                setallResidents(mappedResidents);
            } catch (err) {
                console.error('Error fetching residents:', err);
            }
        };

        fetchResidents();
    }, [])
    const [filters, setFilters] = useState({
        minAge: "",
        maxAge: "",
        gender: "",
        marital_status: "",
        street: "",
        highest_education: "",
        resident_type: "",
        medical_condition: "",
    });

    // FILTER LOGIC
    const filteredResidents = useMemo(() => {
        return allResidents.filter(resident => {
            // Age filter
            if (filters.minAge && resident.age < Number(filters.minAge)) return false;
            if (filters.maxAge && resident.age > Number(filters.maxAge)) return false;
            // Gender
            if (filters.gender && resident.gender !== filters.gender) return false;
            // Marital Status
            if (filters.marital_status && resident.marital_status !== filters.marital_status) return false;
            // Street
            if (
                filters.address &&
                !(
                  (resident.house_number && resident.house_number.toLowerCase().includes(filters.address.toLowerCase())) ||
                  (resident.street && resident.street.toLowerCase().includes(filters.address.toLowerCase()))
                )
              ) {
                return false;
              }
            // Education
            if (filters.highest_education && resident.highest_education !== filters.highest_education) return false;
            // Resident Type
            if (filters.resident_type && resident.resident_type !== filters.resident_type) return false;
            // Medical Condition
            if (filters.medical_condition && !(resident.medical_conditions || []).includes(filters.medical_condition)) return false;
            return true;
        });
    }, [allResidents, filters]);

    const [selectedResidentsNumber, setselectedResidentsNumber] = useState([])

    return (
        <>
            <MainTemplate headerName={"Broadcast"} cardHeader={"Create New Announcement"}>
                <div className='main-content-section'>
                    <AnnouncementOptions
                        broadcastTypes={broadcastTypes}
                        broadcastValue={broadcastValue}
                        setBroadcastOnChange={setBroadcastOnChange}
                        allResidents={allResidents}
                        filters={filters}
                        setFilters={setFilters}
                    />

                    <Receipients
                        receipients={filteredResidents}
                        selectedResidentsNumber={selectedResidentsNumber}
                        setselectedResidentsNumber={setselectedResidentsNumber}
                    />

                    <SendMessage selectedResidentsNumber={selectedResidentsNumber} broadcastType={broadcastValue} />
                </div>
            </MainTemplate>
        </>
    )
}