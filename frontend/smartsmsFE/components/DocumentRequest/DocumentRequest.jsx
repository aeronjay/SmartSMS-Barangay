import { useState, useEffect } from 'react';
import MainTemplate from '../MainTemplate';
import apiService from '../../services/service';
import '../../styles/DocumentRequest.css';

export default function DocumentRequest() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch all requests when component mounts
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await apiService.getPendingDocumentRequests();

            // Check the structure of the response and handle accordingly
            // If response.requests exists, use it, otherwise check if response itself is an array
            const requestData = response?.requests || response || [];
            setRequests(Array.isArray(requestData) ? requestData : []);
            setError(null);
        } catch (err) {
            setError('Error fetching document requests');
            console.error('Error fetching requests:', err);
            setRequests([]);  // Ensure requests is always an array
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await apiService.updateDocumentRequestStatus(id, 'approved');
            // Update the local state to reflect the change
            setRequests(requests.map(request =>
                request._id === id ? { ...request, status: 'approved' } : request
            ));
        } catch (err) {
            setError(`Error approving request: ${err?.message || 'Unknown error'}`);
        }
    };

    const handleReject = async (id) => {
        try {
            await apiService.updateDocumentRequestStatus(id, 'rejected');
            // Update the local state to reflect the change
            setRequests(requests.map(request =>
                request._id === id ? { ...request, status: 'rejected' } : request
            ));
        } catch (err) {
            setError(`Error rejecting request: ${err?.message || 'Unknown error'}`);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'pending':
                return 'status-pending';
            case 'approved':
                return 'status-approved';
            case 'rejected':
                return 'status-rejected';
            default:
                return 'status-default';
        }
    };


    return (
        <>
            <MainTemplate headerName={"Document Request"} cardHeader={"Document Request Management"}>
                <div className="document-request-container">
                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                        </div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : (
                        <>
                            <div className="table-container">
                                <table className="requests-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Document Type</th>
                                            <th>Purpose</th>
                                            <th>Address</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requests.length > 0 ? (
                                            requests.map((request) => (
                                                <tr key={request._id || request.id || Math.random().toString()}>
                                                    <td>
                                                        <div className="requester-name">{request.fullName}</div>
                                                        <div className="requester-email">{request.email}</div>
                                                        <div className="requester-phone">{request.phoneNumber}</div>
                                                    </td>
                                                    <td>{request.documentType}</td>
                                                    <td>{request.purpose}</td>
                                                    <td>{request.address}</td>
                                                    <td>
                                                        <span className={`status-badge ${getStatusClass(request.status)}`}>
                                                            {request.status || 'unknown'}
                                                        </span>
                                                    </td>
                                                    <td>{new Date(new Date(request.createdAt).getTime() - 8 * 60 * 60 * 1000).toLocaleString('en-PH', {
                                                        timeZone: 'Asia/Manila',
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        hour: 'numeric',
                                                        minute: '2-digit',
                                                        hour12: true,
                                                    })}</td>
                                                    <td>
                                                        {request.status === 'pending' && (
                                                            <div className="action-buttons">
                                                                <button
                                                                    onClick={() => handleApprove(request._id || request.id)}
                                                                    className="approve-button"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReject(request._id || request.id)}
                                                                    className="reject-button"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        )}
                                                        {request.status !== 'pending' && (
                                                            <span className="no-actions">No actions available</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="no-requests-message">
                                                    No document requests found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </MainTemplate>
        </>
    );
}