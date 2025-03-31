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
                    <div className='main-content-card'>
                        <div className='main-content-announcement-title'>
                            Create New Announcement
                        </div>
                        <div className='main-content-section'>
                            <div className='broadcast-category'>

                            </div>
                            <div className='broadcast-recipients'>

                            </div>
                            <div className='broadcast-main'>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

