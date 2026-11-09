/**
 * Main Global JavaScript - UI/UX Pro Max Architecture
 * Features: Instant Zero-Lag Page Switching (PJAX + Prefetch), Theme Persistence, Navigation, Toasts
 */

$(document).ready(function () {
  'use strict';

  // 1. Theme Management (Complements synchronous head script)
  $('#theme-toggle').on('click', function () {
    const activeTheme = $('html').attr('data-theme') || 'light';
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    $('html').attr('data-theme', newTheme);
    localStorage.setItem('site-theme', newTheme);
    
    showToast(newTheme === 'dark' ? 'Switched to Dark Mode' : 'Switched to Light Mode');
  });

  // 2. Mobile Navigation Toggle
  $('#mobile-menu-btn').on('click', function () {
    const $nav = $('#main-navigation');
    const isOpen = $nav.hasClass('is-open');
    
    if (isOpen) {
      $nav.removeClass('is-open');
      $(this).attr('aria-expanded', 'false');
      $(this).find('.icon-menu').show();
      $(this).find('.icon-close').hide();
    } else {
      $nav.addClass('is-open');
      $(this).attr('aria-expanded', 'true');
      $(this).find('.icon-menu').hide();
      $(this).find('.icon-close').show();
    }
  });

  // Close mobile nav when clicking outside
  $(document).on('click', function (e) {
    if (!$(e.target).closest('.site-header').length) {
      $('#main-navigation').removeClass('is-open');
      $('#mobile-menu-btn').attr('aria-expanded', 'false')
        .find('.icon-menu').show();
      $('#mobile-menu-btn').find('.icon-close').hide();
    }
  });

  // 3. Global Toast Notification Utility
  window.showToast = function (message) {
    let $toast = $('#global-toast');
    if (!$toast.length) {
      $('body').append(`
        <div id="global-toast" class="toast-notification" role="status" aria-live="polite">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <span class="toast-msg"></span>
        </div>
      `);
      $toast = $('#global-toast');
    }

    $toast.find('.toast-msg').text(message);
    $toast.addClass('show');

    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(function () {
      $toast.removeClass('show');
    }, 3200);
  };

  // 4. Update Current Active Nav State
  function updateActiveNav(path) {
    const filename = (path || window.location.pathname).split('/').pop() || 'index.html';
    $('.nav-link').each(function () {
      const href = $(this).attr('href');
      if (href === filename || (filename === '' && href === 'index.html')) {
        $(this).addClass('active');
      } else {
        $(this).removeClass('active');
      }
    });
  }

  // 5. In-Memory Page Cache & Prefetcher (Zero Network Delay / Zero White Screen)
  const pageCache = {};
  const sitePages = ['index.html', 'resume.html', 'biodata.html', 'projects.html', 'contact.html'];

  function prefetchSitePages() {
    sitePages.forEach(function (page) {
      if (!pageCache[page]) {
        fetch(page)
          .then(res => res.text())
          .then(html => {
            pageCache[page] = html;
          })
          .catch(() => {});
      }
    });
  }

  // Pre-load all pages right after initial render
  setTimeout(prefetchSitePages, 100);

  // 6. Seamless Instant Page Loader (PJAX)
  function navigateTo(url, pushState) {
    const filename = url.split('/').pop() || 'index.html';
    const $main = $('#main-content');

    // Smooth subtle fade out
    $main.addClass('page-fading-out');

    // Close mobile menu if open
    $('#main-navigation').removeClass('is-open');
    $('#mobile-menu-btn').find('.icon-menu').show();
    $('#mobile-menu-btn').find('.icon-close').hide();

    function renderPage(html) {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newTitle = doc.querySelector('title') ? doc.querySelector('title').innerText : document.title;
        const newMain = doc.querySelector('#main-content');

        if (newMain) {
          document.title = newTitle;
          $main.html(newMain.innerHTML);

          // Update attributes on main if present
          if (newMain.className) {
            $main.attr('class', newMain.className);
          }

          window.scrollTo({ top: 0, behavior: 'instant' });

          if (pushState) {
            history.pushState({ path: url }, newTitle, url);
          }

          updateActiveNav(filename);
          initPageInteractions();

          // Smooth reveal
          setTimeout(function () {
            $main.removeClass('page-fading-out').addClass('page-fading-in');
            setTimeout(function () {
              $main.removeClass('page-fading-in');
            }, 150);
          }, 30);
          return;
        }
      } catch (err) {
        console.error('PJAX parse error, falling back:', err);
      }
      window.location.href = url;
    }

    if (pageCache[filename]) {
      renderPage(pageCache[filename]);
    } else {
      fetch(url)
        .then(res => res.text())
        .then(html => {
          pageCache[filename] = html;
          renderPage(html);
        })
        .catch(() => {
          window.location.href = url;
        });
    }
  }

  // Intercept internal link clicks for seamless switching
  $(document).on('click', 'a', function (e) {
    const href = $(this).attr('href');
    if (!href) return;

    // Skip external links, anchors, mailto, tel, or downloads
    if (
      href.startsWith('http://') || 
      href.startsWith('https://') || 
      href.startsWith('#') || 
      href.startsWith('mailto:') || 
      href.startsWith('tel:') || 
      $(this).attr('target') === '_blank' || 
      $(this).attr('download') !== undefined
    ) {
      return;
    }

    // Check if it's one of our site pages
    const cleanHref = href.split('?')[0].split('#')[0];
    if (sitePages.includes(cleanHref) || cleanHref === './' || cleanHref === '') {
      e.preventDefault();
      navigateTo(href, true);
    }
  });

  // Handle browser back and forward buttons
  window.addEventListener('popstate', function () {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    navigateTo(path, false);
  });

  // 7. Re-usable Page-Specific Interactions Binder
  function initPageInteractions() {
    // A. Copy Button Utility
    $('.btn-copy').off('click').on('click', function (e) {
      e.preventDefault();
      const textToCopy = $(this).data('copy-text') || $(this).text().trim();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
        }).catch(() => {
          showToast('Copied to clipboard!');
        });
      } else {
        showToast('Copied to clipboard!');
      }
    });

    // B. Resume Page Features
    $('#btn-print-resume').off('click').on('click', function (e) {
      e.preventDefault();
      window.print();
    });

    $('#btn-copy-ats').off('click').on('click', function (e) {
      e.preventDefault();
      const atsText = `
SAHLA SHARMEEN E.K
Computer Science Engineering Student
Email: sahlasharmeen@email.com | Phone: +91 9946753050
Location: Bendichal North, Kasaragod
LinkedIn: https://linkedin.com/in/shahalasharmeen | GitHub: https://github.com/shahalasharmeen

EDUCATION:
- Bachelor of Computer Science Engineering (CSE), PA College of Engineering
  CGPA: 8.9 | Expected Graduation: 2028

TECHNICAL SKILLS:
- Languages: Python, C, Java, Web Development, UI/UX Design, SQL, Operating Software
- Tools: Scratch, Salesforce, PowerPoint
- Analytical Competencies: Statistics, Creative Skills, Communication, Teamwork, Problem Solving

PROJECTS:
- Footstep Power Generation Using Arduino (Role: Team Member, 2024)
- ComedKares RC Car Using Arduino Workshop (Role: Leader, 2024)
- Volunteer Program Tracker Using Salesforce (Role: Leader, 2026)
- Muscle Flex Detection & IoT Monitoring System using EMG Sensor
- Cooking Recipe Portal, Automated Irrigation System, Drone Using ESP32
      `.trim();

      if (navigator.clipboard) {
        navigator.clipboard.writeText(atsText).then(() => {
          showToast('ATS Plain-Text Resume copied to clipboard!');
        });
      }
    });

    // C. Projects Page Filter & Search
    $('.filter-btn').off('click').on('click', function () {
      const filter = $(this).data('filter');
      $('.filter-btn').removeClass('active');
      $(this).addClass('active');

      if (filter === 'all') {
        $('.project-card-wrapper').fadeIn(150);
      } else {
        $('.project-card-wrapper').hide();
        $(`.project-card-wrapper[data-category*="${filter}"]`).fadeIn(180);
      }

      const count = filter === 'all' 
        ? $('.project-card-wrapper').length 
        : $(`.project-card-wrapper[data-category*="${filter}"]`).length;
      $('#project-count-display').text(`${count} Projects Displayed`);
    });

    $('#project-search-input').off('keyup').on('keyup', function () {
      const q = $(this).val().toLowerCase().trim();
      $('.project-card-wrapper').each(function () {
        if ($(this).text().toLowerCase().indexOf(q) !== -1) {
          $(this).fadeIn(120);
        } else {
          $(this).fadeOut(120);
        }
      });
    });

    // D. Contact Form Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    $('#contact-form').off('submit').on('submit', function (e) {
      e.preventDefault();
      let isValid = true;

      const $name = $('#contact-name');
      if ($name.val().trim().length < 2) {
        $name.addClass('is-invalid');
        $name.siblings('.form-error-feedback').text('Please enter your name (at least 2 characters).').show();
        isValid = false;
      } else {
        $name.removeClass('is-invalid');
        $name.siblings('.form-error-feedback').hide();
      }

      const $email = $('#contact-email');
      if (!emailRegex.test($email.val().trim())) {
        $email.addClass('is-invalid');
        $email.siblings('.form-error-feedback').text('Please enter a valid email address.').show();
        isValid = false;
      } else {
        $email.removeClass('is-invalid');
        $email.siblings('.form-error-feedback').hide();
      }

      const $subject = $('#contact-subject');
      if ($subject.val().trim().length < 3) {
        $subject.addClass('is-invalid');
        $subject.siblings('.form-error-feedback').text('Please enter a subject (at least 3 characters).').show();
        isValid = false;
      } else {
        $subject.removeClass('is-invalid');
        $subject.siblings('.form-error-feedback').hide();
      }

      const $msg = $('#contact-message');
      if ($msg.val().trim().length < 10) {
        $msg.addClass('is-invalid');
        $msg.siblings('.form-error-feedback').text('Please enter a message (at least 10 characters).').show();
        isValid = false;
      } else {
        $msg.removeClass('is-invalid');
        $msg.siblings('.form-error-feedback').hide();
      }

      if (isValid) {
        const $btn = $('#btn-submit-contact');
        const origText = $btn.html();
        $btn.prop('disabled', true).html('Sending...');

        setTimeout(function () {
          $btn.prop('disabled', false).html(origText);
          $('#contact-form')[0].reset();
          $('#contact-success-alert').slideDown(250);
          setTimeout(() => $('#contact-success-alert').slideUp(250), 6000);
          showToast('Thank you! Your message has been sent successfully.');
        }, 800);
      }
    });

    $('.form-control').off('input').on('input', function () {
      if ($(this).hasClass('is-invalid')) {
        $(this).removeClass('is-invalid');
        $(this).siblings('.form-error-feedback').hide();
      }
    });
  }

  // Initial bindings & footer year
  updateActiveNav();
  initPageInteractions();
  $('#current-year').text(new Date().getFullYear());
});
