import CustomSidebar from "../ components/Sidebar";

function AdminDashboard() {

    return(
        <div style={{
            display: 'flex',
            width: '100vw',
            height: '100vh',
            background: '#eee'
        }}>
            <CustomSidebar></CustomSidebar>
        </div>
        
    )
}

export default AdminDashboard;