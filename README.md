# SmartSMS-Barangay

For Partial Requirements in the subject SOFTENG1 & SOFTENG2 2

# Smart Barangay Management System

**Version:** 1.0  
**Date:** February 7, 2025

---

## 1. Overview

The Smart Barangay Management System is a full-stack web application designed to modernize barangay administration and service delivery. The application uses **ReactJS** on the frontend and **ExpressJS** on the backend, providing a comprehensive platform for resident management, SMS broadcasting, document request processing, and household registry management.

---

## 2. Objectives & Goals

- **SMS Broadcasting:** Enable barangay admin to send targeted SMS announcements to filtered groups of residents.
- **Resident Management:** Provide comprehensive CRUD capabilities for resident database management.
- **Document Request Processing:** Allow residents to request barangay documents online with email verification.
- **Household Management:** Maintain organized household registries with family relationship tracking.
- **Admin Controls:** Multi-level admin access with action logging and template management.

---

## 3. Scope

- **Frontend:** Developed using ReactJS with responsive design for both admin dashboard and public services.
- **Backend:** Built with ExpressJS, providing RESTful API endpoints for all system operations.
- **Database:** MongoDB for storing resident information, households, document requests, and system data.
- **Third-Party Integration:** SMS gateway integration and email services for notifications.

---

## 4. Stakeholders

- **Barangay Administration:** Primary users managing residents, households, and processing requests.
- **Superadmin:** System administrator with full access to user management and system logs.
- **Residents:** Recipients of SMS announcements and users of online document request services.
- **Citizens:** General public accessing barangay information and services.

---

## 5. Functional Requirements

### 5.1 Resident Management
- **Comprehensive Resident Database:**  
  - Store complete resident profiles including personal, contact, address, medical, employment, and education information.
  - Track household assignments and relationships.
  
- **CRUD Operations:**  
  - **Create:** Add new residents with full profile information.
  - **Read:** Search, filter, and view resident records with advanced filtering options.
  - **Update:** Modify resident details with change tracking.
  - **Delete:** Remove resident entries (superadmin only) with audit logging.

### 5.2 SMS Broadcasting System
- **Advanced Filtering:**  
  - Filter residents by age range, gender, marital status, address, education, employment, and medical conditions.
  - Support for multiple broadcast types (Local, Gift Giving, Medicine, Garbage Collection).
  
- **Message Management:**
  - Create and manage reusable message templates.
  - Character count tracking for SMS optimization.
  - Bulk recipient selection with preview.
  
- **Broadcast History:**
  - Track all sent messages with delivery status.
  - View historical broadcast data and analytics.

### 5.3 Document Request System
- **Online Request Processing:**
  - Public form for document requests (Certificate of Residency, Indigency, etc.).
  - Email verification system with secure code validation.
  - Request status tracking (pending, approved, rejected).
  
- **Admin Processing:**
  - Review and manage pending document requests.
  - Approve requests with pickup details and instructions.
  - Reject requests with detailed reasoning.
  - Email notifications for status changes.

### 5.4 Household Management
- **Household Registry:**
  - Create and manage household units with geographic information.
  - Assign household heads and track family relationships.
  - Support for up to 18 members per household.
  
- **Member Management:**
  - Add existing residents or create new residents within households.
  - Transfer household headship between members.
  - Remove members with option to delete or unassign.
  
- **Audit System:**
  - Complete audit trail for all household changes.
  - Track member additions, removals, and role changes.

### 5.5 Administrative Features
- **Multi-Level Access Control:**
  - Superadmin: Full system access including user management.
  - Admin: Standard operations for resident and household management.
  
- **System Monitoring:**
  - Admin action history logging.
  - User account management (create, update, delete admin accounts).
  - Template management for SMS broadcasts.

---

## 6. Non-Functional Requirements

- **Usability:**  
  - Intuitive dashboard with sidebar navigation.
  - Responsive design compatible with desktop, tablet, and mobile devices.
  - Search and filtering capabilities throughout the system.

- **Performance:**  
  - Fast data retrieval with pagination support.
  - Efficient SMS sending with batch processing.
  - Optimized database queries for large datasets.

- **Security:**  
  - JWT-based authentication with role-based access control.
  - Input validation and sanitization to prevent injection attacks.
  - Secure password hashing and session management.

- **Reliability:**  
  - Comprehensive error handling with user-friendly messages.
  - Data backup and recovery mechanisms.
  - Audit logging for accountability and troubleshooting.

---

## 7. Technical Requirements

- **Frontend:**
  - **Framework:** ReactJS with React Router for navigation
  - **UI Components:** Custom CSS with Font Awesome icons
  - **State Management:** React Hooks for component state
  - **HTTP Client:** Axios for API communication

- **Backend:**
  - **Framework:** ExpressJS on Node.js
  - **Database:** MongoDB with Mongoose ODM
  - **Authentication:** JWT tokens with bcrypt for password hashing
  - **Email Service:** Nodemailer with Gmail integration
  - **SMS Integration:** Third-party SMS gateway

- **Database Schema:**
  - **Collections:** Residents, Households, DocumentRequests, AdminUsers, BroadcastHistory, Templates, AuditLogs

---

## 8. User Interface & User Experience

### 8.1 Admin Dashboard
- **Sidebar Navigation:** Access to all major modules (Dashboard, Residents, Households, Broadcasts, etc.).
- **Dashboard Overview:** Statistics cards showing resident counts, pending requests, and recent activity.
- **Data Tables:** Sortable, searchable tables with pagination for all data views.
- **Modal Forms:** Popup forms for creating and editing records.

### 8.2 Public Website
- **Homepage:** Barangay information with navigation to services.
- **Online Services:** Document request forms with step-by-step process.
- **Responsive Design:** Mobile-friendly interface for public access.

---

## 9. Workflow

1. **Admin Authentication:**  
   - Secure login with role-based dashboard access.

2. **Resident Management:**  
   - Add, edit, search, and filter resident records.
   - Assign residents to households or manage as independent records.

3. **Household Operations:**
   - Create household units with geographic and administrative data.
   - Manage family relationships and household composition.

4. **SMS Broadcasting:**
   - Apply filters to target specific resident groups.
   - Compose messages using templates or custom text.
   - Send broadcasts with delivery tracking.

5. **Document Processing:**
   - Citizens submit requests through public forms.
   - Email verification ensures request authenticity.
   - Admin reviews, approves/rejects with notifications.

---

## 10. System Features

### 10.1 Implemented Features
- ✅ Resident CRUD with comprehensive profiles
- ✅ Advanced SMS broadcasting with filtering
- ✅ Document request system with email verification
- ✅ Household management with audit trails
- ✅ Admin user management and role controls
- ✅ Broadcast template management
- ✅ Action logging and audit systems
- ✅ Responsive public website
- ✅ Dashboard with statistics and overview

### 10.2 Current System Limitations
- Single SMS gateway integration
- Basic reporting features
- Manual admin account creation only

---

## 11. Database Collections

- **Residents:** Complete resident profiles with household references
- **Households:** Household registry with geographic and administrative data
- **DocumentRequests:** Online document request processing
- **PendingDocumentRequests:** Temporary storage for unverified requests
- **Users:** Admin account management with role-based access
- **BroadcastHistory:** SMS sending history and delivery tracking
- **BroadcastTemplates:** Reusable message templates
- **AdminActionHistory:** Audit logging for administrative actions
- **HouseholdAudit:** Detailed change tracking for household operations

---

## 12. API Endpoints

### Authentication & Admin Management
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/verify-token` - Token validation
- `GET /api/admin/accounts` - List admin accounts
- `POST /api/admin/accounts` - Create admin account
- `PUT /api/admin/accounts/:id` - Update admin account
- `DELETE /api/admin/accounts/:id` - Delete admin account

### Resident Management
- `GET /api/resident/all` - List all residents
- `POST /api/resident/register` - Create new resident
- `PUT /api/resident/update/:id` - Update resident
- `DELETE /api/resident/delete/:id` - Delete resident

### Household Management
- `GET /api/households` - List households
- `POST /api/households` - Create household
- `GET /api/households/:id` - Get household details
- `PUT /api/households/:id` - Update household
- `DELETE /api/households/:id` - Delete household

### Document Requests
- `POST /api/resident/documentRequest` - Submit request
- `POST /api/resident/verifyDocumentRequest` - Verify email code
- `GET /api/admin/pendingrequest` - Get pending requests
- `PUT /api/admin/updaterequests/:id` - Update request status

### SMS & Templates
- `POST /api/send-sms` - Send SMS broadcast
- `GET /api/history/getall` - Broadcast history
- `GET /api/templates` - List templates
- `POST /api/templates` - Create template

---

## 13. Future Enhancements

- **Advanced Analytics:** Detailed reporting and data visualization
- **Multi-Channel Communication:** Integration with multiple SMS providers
- **Mobile Application:** Dedicated mobile app for residents
- **Digital Document Generation:** Automated certificate generation
- **Integration APIs:** Connect with other government systems

---

## 14. Assumptions & Dependencies

- **Assumptions:**
  - Stable internet connection for all users
  - Admin users have basic computer literacy
  - Residents have access to mobile phones for SMS
  - Email access for document request verification

- **Dependencies:**
  - MongoDB database service
  - Gmail SMTP for email notifications
  - SMS gateway service provider
  - Node.js runtime environment
  - Modern web browsers for frontend access

---
