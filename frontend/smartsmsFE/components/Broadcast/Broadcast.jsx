import '../../styles/Broadcast.css'

import { useState, useEffect } from 'react'
import SettingsCard from './settingCard'
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


    const receipients = [
        { id: 1, name: "Juan Dela Cruz", street: "st mary", age: 65, priority: true, checked: true },
        { id: 2, name: "Maria Santos", street: "st lukes", age: 25, priority: true, checked: false },
        { id: 3, name: "Pedro Reyes", street: "street 142", age: 42, priority: true, checked: true },
        { id: 4, name: "Ana Gonzales", street: "street 142", age: 18, checked: false },
        { id: 5, name: "Roberto Lim", street: "street 142", age: 70, checked: true },
        { id: 6, name: "Elena Cruz", street: "street 142", age: 35, priority: true, checked: false },
        { id: 7, name: "Jose Garcia", street: "street 142", age: 28, checked: true },
        { id: 9, name: "Carmen Reyes", street: "street 142", age: 68, checked: false },
        { id: 10, name: "Carmen Reyes", street: "street 142", age: 68, checked: false },
        { id: 11, name: "Carmen Reyes", street: "street 142", age: 68, checked: false },
        { id: 12, name: "Carmen Reyes", street: "street 142", age: 68, checked: false },
        { id: 13, name: "Carmen Reyes", street: "street 142", age: 68, checked: false },
    ];

    const [allResidents, setallResidents] = useState([])

    useEffect(() => {
        const fetchResidents = async () => {
            try {
                const response = await residentService.getResidents();

                const mappedResidents = response.data.map((resident) => ({
                    id: resident._id, // Include MongoDB document ID
                    name: `${resident.first_name} ${resident.middle_name ? resident.middle_name + ' ' : ''}${resident.last_name} ${resident.suffix || ''}`.trim(),
                    age: resident.age,
                    street: resident.address.street,
                    phone: resident.contact.phone,
                    checked: false
                }));

                console.log('Fetched residents:', mappedResidents);
                setallResidents(mappedResidents); // Ensure to access `data`
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
                    
                    <SendMessage />
                </div>
            </MainTemplate>
        </>
    )
}