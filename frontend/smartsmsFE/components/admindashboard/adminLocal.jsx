import '../../styles/adminLocal.css'
import {  useState  } from 'react'
import SettingsCard from './settingCard'

export default function Local(){

    const [selectedValue, setSelectedValue] = useState("local");
    const broadcastTypes = ["Local", "Gift Giving", "Medicine", "Garbage Collection"]
    const setBroadcastOnChange = (e) => {
        setSelectedValue(e.target.value)
    }


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
                            <SettingsCard label="Template"/>
                            <SettingsCard label="Recipients"/>
                        </div>
                    </div>
                    <div className='broadcast'>
                        <div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

