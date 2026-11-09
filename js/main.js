/**
 * Main Global JavaScript - Inspired by Redoyanul Haque Portfolio
 * Features:
 * - Redoyan Interactive Glowing Cursor Follower
 * - Instant Zero-Lag Page Switching (PJAX + Prefetch)
 * - Timeline Animations & Interactive Hover Rolls
 * - Project Filtering & Contact Form Validation
 */

$(document).ready(function () {
  'use strict';

  // 1. Redoyan Signature Glowing Follower Cursor
  const $cursor = $('#cursor-follower');
  if ($cursor.length && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = -100, mouseY = -100;
    let cursorX = -100, cursorY = -100;

    $(window).on('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function renderCursor() {
      // Smooth interpolation for natural lagging inertia
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      $cursor.css('transform', `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`);
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Cursor hover expansion on links, cards, buttons
    $(document).on('mouseenter', 'a, button, .myworks-card, .techstack-card', function () {
      $cursor.css({
        width: '64px',
        height: '64px',
        opacity: '0.8'
      });
    }).on('mouseleave', 'a, button, .myworks-card, .techstack-card', function () {
      $cursor.css({
        width: '44px',
        height: '44px',
        opacity: '1'
      });
    });
  }

  // 2. Mobile Menu Toggle
  $('#mobile-menu-btn').on('click', function () {
    const $nav = $('#main-navigation');
    const isOpen = $nav.hasClass('is-open');
    if (isOpen) {
      $nav.removeClass('is-open');
      $(this).attr('aria-expanded', 'false');
    } else {
      $nav.addClass('is-open');
      $(this).attr('aria-expanded', 'true');
    }
  });

  $(document).on('click', function (e) {
    if (!$(e.target).closest('.site-header').length) {
      $('#main-navigation').removeClass('is-open');
      $('#mobile-menu-btn').attr('aria-expanded', 'false');
    }
  });

  // 3. Global Toast Notifications
  window.showToast = function (message) {
    let $toast = $('#global-toast');
    if (!$toast.length) {
      $('body').append(`
        <div id="global-toast" class="toast-notification" role="status" aria-live="polite">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accentColor)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
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
    }, 3000);
  };

  // 4. Update Navigation Active State
  function updateActiveNav(path) {
    const filename = (path || window.location.pathname).split('/').pop() || 'index.html';
    $('.hover-link').each(function () {
      const href = $(this).attr('href');
      if (href === filename || (filename === '' && href === 'index.html')) {
        $(this).addClass('active');
      } else {
        $(this).removeClass('active');
      }
    });
  }

  // 5. In-Memory Prefetch & Zero-Delay PJAX Page Switcher
  const pageCache = {};
  const sitePages = ['index.html', 'resume.html', 'biodata.html', 'projects.html', 'contact.html'];

  function prefetchPages() {
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
  setTimeout(prefetchPages, 80);

  function loadPage(url, pushState) {
    const filename = url.split('/').pop() || 'index.html';
    const $main = $('#main-content');

    $main.addClass('page-fading-out');
    $('#main-navigation').removeClass('is-open');

    function render(html) {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newTitle = doc.querySelector('title') ? doc.querySelector('title').innerText : document.title;
        const newMain = doc.querySelector('#main-content');

        if (newMain) {
          document.title = newTitle;
          $main.html(newMain.innerHTML);

          if (newMain.className) {
            $main.attr('class', newMain.className);
          }

          window.scrollTo({ top: 0, behavior: 'instant' });

          if (pushState) {
            history.pushState({ path: url }, newTitle, url);
          }

          updateActiveNav(filename);
          bindPageInteractions();

          setTimeout(function () {
            $main.removeClass('page-fading-out').addClass('page-fading-in');
            setTimeout(() => $main.removeClass('page-fading-in'), 150);
          }, 30);
          return;
        }
      } catch (e) {
        console.error('Page render error:', e);
      }
      window.location.href = url;
    }

    if (pageCache[filename]) {
      render(pageCache[filename]);
    } else {
      fetch(url)
        .then(res => res.text())
        .then(html => {
          pageCache[filename] = html;
          render(html);
        })
        .catch(() => {
          window.location.href = url;
        });
    }
  }

  // Intercept internal links for seamless navigation
  $(document).on('click', 'a', function (e) {
    const href = $(this).attr('href');
    if (!href) return;

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

    const clean = href.split('?')[0].split('#')[0];
    if (sitePages.includes(clean) || clean === './' || clean === '') {
      e.preventDefault();
      loadPage(href, true);
    }
  });

  window.addEventListener('popstate', function () {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    loadPage(path, false);
  });

  // 6. Page-Specific Dynamic Interactions
  function bindPageInteractions() {
    // Copy buttons
    $('.btn-copy').off('click').on('click', function (e) {
      e.preventDefault();
      const text = $(this).data('copy-text') || $(this).text().trim();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(`Copied: ${text}`);
        });
      } else {
        showToast('Copied to clipboard!');
      }
    });

    // Resume print
    $('#btn-print-resume').off('click').on('click', function (e) {
      e.preventDefault();
      window.print();
    });

    // Copy ATS
    $('#btn-copy-ats').off('click').on('click', function (e) {
      e.preventDefault();
      const ats = `
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
- Tools: Scratch, Salesforce, PowerPoint, Arduino IDE
- Analytical: Statistics, Creative Skills, Communication, Teamwork, Problem Solving

PROJECTS:
1. Footstep Power Generation Using Arduino (2024, Team Member)
2. Volunteer Program Tracker Using Salesforce (2026, Leader)
3. ComedKares RC Car Workshop (2024, Leader)
4. Muscle Flex Detection System (EMG Sensor)
5. Cooking Recipe Portal, Automated Irrigation System, Drone Using ESP32
      `.trim();

      if (navigator.clipboard) {
        navigator.clipboard.writeText(ats).then(() => {
          showToast('ATS Plain-Text Resume copied!');
        });
      }
    });

    // Project filters
    $('.filter-btn').off('click').on('click', function () {
      const f = $(this).data('filter');
      $('.filter-btn').removeClass('active');
      $(this).addClass('active');

      if (f === 'all') {
        $('.project-card-wrapper').fadeIn(150);
      } else {
        $('.project-card-wrapper').hide();
        $(`.project-card-wrapper[data-category*="${f}"]`).fadeIn(180);
      }

      const count = f === 'all' 
        ? $('.project-card-wrapper').length 
        : $(`.project-card-wrapper[data-category*="${f}"]`).length;
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

    // Contact form validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    $('#contact-form').off('submit').on('submit', function (e) {
      e.preventDefault();
      let ok = true;

      const $name = $('#contact-name');
      if ($name.val().trim().length < 2) {
        $name.addClass('is-invalid');
        $name.siblings('.form-error-feedback').text('Please enter your name.').show();
        ok = false;
      } else {
        $name.removeClass('is-invalid');
        $name.siblings('.form-error-feedback').hide();
      }

      const $email = $('#contact-email');
      if (!emailRegex.test($email.val().trim())) {
        $email.addClass('is-invalid');
        $email.siblings('.form-error-feedback').text('Please enter a valid email.').show();
        ok = false;
      } else {
        $email.removeClass('is-invalid');
        $email.siblings('.form-error-feedback').hide();
      }

      const $msg = $('#contact-message');
      if ($msg.val().trim().length < 10) {
        $msg.addClass('is-invalid');
        $msg.siblings('.form-error-feedback').text('Message must be at least 10 characters.').show();
        ok = false;
      } else {
        $msg.removeClass('is-invalid');
        $msg.siblings('.form-error-feedback').hide();
      }

      if (ok) {
        const $btn = $('#btn-submit-contact');
        $btn.prop('disabled', true).text('Transmitting...');

        setTimeout(function () {
          $btn.prop('disabled', false).text('Transmit Message');
          $('#contact-form')[0].reset();
          $('#contact-success-alert').slideDown(250);
          setTimeout(() => $('#contact-success-alert').slideUp(250), 6000);
          showToast('Message transmitted successfully!');
        }, 750);
      }
    });
  }

  // Initial bindings
  updateActiveNav();
  bindPageInteractions();
  $('#current-year').text(new Date().getFullYear());
});
