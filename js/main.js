/**
 * Main Client JavaScript - Sahla Sharmeen E.K Engineering Portfolio
 * Built on Emil Kowalski Physics & Hallmark Standards
 * Dependency-free modern Vanilla ES6+
 */

(function () {
  'use strict';

  // 1. Toast Notification System (Emil Kowalski Sonner Principle)
  window.showToast = function (message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.setAttribute('role', 'status');
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-item';
    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    
    // Trigger animation in next frame
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3200);
  };

  // 2. Mobile Navigation Controller
  function initMobileNav() {
    const toggleBtn = document.getElementById('mobileMenuToggle');
    const drawer = document.getElementById('mobileNavDrawer');
    if (!toggleBtn || !drawer) return;

    function openNav() {
      toggleBtn.setAttribute('aria-expanded', 'true');
      drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeNav() {
      toggleBtn.setAttribute('aria-expanded', 'false');
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = drawer.classList.contains('open');
      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });

    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeNav();
      }
    });
  }

  // 3. Smooth Anchor Scrolling
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || !targetId) return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // 4. Project Category Filtering & Search
  function initProjectFilters() {
    const searchInput = document.getElementById('projectSearch');
    const filterButtons = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.work-card');
    const countDisplay = document.getElementById('projectCount');

    if (!projectCards.length) return;

    let activeFilter = 'all';

    function applyFilter() {
      const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
      let matchCount = 0;

      projectCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const category = card.getAttribute('data-category') || 'all';

        const matchesQuery = !query || text.includes(query);
        const matchesCategory = activeFilter === 'all' || category.includes(activeFilter);

        if (matchesQuery && matchesCategory) {
          card.style.display = '';
          matchCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (countDisplay) {
        countDisplay.textContent = `Showing ${matchCount} of ${projectCards.length} systems`;
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', applyFilter);
    }

    filterButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        filterButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        activeFilter = this.getAttribute('data-filter') || 'all';
        applyFilter();
      });
    });
  }

  // 5. Copy Actions & Resume ATS Generator
  function initClipboardActions() {
    // Copy buttons
    document.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const text = this.getAttribute('data-copy');
        if (text && navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => {
            window.showToast(`Copied "${text}" to clipboard`);
          }).catch(() => {
            window.showToast('Failed to copy to clipboard');
          });
        }
      });
    });

    // ATS Resume copy button
    const atsBtn = document.getElementById('btnCopyAts');
    if (atsBtn) {
      atsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const atsText = `SAHLA SHARMEEN E.K
Computer Science Engineer
Location: Kasaragod, Kerala, India | Email: sahlasharmeen@email.com | Phone: +91 9946753050
LinkedIn: https://linkedin.com/in/shahalasharmeen | GitHub: https://github.com/shahalasharmeen

EDUCATION
- Bachelor of Engineering (B.E) in Computer Science & Engineering
  P.A. College of Engineering, Mangalore (Affiliated to VTU Belagavi)
  CGPA: 8.9 / 10.0 | Class of 2024
- Pre-University Course (PCMB) | Apsara Public School, Kasaragod (2023)
- Secondary Schooling (SSLC 10th) | Apsara Public School, Kasaragod (2021)

TECHNICAL SKILLS
- Languages: Python, C, Java, JavaScript (ES6+), Embedded C, SQL
- Hardware & Embedded: Arduino Uno, ESP32, Piezoelectric Transducers, EMG Sensors, HC-05 Bluetooth, Motor Drivers
- Cloud & Frameworks: Salesforce CRM, Flow Automation, HTML5, CSS3, REST APIs, Git & GitHub

KEY ENGINEERING PROJECTS
1. Footstep Power Generation using Piezoelectric Sensors & Arduino (2024)
   Kinetic energy harvesting system converting footstep pressure via PZT tile array into regulated DC charge with Arduino telemetry.
2. ComedKares RC Car Workshop Rover (2024)
   Team Lead. 4-wheel mobile rover with HC-05 Bluetooth serial protocol, obstacle arbitration, and Arduino PWM drive routines.
3. Volunteer Program CRM Platform (2026)
   Salesforce cloud architecture with custom data objects, automated approval workflows, and analytical dashboards.
4. EMG Sensor Muscle Flex & Biometric IoT Monitor
   Biomedical interface capturing electromyographic signals during flexion with thresholded serial telemetry.
5. ESP32 Autonomous Flight Telemetry Drone
   Micro-controller UAV flight experiments with Wi-Fi UDP packet broadcast.

CERTIFICATIONS
- Salesforce Essentials & CRM Foundations
- NPTEL - Artificial Intelligence for Economics
- ComedKares RC Car Workshop Certification
- Cisco Networking Basics`;

        if (navigator.clipboard) {
          navigator.clipboard.writeText(atsText).then(() => {
            window.showToast('ATS Plain-Text Resume copied to clipboard!');
          });
        }
      });
    }

    // Print button
    const printBtn = document.getElementById('btnPrintResume');
    if (printBtn) {
      printBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.print();
      });
    }
  }

  // 6. Interactive Contact Form
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('contactName');
      const email = document.getElementById('contactEmail');
      const message = document.getElementById('contactMessage');
      const submitBtn = form.querySelector('button[type="submit"]');

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        window.showToast('Please fill out all required fields.');
        return;
      }

      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Transmitting...';

      setTimeout(() => {
        window.showToast(`Thank you, ${name.value.trim()}! Message dispatched successfully.`);
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }, 1000);
    });
  }

  // DOM Content Loaded Initializer
  document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initSmoothScroll();
    initProjectFilters();
    initClipboardActions();
    initContactForm();
  });
})();
