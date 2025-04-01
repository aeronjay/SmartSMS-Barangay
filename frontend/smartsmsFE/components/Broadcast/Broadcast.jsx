import '../../styles/Broadcast.css'

import { useState } from 'react'
import SettingsCard from './settingCard'
import AnnouncementOptions from './announcementOptions'
import Receipients from './Receipients'
import MainTemplate from '../MainTemplate'

export default function Broadcast() {


    // broadcast Type Setting
    const [selectedValue, setSelectedValue] = useState("local");
    const broadcastTypes = ["Local", "Gift Giving", "Medicine", "Garbage Collection"]
    const setBroadcastOnChange = (e) => {
        setSelectedValue(e.target.value)
    }

    // announcement area
    const [announcement, setAnnouncement] = useState('');
    const handleAnnouncementInputChange = (event) => {
        setAnnouncement(event.target.value);
    };
    const handlePublish = () => {
        alert('Announcement published:\n' + announcement);
    };


    return (
        <>
            <MainTemplate headerName={"Broadcast"} cardHeader={"Create New Announcement"}>
                <div className='main-content-section'>
                    <AnnouncementOptions broadcastTypes={broadcastTypes} />
                    <Receipients />
                    <div className='broadcast-main'>

                    </div>
                </div>
            </MainTemplate>
        </>
    )
}