import '../../styles/adminLocal.css'
import {  useState  } from 'react'
import SettingsCard from './settingCard'

export default function Local(){


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


    return(
        <>
            <div className='main'>
                <div className='main-header'>
                    <h2>BROADCAST</h2>
                </div>
                <div className='main-content'>
                    <div className='broadcast-settings'>
                        <div className='broadcast-settings-content'>
                            <SettingsCard label="Broadcast Type" optionValues={broadcastTypes} setOnChange={setBroadcastOnChange} selectedValue={selectedValue}/>
                            <SettingsCard label="Device"/>
                            <SettingsCard label="Template"/>
                            <SettingsCard label="Recipients"/>
                        </div>
                    </div>
                    <div className='broadcast'>
                        <div className='broadcast-main'>
                            <h1>Create Announcement</h1>
                            <textarea
                                id="announcement-text"
                                value={announcement}
                                onChange={handleAnnouncementInputChange}
                                placeholder="Enter your announcement here..."
                            ></textarea>
                            <button id="publish-button" onClick={handlePublish}>
                                Send Announcement
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

