import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Home, Schedule, Announcement, People, AdminPanelSettings } from "@mui/icons-material";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { FaBirthdayCake, FaTrash, FaGift, FaHistory, FaTv, FaExclamationTriangle } from "react-icons/fa";
import { IoPeopleCircleSharp, IoMegaphoneOutline, IoChatboxEllipses } from "react-icons/io5";
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import '../../styles/Sidebar.css'

export default function CustomSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('');
  const { user, logout } = useContext(AuthContext);
  let role = null;
  if (user) {
    try {
      const decoded = jwtDecode(user);
      role = decoded.role;
    } catch (e) {
      role = null;
    }
  }

  const menuItems = [
    { path: 'dashboard', icon: <Home />, label: 'Dashboard' },
    { path: 'announcements', icon: <IoMegaphoneOutline />, label: 'Broadcast' },
    { path: 'broadcast-history', icon: <FaHistory />, label: 'Broadcast History' },
    { path: 'document-request', icon: <ReceiptLongIcon />, label: 'Document Request' },
    { path: 'request-history', icon: <FaHistory />, label: 'Request History' },
    { path: 'residents', icon: <IoPeopleCircleSharp />, label: 'Residents' },
    // Only show Admin Accounts if superadmin
    ...(role === 'superadmin' ? [{ path: 'admin-accounts', icon: <AdminPanelSettings />, label: 'Admin Accounts' }] : [])
  ];

  useEffect(() => {
    // Extract the current path from location
    const path = location.pathname.split('/').pop();
    setActivePage(path || 'dashboard');
  }, [location]);

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate('/'); // Redirect to login page after logout
  };

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
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
        <p className="copyright">&copy; Made By Group ABBNL</p>
      </div>
    </div>
  );
}