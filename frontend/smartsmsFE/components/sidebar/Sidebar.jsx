import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Home, Schedule, Announcement, People, AdminPanelSettings } from "@mui/icons-material";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { FaBirthdayCake, FaTrash, FaGift, FaHistory, FaTv, FaExclamationTriangle } from "react-icons/fa";
import { IoPeopleCircleSharp, IoMegaphoneOutline, IoChatboxEllipses } from "react-icons/io5";
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../../styles/Sidebar.css'

export default function CustomSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('');
  
  useEffect(() => {
    // Extract the current path from location
    const path = location.pathname.split('/').pop();
    setActivePage(path || 'dashboard');
  }, [location]);

  const menuItems = [
    { path: 'dashboard', icon: <Home />, label: 'Dashboard' },
    { path: 'announcements', icon: <IoMegaphoneOutline />, label: 'Broadcast' },
    { path: 'broadcast-history', icon: <FaHistory />, label: 'Broadcast History' },
    { path: 'document-request', icon: <ReceiptLongIcon />, label: 'Document Request' },
    { path: 'request-history', icon: <FaHistory />, label: 'Request History' },
    { path: 'residents', icon: <IoPeopleCircleSharp />, label: 'Residents' },
    { path: 'admin-accounts', icon: <AdminPanelSettings />, label: 'Admin Accounts' }
  ];

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        SMART SMS BARANGAY
      </div>
      <div className='Menu'>
        {menuItems.map((item) => (
          <div 
            key={item.path}
            className={`menu-item ${activePage === item.path ? 'active' : ''}`}
            onClick={() => {
              // This is the key change - navigate to the new path
              navigate(`/admin/${item.path}`);
            }}
          >
            {item.icon} {item.label}
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <button className="logout-btn">Logout</button>
        <p className="copyright">&copy; 2025 Aeron Jay Bulatao</p>
      </div>
    </div>
  );
}