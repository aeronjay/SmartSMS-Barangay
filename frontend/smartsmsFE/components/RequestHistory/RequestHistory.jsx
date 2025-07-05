import { useState, useEffect } from 'react';
import MainTemplate from '../MainTemplate';
import apiService from '../../services/service';
import '../../styles/DocumentRequest.css'; // Reusing the same styles

export default function RequestHistory() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'approved', 'rejected'

    useEffect(() => {
        // Fetch all requests when component mounts
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await apiService.getAllDocumentRequests();
            console.log(response)
            // Check the structure of the response and handle accordingly
            const requestData = response?.requests || response || [];

            // Filter out pending requests - only keep approved and rejected
            const filteredData = Array.isArray(requestData)
                ? requestData.filter(request => request.status === 'approved' || request.status === 'rejected')
                : [];

            setRequests(filteredData);
            setError(null);
        } catch (err) {
            setError('Error fetching document requests');
            console.error('Error fetching requests:', err);
            setRequests([]);  // Ensure requests is always an array
        } finally {
            setLoading(false);
        }
    };

    const handleView = (request) => {
        // Create a detailed view of the request
        const details = [
            `Name: ${request.fullName}`,
            `Email: ${request.email}`,
            `Phone: ${request.phoneNumber}`,
            `Address: ${request.address}`,
            `Document Type: ${request.documentType}`,
            `Purpose: ${request.purpose}`,
            `Status: ${request.status}`,
            `Date: ${new Date(new Date(request.createdAt).getTime() - 8 * 60 * 60 * 1000).toLocaleString('en-PH', {
                timeZone: 'Asia/Manila',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            })}`
        ];

        // Add approval details if approved
        if (request.status === 'approved' && request.approvalDetails) {
            details.push('');
            details.push('--- APPROVAL DETAILS ---');
            if (request.approvalDetails.pickupDate) {
                details.push(`Pickup Date: ${new Date(request.approvalDetails.pickupDate).toLocaleDateString('en-PH')}`);
            }
            if (request.approvalDetails.pickupTime) {
                details.push(`Pickup Time: ${request.approvalDetails.pickupTime}`);
            }
            if (request.approvalDetails.officeHours) {
                details.push(`Office Hours: ${request.approvalDetails.officeHours}`);
            }
            if (request.approvalDetails.instructions) {
                details.push(`Instructions: ${request.approvalDetails.instructions}`);
            }
        }

        // Add rejection reason if rejected
        if (request.status === 'rejected' && request.rejectionReason) {
            details.push('');
            details.push('--- REJECTION REASON ---');
            details.push(request.rejectionReason);
        }

        alert(details.join('\n'));
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'approved':
                return 'status-approved';
            case 'rejected':
                return 'status-rejected';
            default:
                return 'status-default';
        }
    };

    // Filter the requests based on status
    const filteredRequests = Array.isArray(requests) ?
        (filterStatus === 'all' ? requests : requests.filter(request => request.status === filterStatus))
        : [];

    return (
        <>
            <MainTemplate headerName={"Request History"} cardHeader={"Request History"}>
                <div className="document-request-container">
                    <div className="filter-container">
                        <div className="filter-label">Filter by status:</div>
                        <div className="filter-options">
                            <button
                                className={`filter-button ${filterStatus === 'all' ? 'active' : ''}`}
                                onClick={() => setFilterStatus('all')}
                            >
                                All
                            </button>
                            <button
                                className={`filter-button ${filterStatus === 'approved' ? 'active' : ''}`}
                                onClick={() => setFilterStatus('approved')}
                            >
                                Approved
                            </button>
                            <button
                                className={`filter-button ${filterStatus === 'rejected' ? 'active' : ''}`}
                                onClick={() => setFilterStatus('rejected')}
                            >
                                Rejected
                            </button>
                        </div>
                    </div>

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
                                            <th>Status</th>
                                            <th>Date</th>
                                            {/* <th>Actions</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRequests.length > 0 ? (
                                            filteredRequests.map((request) => (
                                                <tr key={request._id || request.id || Math.random().toString()}>
                                                    <td>
                                                        <div className="requester-name">{request.fullName}</div>
                                                        <div className="requester-email">{request.email}</div>
                                                        <div className="requester-phone">{request.phoneNumber}</div>
                                                    </td>
                                                    <td>{request.documentType}</td>
                                                    <td>{request.purpose}</td>
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
                                                    {/* <td>
                                                        <div className="action-buttons">
                                                            <button
                                                                onClick={() => handleView(request)}
                                                                className="view-button"
                                                            >
                                                                View
                                                            </button>
                                                        </div>
                                                    </td> */}
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