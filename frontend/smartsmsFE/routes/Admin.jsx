import { Routes, Route, Navigate } from "react-router-dom";

import CustomSidebar from "../components/sidebar/Sidebar";
import Broadcast from '../components/Broadcast/Broadcast'
import Dashboard from '../components/Dashboard/Dashboard';
import BroadcastHistory from '../components/BroadcastHistory/BroadcastHistory';
import DocumentRequest from '../components/DocumentRequest/DocumentRequest';
import RequestHistory from '../components/RequestHistory/RequestHistory';
import Residents from '../components/Residents/Residents';
import AdminAccounts from '../components/AdminAccounts/AdminAccounts';
import AdminHistory from '../components/AdminAccounts/AdminHistory';

function AdminDashboard() {
    return(
        <div style={{
            display: 'flex',
            width: '100vw',
            height: '100vh',
            background: '#eee',
            overflow: 'hidden'
        }}>
            <CustomSidebar />
            <div style={{flex: '1', background: '#eee'}}>
                <Routes>
                    <Route path="/" element={<Navigate to="dashboard" />} />
                    <Route path="dashboard" element={<Dashboard />}/>
                    <Route path="announcements" element={<Broadcast />}/>
                    <Route path="broadcast-history" element={<BroadcastHistory />}/>
                    <Route path="document-request" element={<DocumentRequest />}/>
                    <Route path="request-history" element={<RequestHistory />}/>
                    <Route path="residents" element={<Residents />}/>
                    <Route path="admin-accounts" element={<AdminAccounts />}/>
                    <Route path="admin-history" element={<AdminHistory />}/>
                </Routes>
            </div>
        </div>
    )
}

export default AdminDashboard;
