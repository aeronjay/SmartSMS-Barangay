import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';

export default function CustomSidebar(){

    return(
        <>
            <Sidebar>
                <Menu>
                    <SubMenu label='Announcements'>
                        <MenuItem>Local</MenuItem>
                        <MenuItem>Gift Giving</MenuItem>
                        <MenuItem>Medicine</MenuItem>
                        <MenuItem>Garbage Collection</MenuItem>
                        <MenuItem>Promotion</MenuItem>
                        <MenuItem>Birthday</MenuItem>
                    </SubMenu>
                    <SubMenu label='Scheduling'>
                        <MenuItem>CCTV</MenuItem>
                        <MenuItem>Complaint</MenuItem>
                    </SubMenu>
                    <MenuItem>Residents</MenuItem>
                    <SubMenu label='Accounts'>
                        <MenuItem>Admin Accounts</MenuItem>
                        <MenuItem>Residents Accounts</MenuItem>
                    </SubMenu>
                    
                </Menu>
            </Sidebar>
        </>
    )
}