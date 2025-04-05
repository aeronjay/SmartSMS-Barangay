import '../../styles/Broadcast.css'

import { useState, useEffect } from 'react'
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
                    street: resident.address.street,
                    phone: resident.contact.phone,
                    checked: false
                }));

                console.log('Fetched residents:', mappedResidents);
                setallResidents(mappedResidents); 
            } catch (err) {
                console.error('Error fetching residents:', err);
            }
        };

        fetchResidents();
    }, [])

    const [selectedResidentsNumber, setselectedResidentsNumber] = useState([])

    return (
        <>
            <MainTemplate headerName={"Broadcast"} cardHeader={"Create New Announcement"}>
                <div className='main-content-section'>
                    <AnnouncementOptions 
                        broadcastTypes={broadcastTypes}
                        broadcastValue={broadcastValue}
                        setBroadcastOnChange={setBroadcastOnChange} />
                    
                    <Receipients 
                        receipients={allResidents}
                        selectedResidentsNumber={selectedResidentsNumber}
                        setselectedResidentsNumber={setselectedResidentsNumber} />
                    
                    <SendMessage selectedResidentsNumber={selectedResidentsNumber} />
                </div>
            </MainTemplate>
        </>
    )
}