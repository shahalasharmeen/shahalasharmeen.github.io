/**
 * Resume Page Controller - Pure Vanilla JS
 * ATS-plain text copy and physical print trigger
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const printBtn = document.getElementById('btn-print-resume');
  const copyAtsBtn = document.getElementById('btn-copy-ats');

  if (printBtn) {
    printBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.print();
    });
  }

  if (copyAtsBtn) {
    copyAtsBtn.addEventListener('click', function (e) {
      e.preventDefault();

      const atsSummary = `SAHLA SHARMEEN E.K
Computer Science & Embedded Systems Engineer
Email: sahlasharmeen@email.com | Phone: +91 9946753050
Location: Bendichal North, Kasaragod, Kerala, India
LinkedIn: https://linkedin.com/in/shahalasharmeen | GitHub: https://github.com/shahalasharmeen

EDUCATION:
- Bachelor of Computer Science Engineering (CSE), P.A. College of Engineering (VTU Affiliated)
  CGPA: 8.9 | Class of 2024
- Pre-University Course (PCMB), Apsara Public School, Kasaragod (2023)
- Secondary Schooling (SSLC / 10th), Apsara Public School, Kasaragod (2021)

TECHNICAL PROFICIENCIES:
- Languages & Core: Python, C, Java, Modern JavaScript (ES6+), SQL, HTML5/CSS3
- Systems & IoT: Arduino Uno, ESP32, Piezoelectric Harvesting, EMG Biomedical Sensors, HC-05 Bluetooth
- Cloud & Platforms: Salesforce CRM (Objects, Flow Automation, Data Modeling)
- Design & Visual: Figma (Tokens, Wireframing, Layouts), UI/UX Architecture

KEY ENGINEERING PROJECTS:
1. Footstep Power Generation Using Arduino (Piezoelectric energy harvesting, bridge rectifiers, LCD telemetry)
2. ComedKares RC Car Using Arduino Workshop (Team Leader, motor shield PWM, obstacle navigation)
3. Volunteer Program Tracker Using Salesforce (Custom objects, automated approval workflows, reporting)
4. Muscle Flex Detection & IoT Monitoring System (Biomedical EMG filtering, telemetry alert system)
5. Drone Using ESP32 & Stabilization (Wireless telemetry, gyroscopic balance, motor control)
6. Culinary Recipe Platform (Dynamic front-end web portal with taxonomy search and filtering)

CERTIFICATIONS:
- Salesforce Essentials & CRM Foundations
- NPTEL - Artificial Intelligence for Economics
- ComedKares RC Car Workshop Certification
- Cisco Networking Basics`;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(atsSummary.trim()).then(() => {
          if (window.showToast) {
            window.showToast('ATS Plain-Text Resume copied to clipboard!');
          }
        });
      }
    });
  }
});
