import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CampaignIcon from '@mui/icons-material/Campaign';

export default function SendMessage() {

    return (
        <div className='broadcast-main'>
            <div className="section-headder">
                <h6>Compose Message</h6>
                <div className="message-length-display">0/160 characters</div>
            </div>
            <textarea name="broadcast-message" id="broadcast-message" placeholder="Type Your Announcement Here...">

            </textarea>
            <div className="receipients-selected-number">
                <PeopleAltIcon></PeopleAltIcon>
                <div>0 Receipients Selected</div>                
            </div>
            <div className='send-announcement-button'>
                <CampaignIcon />
                <div>Send Announcement</div>
            </div>
        </div>
    )
}