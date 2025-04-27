import { useState, useEffect } from 'react'
import service from '../../services/service';
import MainTemplate from '../MainTemplate'

export default function BroadcastHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch history data from the backend
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await service.getBroadcastHistory() // Adjust the endpoint as needed
                console.log(response)

                setHistory(response);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) {
        return (
            <MainTemplate headerName="Broadcast History" cardHeader="Broadcast History">
                <div>Loading...</div>
            </MainTemplate>
        );
    }

    if (error) {
        return (
            <MainTemplate headerName="Broadcast History" cardHeader="Broadcast History">
                <div>Error: {error}</div>
            </MainTemplate>
        );
    }

    return (
        <MainTemplate headerName="Broadcast History" cardHeader="Broadcast History">
            <div className="history-table">
                <table>
                    <thead>
                        <tr>
                            <th>Number of Recipients</th>
                            <th>Broadcast Type</th>
                            <th>Message</th>
                            <th>Message ID</th>
                            <th>Status</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.length === 0 ? (
                            <tr>
                                <td colSpan="5">No history available</td>
                            </tr>
                        ) : (
                            history.map((item) => (
                                <tr key={item._id}>
                                    <td>{item.phoneNumbers.length}</td>
                                    <td>{item.broadcastType || 'N/A'}</td>
                                    <td>{item.message}</td>
                                    <td>{item.messageId || 'N/A'}</td>
                                    <td>{item.status}</td>
                                    <td>
                                        {new Date(new Date(item.createdAt).getTime() - 8 * 60 * 60 * 1000).toLocaleString('en-PH', {
                                            timeZone: 'Asia/Manila',
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true,
                                        })}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </MainTemplate>
    );
}