import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CampaignIcon from '@mui/icons-material/Campaign';
import { useState } from 'react';

export default function SendMessage({ selectedResidentsNumber = [] }) {

    const [message, setMessage] = useState("")

    const handleBroadcast = () => {
        alert("SENDING BROADCAST TO NUMNBERS")
        console.log(selectedResidentsNumber)
    }

    return (
        <div className='broadcast-main'>
            <div className="section-headder">
                <h6>Compose Message</h6>
                <div className="message-length-display">{message.length}/160 characters</div>
            </div>
            <textarea name="broadcast-message" id="broadcast-message" placeholder="Type Your Announcement Here..." value={message} onChange={(e) => setMessage(e.target.value)} maxLength={160}>
            </textarea>
            <div className="receipients-selected-number">
                <PeopleAltIcon></PeopleAltIcon>
                <div>{selectedResidentsNumber.length} Receipients Selected</div>
            </div>
            <div className='send-announcement-button' style={{ cursor: "pointer" }} onClick={() => handleBroadcast()}>
                <CampaignIcon />
                <div>Send Announcement</div>
            </div>
        </div>
    )
}