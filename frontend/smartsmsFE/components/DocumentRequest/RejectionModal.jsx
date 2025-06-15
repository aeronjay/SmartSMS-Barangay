import React, { useState } from 'react';

const RejectionModal = ({ isOpen, onClose, onReject, requestData }) => {
    const [rejectionDetails, setRejectionDetails] = useState({
        reason: '',
        customReason: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const predefinedReasons = [
        'Incomplete or missing information',
        'Invalid identification documents',
        'Request does not meet requirements',
        'Duplicate request already processed',
        'Ineligible for requested document',
        'Other (please specify)'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const finalReason = rejectionDetails.reason === 'Other (please specify)' 
                ? rejectionDetails.customReason 
                : rejectionDetails.reason;
                
            if (!finalReason.trim()) {
                alert('Please provide a reason for rejection');
                setIsSubmitting(false);
                return;
            }
            
            await onReject(requestData._id || requestData.id, finalReason);
            onClose();
            // Reset form
            setRejectionDetails({
                reason: '',
                customReason: ''
            });
        } catch (error) {
            console.error('Error rejecting request:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReasonChange = (e) => {
        setRejectionDetails({
            ...rejectionDetails,
            reason: e.target.value,
            // Clear custom reason if not "Other"
            customReason: e.target.value === 'Other (please specify)' ? rejectionDetails.customReason : ''
        });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Reject Document Request</h3>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>
                
                <div className="modal-body">
                    <div className="request-info">
                        <p><strong>Requester:</strong> {requestData?.fullName}</p>
                        <p><strong>Document:</strong> {requestData?.documentType}</p>
                        <p><strong>Purpose:</strong> {requestData?.purpose}</p>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="reason">Reason for Rejection:</label>
                            <select
                                id="reason"
                                name="reason"
                                value={rejectionDetails.reason}
                                onChange={handleReasonChange}
                                required
                            >
                                <option value="">Select a reason...</option>
                                {predefinedReasons.map((reason, index) => (
                                    <option key={index} value={reason}>
                                        {reason}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {rejectionDetails.reason === 'Other (please specify)' && (
                            <div className="form-group">
                                <label htmlFor="customReason">Please specify the reason:</label>
                                <textarea
                                    id="customReason"
                                    name="customReason"
                                    value={rejectionDetails.customReason}
                                    onChange={(e) => setRejectionDetails({
                                        ...rejectionDetails,
                                        customReason: e.target.value
                                    })}
                                    rows="3"
                                    placeholder="Please provide specific details..."
                                    required
                                />
                            </div>
                        )}
                        
                        <div className="rejection-warning">
                            <p><strong>Note:</strong> An email will be sent to the requester explaining the rejection and the reason provided above.</p>
                        </div>
                        
                        <div className="modal-actions">
                            <button type="button" onClick={onClose} className="cancel-button">
                                Cancel
                            </button>
                            <button type="submit" disabled={isSubmitting} className="reject-button">
                                {isSubmitting ? 'Rejecting...' : 'Reject & Send Email'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RejectionModal;
