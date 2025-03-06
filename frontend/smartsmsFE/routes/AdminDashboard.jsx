import CustomSidebar from "../components/Sidebar";
import Local from './adminroutes/adminLocal'
import { Routes, Route, Navigate } from "react-router-dom";

function AdminDashboard() {

    return(
        <div style={{
            display: 'flex',
            width: '100vw',
            height: '100vh',
            background: '#eee'
        }}>
            <CustomSidebar />
            <div style={{flex: '1', background: '#eee'}}>
                <Routes>
                    <Route path="/" element={<Navigate to="announcements" />} />
                    <Route path="announcements" element={<Local />}/>
                </Routes>
            </div>
        </div>
        
    )
}

export default AdminDashboard;