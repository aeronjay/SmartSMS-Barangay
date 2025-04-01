import '../../styles/adminLocal.css'
import {  useState  } from 'react'
import SettingsCard from './settingCard'
import AnnouncementOptions from './announcementOptions'
import Receipients from './Receipients'

export default function Local({  children, headerName, cardHeader  }){

    return(
        <>
            <div className='main'>
                <div className='main-header'>
                    <h2>{headerName}</h2>
                </div>
                <div className='main-content'>
                    <div className='main-content-card'>
                        <div className='main-content-announcement-title'>
                            {cardHeader}
                        </div>
                        <div className='main-content-section'>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

