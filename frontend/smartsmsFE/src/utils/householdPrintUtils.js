// Helper function to generate table rows
const generateCompactTableRows = (members) => {
  let rows = '';
  
  // Create 10 rows to fit on one page
  for (let i = 0; i < 10; i++) {
    const member = members[i] || {};
    
    // Format date of birth
    const formatDateOfBirth = (dateString) => {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
          month: '2-digit', 
          day: '2-digit', 
          year: 'numeric' 
        });
      } catch {
        return dateString;
      }
    };
    
    // Calculate age
    const calculateAge = (dateOfBirth) => {
      if (!dateOfBirth) return '';
      try {
        const birth = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
          age--;
        }
        return age.toString();
      } catch {
        return '';
      }
    };
    
    rows += `
      <tr style="border: 1px solid black;">
        <td style="border: 1px solid black; padding: 2px; height: 18px; vertical-align: top; font-size: 7px;">${member.last_name || ''}</td>
        <td style="border: 1px solid black; padding: 2px; height: 18px; vertical-align: top; font-size: 7px;">${member.first_name || ''}</td>
        <td style="border: 1px solid black; padding: 2px; height: 18px; vertical-align: top; font-size: 7px;">${member.middle_name || ''}</td>
        <td style="border: 1px solid black; padding: 2px; height: 18px; vertical-align: top; font-size: 7px;">${member.extension || ''}</td>
        <td style="border: 1px solid black; padding: 2px; height: 18px; vertical-align: top; font-size: 7px;">${member.place_of_birth || ''}</td>
        <td style="border: 1px solid black; padding: 2px; height: 18px; vertical-align: top; font-size: 7px;">${formatDateOfBirth(member.date_of_birth)}</td>
        <td style="border: 1px solid black; padding: 2px; height: 18px; vertical-align: top; text-align: center; font-size: 7px;">${member.date_of_birth ? calculateAge(member.date_of_birth) : ''}</td>
        <td style="border: 1px solid black; padding: 2px; height: 18px; vertical-align: top; text-align: center; font-size: 7px;">${member.gender === 'male' ? 'M' : member.gender === 'female' ? 'F' : member.gender || ''}</td>
        <td style="border: 1px solid black; padding: 2px; height: 18px; vertical-align: top; font-size: 7px;">${member.civil_status || ''}</td>
        <td style="border: 1px solid black; padding: 2px; height: 18px; vertical-align: top; font-size: 7px;">${member.citizenship || 'FILIPINO'}</td>
        <td style="border: 1px solid black; padding: 2px; height: 18px; vertical-align: top; font-size: 7px;">${member.occupation || ''}</td>
        <td style="border: 1px solid black; padding: 2px; height: 18px; vertical-align: top; font-size: 7px;"></td>
      </tr>
    `;
  }
  
  return rows;
};

// Helper function to create the RBI Form template
const createRBIFormTemplate = (householdData) => {
  const members = householdData.members || [];
  
  return `
    <div style="width: 1123px; height: 794px; padding: 10px; font-family: Arial, sans-serif; font-size: 9px; background: white; box-sizing: border-box;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 10px;">
        <div style="font-size: 11px; font-weight: bold; margin-bottom: 2px;">RECORDS OF BARANGAY INHABITANTS BY HOUSEHOLD</div>
      </div>
      
      <!-- Household Information Form -->
      <div style="margin-bottom: 10px; font-size: 8px; line-height: 1.4;">
        <div style="margin-bottom: 4px; display: flex; align-items: center;">
          <span style="width: 150px; display: inline-block;">REGION:</span>
          <span style="border-bottom: 1px solid black; padding-bottom: 1px; display: inline-block; width: 300px; margin-left: 5px;">${householdData.region || ''}</span>
        </div>
        <div style="margin-bottom: 4px; display: flex; align-items: center;">
          <span style="width: 150px; display: inline-block;">PROVINCE:</span>
          <span style="border-bottom: 1px solid black; padding-bottom: 1px; display: inline-block; width: 300px; margin-left: 5px;">${householdData.province || ''}</span>
        </div>
        <div style="margin-bottom: 4px; display: flex; align-items: center;">
          <span style="width: 150px; display: inline-block;">CITY/MUNICIPALITY:</span>
          <span style="border-bottom: 1px solid black; padding-bottom: 1px; display: inline-block; width: 300px; margin-left: 5px;">${householdData.cityMunicipality || ''}</span>
        </div>
        <div style="margin-bottom: 4px; display: flex; align-items: center;">
          <span style="width: 150px; display: inline-block;">BARANGAY:</span>
          <span style="border-bottom: 1px solid black; padding-bottom: 1px; display: inline-block; width: 300px; margin-left: 5px;">${householdData.barangay || ''}</span>
        </div>
        <div style="margin-bottom: 4px; display: flex; align-items: center;">
          <span style="width: 150px; display: inline-block;">HOUSEHOLD ADDRESS:</span>
          <span style="border-bottom: 1px solid black; padding-bottom: 1px; display: inline-block; width: 400px; margin-left: 5px;">${householdData.householdAddress || ''}</span>
        </div>
        <div style="margin-bottom: 4px; display: flex; align-items: center;">
          <span style="width: 150px; display: inline-block;">NO. OF HOUSEHOLD MEMBERS:</span>
          <span style="border-bottom: 1px solid black; padding-bottom: 1px; display: inline-block; width: 80px; margin-left: 5px; text-align: center;">${householdData.memberCount || members.length || ''}</span>
        </div>
      </div>
      
      <!-- Table -->
      <table style="width: 100%; border-collapse: collapse; border: 1px solid black; font-size: 7px; margin-bottom: 10px;">
        <thead>
          <tr style="border: 1px solid black; background-color: #f0f0f0;">
            <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 10%; text-align: center; font-weight: bold;">LAST NAME</th>
            <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 10%; text-align: center; font-weight: bold;">FIRST NAME</th>
            <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 8%; text-align: center; font-weight: bold;">MIDDLE NAME</th>
            <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 4%; text-align: center; font-weight: bold;">EXT</th>
            <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 10%; text-align: center; font-weight: bold;">PLACE OF BIRTH</th>
            <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 8%; text-align: center; font-weight: bold;">DATE OF BIRTH</th>
            <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 4%; text-align: center; font-weight: bold;">AGE</th>
            <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 4%; text-align: center; font-weight: bold;">SEX</th>
            <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 8%; text-align: center; font-weight: bold;">CIVIL STATUS</th>
            <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 8%; text-align: center; font-weight: bold;">CITIZENSHIP</th>
            <th rowspan="2" style="border: 1px solid black; padding: 2px; width: 10%; text-align: center; font-weight: bold;">OCCUPATION</th>
            <th style="border: 1px solid black; padding: 2px; width: 16%; text-align: center; font-weight: bold;">Indicate if Labor Force Participant: Unemployed, Employed, Underemployed, Out of Labor Force (OLF), Out of School Youth (OSY), Out of School Children (OSC) as of reference date</th>
          </tr>
          <tr style="border: 1px solid black; background-color: #f0f0f0;">
            <th style="border: 1px solid black; padding: 2px; text-align: center; font-weight: bold; font-size: 6px;">STATUS</th>
          </tr>
        </thead>
        <tbody>
          ${generateCompactTableRows(members)}
        </tbody>
      </table>
      
      <!-- Footer Signatures -->
      <div style="margin-top: 15px; display: flex; justify-content: space-between; font-size: 7px;">
        <div style="text-align: center; width: 30%;">
          <div style="margin-bottom: 3px;">Prepared by:</div>
          <div style="margin-top: 25px; border-bottom: 1px solid black; margin-bottom: 3px;"></div>
          <div style="font-size: 6px;">Name of Household/Head Member</div>
          <div style="font-size: 6px;">(Signature over Printed Name)</div>
        </div>
        
        <div style="text-align: center; width: 30%;">
          <div style="margin-bottom: 3px;">Certified Correct:</div>
          <div style="margin-top: 25px; border-bottom: 1px solid black; margin-bottom: 3px;"></div>
          <div style="font-weight: bold; font-size: 6px;">Rowena D. Cresines</div>
          <div style="font-size: 6px;">Barangay Secretary</div>
          <div style="font-size: 6px;">(Signature over Printed Name)</div>
        </div>
        
        <div style="text-align: center; width: 30%;">
          <div style="margin-bottom: 3px;">Validated by:</div>
          <div style="margin-top: 25px; border-bottom: 1px solid black; margin-bottom: 3px;"></div>
          <div style="font-weight: bold; font-size: 6px;">ARMINDO E. LOYOLA</div>
          <div style="font-size: 6px;">Punong Barangay</div>
          <div style="font-size: 6px;">(Signature over Printed Name)</div>
        </div>
      </div>
      
      <!-- Disclaimer -->
      <div style="margin-top: 8px; font-size: 5px; text-align: justify; line-height: 1.2;">
        <p style="margin: 0;">I hereby certify that the above information are true and correct to the best of my knowledge. I understand that for the Barangay to carry out its mandate pursuant to Section 384 (a)(6) of the Local Government Code of 1991, they must necessarily process my personal information for all inhabitants as a tool in planning, and as an updated reference on the number of inhabitants of the Barangay. Therefore, I grant my consent and recognize the authority of the Barangay to process my personal information, subject to the provision of the Philippine Data Privacy Act of 2012.</p>
      </div>
    </div>
  `;
};

// Simple print using browser's print functionality (optimized for one page)
export const printHouseholdForm = (householdData) => {
  const printWindow = window.open('', '_blank');
  const formHTML = createRBIFormTemplate(householdData);
  
  const htmlContent = `<!DOCTYPE html>
    <html>
    <head>
      <title>RBI Form A - ${householdData.householdId}</title>
      <style>
        @page {
          size: A4 landscape;
          margin: 0.3in;
        }
        @media print {
          body { 
            margin: 0; 
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
        }
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
      </style>
    </head>
    <body>
      ${formHTML}
    </body>
    </html>`;
  
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.focus();
  // Wait a bit for content to load, then print
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};
