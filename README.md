# SmartSMS-Barangay

For Partial Requirements in the subject SOFTENG1 & SOFTENG2 2

# Barangay Announcements & CCTV Scheduling System

**Version:** 1.0  
**Date:** February 7, 2025

---

## 1. Overview

The Barangay Announcements & CCTV Scheduling System is a full-stack web application designed to serve as a communication and scheduling tool for barangay residents and guests. The application will use **ReactJS** on the frontend and **ExpressJS** on the backend, providing a seamless, responsive interface for administrative tasks and guest interactions.

---

## 2. Objectives & Goals

- **Announcements via SMS:** Enable the barangay admin to send SMS-based announcements to selected residents.
- **Message Template Management:** Allow the admin to create and edit message templates for consistency and efficiency.
- **Resident Management:** Provide robust CRUD (Create, Read, Update, Delete) capabilities to manage a resident database.
- **CCTV Viewing Scheduling:** Offer a public form where guests can schedule a CCTV viewing appointment.

---

## 3. Scope

- **Frontend:** Developed using ReactJS to ensure a dynamic, responsive, and user-friendly interface.
- **Backend:** Built with ExpressJS, providing API endpoints to handle business logic, database interactions, and third-party integrations.
- **Database:** A suitable database (SQL or NoSQL) will store resident information, message templates, and scheduling data.
- **Third-Party Integration:** Integrate with an SMS gateway (such as Twilio, Nexmo, etc.) to facilitate SMS announcements.

---

## 4. Stakeholders

- **Barangay Administration:** Primary users responsible for managing residents, sending announcements, and overseeing scheduling.
- **Residents:** Recipients of SMS announcements.
- **Guests:** Individuals scheduling CCTV viewing appointments.

---

## 5. Functional Requirements

### 5.1 Resident Management
- **Database of Residents:**  
  - Store details such as name, contact information (phone numbers for SMS), address, etc.
  - Support for bulk import/export of resident data.
  
- **CRUD Operations:**  
  - **Create:** Admin can add new residents.
  - **Read:** Admin can view/search/filter resident records.
  - **Update:** Admin can modify resident details.
  - **Delete:** Admin can remove resident entries as needed.

### 5.2 Announcement Management via SMS
- **Message Template Editor:**  
  - Admin can create new message templates.
  - Admin can edit and save existing templates.
  
- **SMS Sending:**
  - Admin can select one or more residents from the database.
  - Utilize a third-party SMS gateway to send out announcements.
  - Provide an interface for the admin to review sent messages along with their statuses (e.g., delivered, failed).

### 5.3 CCTV Viewing Scheduling
- **Guest Scheduling Form:**
  - A publicly accessible form where guests can input:
    - Name
    - Contact details (e.g., email, phone number)
    - Preferred date and time for viewing
  - **Validation:** Ensure that the form includes proper validation (e.g., valid date/time, required fields).
  - **Confirmation:** Optionally, send a confirmation SMS/email to the guest after scheduling.
  
- **Admin Scheduling Overview:**
  - An interface for the admin to view, confirm, or manage scheduled CCTV viewings.

---

## 6. Non-Functional Requirements

- **Usability:**  
  - The application should be intuitive and accessible to users with varying levels of technical expertise.
  - Responsive design to ensure compatibility with desktop, tablet, and mobile devices.

- **Performance:**  
  - Fast load times and responsive interactions.
  - Efficient SMS sending with minimal latency.

- **Security:**  
  - Secure handling of resident data with appropriate authentication and authorization mechanisms.
  - Protection against common web vulnerabilities (e.g., SQL injection, XSS).

- **Scalability:**  
  - Design the system to handle an increasing number of residents and scheduling requests without degradation in performance.

- **Reliability:**  
  - Ensure high availability for critical features like SMS sending and scheduling.
  - Robust error handling and logging for backend operations.

---

## 7. Technical Requirements

- **Frontend:**
  - **Framework:** ReactJS
  - **UI Library (Optional):** Material-UI, Bootstrap, or similar
  - **Routing:** React Router or equivalent for navigation

- **Backend:**
  - **Framework:** ExpressJS running on Node.js
  - **API Design:** RESTful endpoints for all CRUD operations and SMS scheduling functions
  - **Middleware:** For authentication, logging, error handling, etc.

- **Database:**
  - **Type:** SQL (e.g., PostgreSQL, MySQL) or NoSQL (e.g., MongoDB), depending on scalability and data structure needs

- **Third-Party Services:**
  - **SMS Gateway Integration:** Integration with a service like Twilio for sending SMS messages.
  - **Optional:** Email service integration for confirmation emails (e.g., SendGrid, Mailgun)

- **Deployment:**
  - Containerization (e.g., Docker) for ease of deployment and scalability.
  - Cloud-based hosting (AWS, Azure, Heroku, etc.) as per requirements.

---

## 8. User Interface & User Experience

### 8.1 Admin Dashboard
- **Overview Page:** Summary of resident data, recent SMS announcements, and scheduled CCTV viewings.
- **Resident Management Module:** List view with search, filtering, and CRUD operations.
- **Announcement Module:** Interface for managing message templates and sending SMS announcements.
- **Scheduling Module:** View and manage CCTV viewing appointments.

### 8.2 Public Scheduling Form
- **Simple and Clean Design:** Ensure the form is easy to fill out with clear instructions.
- **Responsive Design:** Accessible on all devices.
- **Confirmation:** Display a confirmation message or send an SMS/email after form submission.

---

## 9. Workflow

1. **Admin Login:**  
   - Admin logs into the system using secure authentication.

2. **Resident Management:**  
   - The admin accesses the resident module to manage records (add, edit, delete, search).

3. **SMS Announcement:**
   - The admin creates or edits a message template.
   - The admin selects the target residents and sends out the SMS announcement via the integrated SMS gateway.
   - The system logs the status of each SMS (e.g., delivered, failed).

4. **CCTV Scheduling:**
   - Guests access the public scheduling form.
   - Guests fill in the required details and submit their request.
   - The system validates and stores the scheduling request, optionally sending a confirmation to the guest.
   - The admin reviews and manages scheduled appointments from the dashboard.

---

## 10. Milestones & Timeline

1. **Requirements Finalization & Planning:**  
   - Complete detailed requirement analysis and finalize the tech stack.
2. **Design Phase:**  
   - UI/UX wireframes for both admin and public interfaces.
3. **Development Phase:**
   - Set up project scaffolding for ReactJS and ExpressJS.
   - Develop resident management and CRUD functionalities.
   - Implement message template management and SMS integration.
   - Build the public CCTV scheduling form.
4. **Testing Phase:**  
   - Unit tests, integration tests, and end-to-end testing.
5. **Deployment:**  
   - Deploy to a staging environment followed by production.
6. **Review & Feedback:**  
   - Collect feedback from initial users and iterate.

---

## 11. Future Enhancements (Optional)

- **Multi-Channel Communication:**  
  - Integration with email notifications alongside SMS.
  
- **Advanced Scheduling Features:**  
  - Options for rescheduling or canceling CCTV appointments.
  
- **Analytics Dashboard:**  
  - Detailed statistics on SMS delivery, resident engagement, and scheduling trends.
  
- **Role-Based Access Control:**  
  - Support multiple admin roles with varying permissions.

---

## 12. Assumptions & Dependencies

- **Assumptions:**
  - The barangay admin is comfortable with basic web interfaces.
  - SMS gateway services are reliable and available.
  - Guests will have internet access to use the scheduling form.

- **Dependencies:**
  - Third-party SMS gateway (e.g., Twilio).
  - Selected database technology and hosting provider.
  - Browser compatibility and device responsiveness.


---
