/**
 * Sahla Sharmeen E.K - Core Portfolio Interactivity
 * Pure Vanilla JS: Mobile Navigation, Telemetry Console Tabs, Toast Feedback
 * Conforming to Emil Kowalski snappiness and Hallmark accessibility.
 */

(function () {
  'use strict';

  // 1. Mobile Navigation Drawer
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileClose = document.getElementById('mobile-drawer-close');

  function openDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.add('is-open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.remove('is-open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', openDrawer);
  }

  if (mobileClose) {
    mobileClose.addEventListener('click', closeDrawer);
  }

  if (mobileDrawer) {
    mobileDrawer.addEventListener('click', function (e) {
      if (e.target === mobileDrawer) {
        closeDrawer();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeDrawer();
    }
  });

  // 2. Interactive Systems Workbench Tabs (Taste-Skill Dealt Moment)
  const tabButtons = document.querySelectorAll('.workbench-tab');
  const codePanels = document.querySelectorAll('.workbench-code-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', function () {
      const targetId = this.getAttribute('data-target');
      
      tabButtons.forEach(btn => btn.classList.remove('active'));
      codePanels.forEach(panel => panel.style.display = 'none');

      this.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.style.display = 'block';
      }
    });
  });

  // 3. Lightweight Toast Notification Functionality
  window.showToast = function (message, duration = 3200) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-emerald)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    // Trigger enter animation (Emil Kowalski spring)
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Remove toast after duration
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  };
})();
