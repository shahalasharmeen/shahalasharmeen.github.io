/**
 * Main Global JavaScript - Redoyanul Haque Inspired Portfolio
 * Features:
 * - Signature Follower Glowing Cursor
 * - Zero-Lag In-Memory PJAX Page Transition (Eliminates White Flash)
 * - Smooth Anchor Scrolling
 * - Interactive Project Live Search & Category Filtering
 * - Copy to Clipboard & Toast Notifications
 * - ATS Plaintext Resume Generator & Print Trigger
 * - GSAP ScrollTrigger Vertical Career Timeline Animation
 */

$(document).ready(function () {
  'use strict';

  // 1. Redoyan Signature Glowing Follower Cursor
  const $cursor = $('#cursor-main');
  if ($cursor.length && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = -100, mouseY = -100;
    let cursorX = -100, cursorY = -100;

    $(window).on('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function renderCursor() {
      cursorX += (mouseX - cursorX) * 0.22;
      cursorY += (mouseY - cursorY) * 0.22;
      $cursor.css('transform', `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`);
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    $(document).on('mouseenter', 'a, button, .work-box, .myworks-card, .techstack-item, .what-content', function () {
      $cursor.addClass('cursor-hover');
    }).on('mouseleave', 'a, button, .work-box, .myworks-card, .techstack-item, .what-content', function () {
      $cursor.removeClass('cursor-hover');
    });

    $(document).on('mouseenter', '[data-cursor="disable"]', function () {
      $cursor.addClass('cursor-disable');
    }).on('mouseleave', '[data-cursor="disable"]', function () {
      $cursor.removeClass('cursor-disable');
    });
  }

  // 2. Global Toast Notification System
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
    }, 3200);
  };

  // 3. Update Active Link in Navigation
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

  // 4. In-Memory Prefetch & Zero-Delay PJAX Page Switcher
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
  // Prefetch immediately after initial render
  setTimeout(prefetchPages, 100);

  function loadPage(url, pushState) {
    const filename = url.split('/').pop() || 'index.html';
    const $main = $('#main-content');

    $main.addClass('page-fading-out');

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

          if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
          }

          setTimeout(function () {
            $main.removeClass('page-fading-out').addClass('page-fading-in');
            setTimeout(() => $main.removeClass('page-fading-in'), 150);
          }, 20);
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

  // Intercept internal page link clicks
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
    if (sitePages.includes(clean)) {
      e.preventDefault();
      loadPage(href, true);
    }
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', function (e) {
    if (e.state && e.state.path) {
      loadPage(e.state.path, false);
    } else {
      loadPage(window.location.pathname.split('/').pop() || 'index.html', false);
    }
  });

  // 4b. Mobile Navigation Drawer Controller
  function closeMobileNav() {
    $('#mobileMenuBtn').removeClass('open').attr('aria-expanded', 'false');
    $('#mobileNavDrawer').removeClass('open').attr('aria-hidden', 'true');
    $('body').removeClass('no-scroll');
  }

  $(document).on('click', '#mobileMenuBtn', function (e) {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = $(this).hasClass('open');
    if (isOpen) {
      closeMobileNav();
    } else {
      $(this).addClass('open').attr('aria-expanded', 'true');
      $('#mobileNavDrawer').addClass('open').attr('aria-hidden', 'false');
      $('body').addClass('no-scroll');
    }
  });

  $(document).on('click', '#mobileNavDrawer a', function () {
    closeMobileNav();
  });

  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $('#mobileNavDrawer').hasClass('open')) {
      closeMobileNav();
    }
  });

  // 5. Smooth Anchor Scrolling for on-page sections
  $(document).on('click', 'a[href^="#"]', function (e) {
    const target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      closeMobileNav();
      $('html, body').stop().animate({
        scrollTop: target.offset().top - 90
      }, 600);
    }
  });

  // 6. Dynamic Bindings for Interactive Features & Timeline
  function bindPageInteractions() {
    
    // Timeline ScrollTrigger Animation (Redoyan signature)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      if ($('.career-section').length) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.career-section',
            start: 'top 65%',
            end: 'bottom 35%',
            scrub: 1.5,
            invalidateOnRefresh: true
          }
        });

        tl.fromTo('.career-timeline', 
          { maxHeight: '0%', opacity: 0 }, 
          { maxHeight: '100%', opacity: 1, duration: 1, ease: 'none' }, 
          0
        )
        .fromTo('.career-dot',
          { top: '0%' },
          { top: '100%', duration: 1, ease: 'none' },
          0
        )
        .fromTo('.career-info-box', 
          { opacity: 0, y: 25 }, 
          { opacity: 1, y: 0, stagger: 0.12, duration: 0.5, ease: 'power2.out' }, 
          0
        );
      }
    } else {
      // Fallback if GSAP is not yet ready: reveal timeline items directly
      $('.career-timeline').css({ 'max-height': '100%', 'opacity': 1 });
      $('.career-info-box').css({ 'opacity': 1, 'transform': 'none' });
    }

    // Copy button handlers
    $('.btn-copy').off('click').on('click', function (e) {
      e.preventDefault();
      const textToCopy = $(this).attr('data-copy-text');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(function () {
          window.showToast(`Copied "${textToCopy}" to clipboard!`);
        }).catch(function () {
          window.showToast('Unable to copy to clipboard.');
        });
      }
    });

    // ATS Resume Plain Text copy (Class of 2024 updated)
    $('#btn-copy-ats').off('click').on('click', function () {
      const atsText = `SAHLA SHARMEEN E.K
Kasaragod, Kerala, India | Email: shahalasharmeen@gmail.com
LinkedIn: https://linkedin.com/in/sahla-sharmeen | GitHub: https://github.com/shahalasharmeen

PROFESSIONAL SUMMARY
Computer Science Engineer graduate (Class of 2024) from P.A. College of Engineering (CGPA: 8.9) with active development experience in IoT hardware, embedded systems, Python, C, Java, and modern web applications.

EDUCATION
- B.E in Computer Science & Engineering | P.A. College of Engineering, Mangalore (Class of 2024) | CGPA: 8.9
- Pre-University Course (PCMB) | Apsara Public School, Kasaragod (2023)
- Secondary Schooling (SSLC / 10th) | Apsara Public School, Kasaragod (2021)

TECHNICAL SKILLS
- Programming Languages: Python, C, Java, JavaScript, Embedded C
- Web Technologies: HTML5, CSS3, jQuery, Responsive UI/UX Design
- Hardware & IoT: Arduino Uno, Raspberry Pi, ESP8266, Piezoelectric Sensors, HC-05 Bluetooth, Motor Drivers
- Cloud & Platforms: Salesforce CRM, Git, GitHub, Linux, VS Code, Figma, MS Office

KEY PROJECTS
- Footstep Power Generation (2024): Energy harvesting tile prototype with piezoelectric sensor array and LCD output.
- Salesforce Volunteer Tracker (2026): Cloud volunteer coordination app with automated flows and custom schema.
- Smartphone Bluetooth RC Car (2024): ComedKares robotics prototype with Arduino and mobile control.
- EMG Biomedical Health Sensor: Muscle signal acquisition filter and real-time biometric thresholding.
- Smart Recipe Finder: Responsive web application with dietary filtering and dynamic recipe matching.`;

      navigator.clipboard.writeText(atsText).then(function () {
        window.showToast('ATS Plaintext Resume copied to clipboard!');
      }).catch(function () {
        window.showToast('Unable to copy resume text.');
      });
    });

    // Print button handler
    $('#btn-print-resume').off('click').on('click', function () {
      window.print();
    });

    // Project live search & filter
    const $searchInput = $('#project-search-input');
    const $filterBtns = $('.filter-btn');
    const $cards = $('.myworks-card');

    function applyProjectFilter() {
      const term = ($searchInput.val() || '').toLowerCase().trim();
      const activeCategory = $('.filter-btn.active').attr('data-filter') || 'all';

      let matchCount = 0;
      $cards.each(function () {
        const text = $(this).text().toLowerCase();
        const cat = $(this).attr('data-category') || 'all';

        const matchesSearch = !term || text.includes(term);
        const matchesCat = activeCategory === 'all' || cat.includes(activeCategory);

        if (matchesSearch && matchesCat) {
          $(this).fadeIn(200);
          matchCount++;
        } else {
          $(this).fadeOut(150);
        }
      });

      $('#project-result-count').text(`Showing ${matchCount} of ${$cards.length} projects`);
    }

    $searchInput.off('input').on('input', applyProjectFilter);
    $filterBtns.off('click').on('click', function () {
      $filterBtns.removeClass('active');
      $(this).addClass('active');
      applyProjectFilter();
    });

    // Contact form submission simulation
    $('#contact-form').off('submit').on('submit', function (e) {
      e.preventDefault();
      const name = $('#contact-name').val();
      const email = $('#contact-email').val();
      const msg = $('#contact-message').val();

      if (!name || !email || !msg) {
        window.showToast('Please fill out all required fields.');
        return;
      }

      const $submitBtn = $(this).find('button[type="submit"]');
      $submitBtn.prop('disabled', true).text('Sending message...');

      setTimeout(function () {
        window.showToast(`Thank you, ${name}! Your message has been received.`);
        $('#contact-form')[0].reset();
        $submitBtn.prop('disabled', false).text('Send Message');
      }, 900);
    });
  }

  // Initial bindings on page load
  updateActiveNav();
  bindPageInteractions();
});
