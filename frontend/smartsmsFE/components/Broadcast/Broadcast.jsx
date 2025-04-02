import '../../styles/Broadcast.css'

import { useState, useEffect } from 'react'
import SettingsCard from './settingCard'
import AnnouncementOptions from './announcementOptions'
import Receipients from './Receipients'
import SendMessage from './SendMessage'
import MainTemplate from '../MainTemplate'


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

    return (
        <>
            <MainTemplate headerName={"Broadcast"} cardHeader={"Create New Announcement"}>
                <div className='main-content-section'>
                    <AnnouncementOptions broadcastTypes={broadcastTypes} broadcastValue={broadcastValue} setBroadcastOnChange={setBroadcastOnChange}/>
                    <Receipients />
                    <SendMessage /> 
                </div>
            </MainTemplate>
        </>
    )
}