import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Home, Schedule, Announcement, People, AdminPanelSettings } from "@mui/icons-material";
import { FaBirthdayCake, FaTrash, FaGift, FaHistory, FaTv, FaExclamationTriangle } from "react-icons/fa";
import { IoPeopleCircleSharp, IoMegaphoneOutline, IoChatboxEllipses } from "react-icons/io5";
import {  Navigate  } from 'react-router-dom'
import '../../styles/Sidebar.css'


export default function CustomSidebar() {
    return (
      <div className="sidebar-container">
        <div className="sidebar-header">
          {/* <Image src="/logo.png" alt="Logo" width={50} height={50} className="logo" /> */}
          SMART SMS BARANGAY
        </div>
        <Sidebar 
          collapsedWidth="80px" 
          width="270px" 
          backgroundColor="rgba(249, 249, 249, 0.7)" 
          className="custom-sidebar"
        >
          <Menu>
            <SubMenu defaultOpen label='Announcements' icon={<Announcement />}>
              <MenuItem icon={<IoMegaphoneOutline />}>Broadcast</MenuItem>
              <MenuItem icon={<FaHistory />}>History</MenuItem>
            </SubMenu>
            <MenuItem icon={<IoChatboxEllipses />}>Chats</MenuItem>
            <SubMenu defaultOpen label='Scheduling' icon={<Schedule />}>
              <MenuItem icon={<FaTv />}>CCTV</MenuItem>
              <MenuItem icon={<FaExclamationTriangle />}>Complaint</MenuItem>
            </SubMenu>
            <MenuItem icon={<People />}>Residents</MenuItem>
            <SubMenu label='Accounts' icon={<AdminPanelSettings />}>
              <MenuItem>Admin Accounts</MenuItem>
              <MenuItem>Residents Accounts</MenuItem>
            </SubMenu>

          </Menu>
        </Sidebar>
        <div className="sidebar-footer">
          <button className="logout-btn">Logout</button>
          <p className="copyright">&copy; 2025 Aeron Jay Bulatao</p>
        </div>
      </div>
    );
}
  