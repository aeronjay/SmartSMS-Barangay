import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CampaignIcon from '@mui/icons-material/Campaign';
import { useState } from 'react';
import service from '../../services/service';

export default function SendMessage({ selectedResidentsNumber = [] }) {

    const [message, setMessage] = useState("")

    const handleBroadcast = async () => {
        if (!message.trim()) {
            alert("Message cannot be empty!");
            return;
        }

        if (selectedResidentsNumber.length === 0) {
            alert("No recipients selected!");
            return;
        }

        try {
            // Call the sendSms function from the service layer
            const response = await service.sendSms(selectedResidentsNumber, message, "Admin");

            // Handle success
            alert("Broadcast sent successfully!");
        } catch (error) {
            // Handle errors
            console.error("Error sending broadcast:", error);
            alert("Failed to send broadcast. Please try again.");
        }
    };

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