import { useContext } from 'react'
import MainTemplate from '../MainTemplate'
import AuthContext from '../../context/AuthContext'
import { jwtDecode } from 'jwt-decode'

export default function AdminAccounts() {
    const { user } = useContext(AuthContext)
    let role = null
    if (user) {
        try {
            const decoded = jwtDecode(user)
            role = decoded.role
        } catch (e) {
            role = null
        }
    }
    if (role !== 'superadmin') return null // or return <div>Access denied</div>
    return (
        <>
            <MainTemplate headerName={"AdminAccounts"} cardHeader={"AdminAccounts"}>
                <div>Admin management UI here (visible only to superadmin)</div>
            </MainTemplate>
        </>
    )
}