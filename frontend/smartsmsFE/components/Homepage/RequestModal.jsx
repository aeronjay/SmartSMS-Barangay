import React, { useState } from 'react';
import '../../styles/RequestModal.css';
import apiService from '../../services/service';

const RequestModal = ({ isOpen, onClose, documentType, onSubmit }) => {
    const [formData, setFormData] = useState({
      fullName: '',
      email: '',
      phoneNumber: '',
      address: '',
      purpose: '',
      documentType: documentType
    });
    const [step, setStep] = useState(1); // 1=form, 2=verify
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [verifyError, setVerifyError] = useState('');
    const [emailForVerification, setEmailForVerification] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
  
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setErrorMessage('');
      try {
        await apiService.submitDocumentRequest(formData);
        setStep(2);
        setEmailForVerification(formData.email);
      } catch (error) {
        let errorMsg = 'Failed to submit request';
        if (error.response && error.response.data && error.response.data.message) {
          errorMsg = error.response.data.message;
        }
        setErrorMessage(errorMsg);
        console.error('Error submitting form:', error);
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleVerify = async (e) => {
      e.preventDefault();
      setIsVerifying(true);
      setVerifyError('');
      try {
        await apiService.verifyDocumentRequest({ email: emailForVerification, code: verificationCode });
        onSubmit();
        onClose();
      } catch (error) {
        let errorMsg = 'Verification failed';
        if (error.response && error.response.data && error.response.data.message) {
          errorMsg = error.response.data.message;
        }
        setVerifyError(errorMsg);
      } finally {
        setIsVerifying(false);
      }
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2>Request {documentType}</h2>
            <button className="close-button" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="modal-body">
            {step === 1 && (
              <>
                {errorMessage && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i> {errorMessage}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Juan Dela Cruz" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="example@email.com" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required placeholder="09123456789" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Complete Address</label>
                    <textarea id="address" name="address" value={formData.address} onChange={handleChange} required placeholder="House/Unit Number, Street, Barangay"></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="purpose">Purpose</label>
                    <textarea id="purpose" name="purpose" value={formData.purpose} onChange={handleChange} required placeholder="Please state the purpose of your request"></textarea>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
                    <button type="submit" className="submit-button" disabled={isSubmitting}>
                      {isSubmitting ? (<><i className="fas fa-spinner fa-spin"></i> Submitting...</>) : (<><i className="fas fa-paper-plane"></i> Submit Request</>)}
                    </button>
                  </div>
                </form>
              </>
            )}
            {step === 2 && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <b>Enter the verification code sent to your email.</b>
                </div>
                {verifyError && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i> {verifyError}
                  </div>
                )}
                <form onSubmit={handleVerify}>
                  <div className="form-group">
                    <label htmlFor="verificationCode">Verification Code</label>
                    <input
                      type="text"
                      id="verificationCode"
                      name="verificationCode"
                      value={verificationCode}
                      onChange={e => setVerificationCode(e.target.value)}
                      required
                      placeholder="Enter code"
                      maxLength={6}
                    />
                  </div>
                  <div className="form-actions">
                    <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
                    <button type="submit" className="submit-button" disabled={isVerifying}>
                      {isVerifying ? (<><i className="fas fa-spinner fa-spin"></i> Verifying...</>) : (<>Verify</>)}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default RequestModal;