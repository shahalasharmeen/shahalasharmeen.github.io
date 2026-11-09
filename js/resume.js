/**
 * Resume Page Specific Interactivity
 * Features: Print Mode Trigger, ATS Text Excerpt Copy, Dynamic Highlights
 */

$(document).ready(function () {
  'use strict';

  // Trigger Print Dialog (Uses print.css)
  $('#btn-print-resume').on('click', function (e) {
    e.preventDefault();
    window.print();
  });

  // Copy Clean ATS-friendly Summary
  $('#btn-copy-ats').on('click', function (e) {
    e.preventDefault();
    const atsText = `
SAHLA SHARMEEN E.K
Computer Science Engineering Student
Email: sahlasharmeen@email.com | Phone: +91 9946753050
Location: Bendichal North, Kasaragod
LinkedIn: https://linkedin.com/in/shahalasharmeen | GitHub: https://github.com/shahalasharmeen

EDUCATION:
- Bachelor of Computer Science Engineering (CSE), PA College of Engineering
  CGPA: 8.9 | Class of 2024

TECHNICAL SKILLS:
- Languages & Core: Python, C, Java, Web Development, UI/UX Design, SQL, Operating Software
- Tools & Platforms: Scratch, Salesforce, PowerPoint
- Professional Competencies: Statistics, Creative Problem Solving, Team Leadership

FEATURED PROJECTS:
1. Footstep Power Generation Using Arduino (Role: Team Member, 2024)
2. ComedKares RC Car Using Arduino Workshop (Role: Leader, 2024)
3. Volunteer Program Tracker Using Salesforce (Role: Leader, 2026)
4. Muscle Flex Detection & IoT Monitoring System using EMG Sensor
5. Drone Using ESP32 & Cooking Recipe Portal

CERTIFICATIONS:
- Salesforce Essentials and CRM Foundations
- NPTEL - Artificial Intelligence for Economics
- ComedKares RC Car Workshop Certification
- Cisco Networking Basics
    `.trim();

    if (navigator.clipboard) {
      navigator.clipboard.writeText(atsText).then(() => {
        if (window.showToast) {
          window.showToast('ATS Plain-Text Resume copied to clipboard!');
        }
      });
    }
  });

  // Interactive Skill Filter on Resume
  $('.skill-tag').on('mouseenter', function() {
    $(this).addClass('highlight');
  }).on('mouseleave', function() {
    $(this).removeClass('highlight');
  });
});
