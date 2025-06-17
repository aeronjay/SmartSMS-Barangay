import { useState, useEffect } from 'react';
import MainTemplate from '../MainTemplate';
import apiService from '../../services/service';
import ApprovalModal from './ApprovalModal';
import RejectionModal from './RejectionModal';
import '../../styles/DocumentRequest.css';

export default function DocumentRequest() {
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [approvalModal, setApprovalModal] = useState({ isOpen: false, requestData: null });
    const [rejectionModal, setRejectionModal] = useState({ isOpen: false, requestData: null });
      // Filter and search states
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [documentTypeFilter, setDocumentTypeFilter] = useState('');

    useEffect(() => {
        // Fetch all requests when component mounts
        fetchRequests();
    }, []);

    // Filter and search effect
    useEffect(() => {
        let filtered = [...requests];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(request => 
                request.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.phoneNumber?.includes(searchTerm)
            );
        }

        // Document type filter
        if (documentTypeFilter) {
            filtered = filtered.filter(request => 
                request.documentType === documentTypeFilter
            );
        }

        // Date filter
        if (dateFilter) {
            const filterDate = new Date(dateFilter);
            filtered = filtered.filter(request => {
                const requestDate = new Date(request.createdAt);
                return requestDate.toDateString() === filterDate.toDateString();
            });
        }

        setFilteredRequests(filtered);
    }, [requests, searchTerm, documentTypeFilter, dateFilter]);    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await apiService.getPendingDocumentRequests();

            // Check the structure of the response and handle accordingly
            // If response.requests exists, use it, otherwise check if response itself is an array
            const requestData = response?.requests || response || [];
            setRequests(Array.isArray(requestData) ? requestData : []);
            setFilteredRequests(Array.isArray(requestData) ? requestData : []);
            setError(null);
        } catch (err) {
            setError('Error fetching document requests');
            console.error('Error fetching requests:', err);
            setRequests([]);  // Ensure requests is always an array
            setFilteredRequests([]);  // Ensure filteredRequests is always an array
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id, approvalDetails) => {
        try {
            await apiService.updateDocumentRequestStatus(id, 'approved', { approvalDetails });
            // Update the local state to reflect the change
            setRequests(requests.map(request =>
                request._id === id ? { ...request, status: 'approved' } : request
            ));
        } catch (err) {
            setError(`Error approving request: ${err?.message || 'Unknown error'}`);
        }
    };

    const handleReject = async (id, reason) => {
        try {
            await apiService.updateDocumentRequestStatus(id, 'rejected', { rejectionReason: reason });
            // Update the local state to reflect the change
            setRequests(requests.map(request =>
                request._id === id ? { ...request, status: 'rejected' } : request
            ));
        } catch (err) {
            setError(`Error rejecting request: ${err?.message || 'Unknown error'}`);
        }
    };

    // Get unique document types for filter dropdown
    const getUniqueDocumentTypes = () => {
        const types = requests.map(request => request.documentType);
        return [...new Set(types)].filter(Boolean);
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setDateFilter('');
        setDocumentTypeFilter('');
    };

    const openApprovalModal = (request) => {
        setApprovalModal({ isOpen: true, requestData: request });
    };

    const closeApprovalModal = () => {
        setApprovalModal({ isOpen: false, requestData: null });
    };

    const openRejectionModal = (request) => {
        setRejectionModal({ isOpen: true, requestData: request });
    };

    const closeRejectionModal = () => {
        setRejectionModal({ isOpen: false, requestData: null });
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
                        <div className="error-message">{error}</div>                    ) : (
                        <>                            {/* Filter and Search Controls */}
                            <div className="filters-container">
                                <div className="search-box">
                                    <i className="fas fa-search"></i>
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, address, or phone..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="search-input"
                                    />
                                </div>
                                
                                <div className="filter-group">
                                    <label htmlFor="documentTypeFilter">Document Type:</label>
                                    <select
                                        id="documentTypeFilter"
                                        value={documentTypeFilter}
                                        onChange={(e) => setDocumentTypeFilter(e.target.value)}
                                        className="filter-select"
                                    >
                                        <option value="">All Types</option>
                                        {getUniqueDocumentTypes().map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="filter-group">
                                    <label htmlFor="dateFilter">Date:</label>
                                    <input
                                        type="date"
                                        id="dateFilter"
                                        value={dateFilter}
                                        onChange={(e) => setDateFilter(e.target.value)}
                                        className="filter-date"
                                    />
                                </div>
                                
                                <button 
                                    onClick={clearFilters}
                                    className="clear-filters-btn"
                                    title="Clear all filters"
                                >
                                    <i className="fas fa-times"></i> Clear
                                </button>
                            </div>

                            {/* Results Summary */}
                            <div className="results-summary">
                                Showing {filteredRequests.length} of {requests.length} requests
                            </div>

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
                                    </thead>                                    <tbody>
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
                                                    <td>                                                        {request.status === 'pending' && (
                                                            <div className="action-buttons">
                                                                <button
                                                                    onClick={() => openApprovalModal(request)}
                                                                    className="approve-button"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => openRejectionModal(request)}
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
                            </div>                        </>
                    )}
                </div>
                
                {/* Modals */}
                <ApprovalModal
                    isOpen={approvalModal.isOpen}
                    onClose={closeApprovalModal}
                    onApprove={handleApprove}
                    requestData={approvalModal.requestData}
                />
                
                <RejectionModal
                    isOpen={rejectionModal.isOpen}
                    onClose={closeRejectionModal}
                    onReject={handleReject}
                    requestData={rejectionModal.requestData}
                />
            </MainTemplate>
        </>
    );
}