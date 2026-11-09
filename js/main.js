/**
 * Main Global JavaScript - UI/UX Pro Max Architecture
 * Powers Navigation, Dark/Light Themes, Toast Notifications, and Common Interactivity
 */

$(document).ready(function () {
  'use strict';

  // 1. Theme Toggle Management (Light / Dark)
  const currentTheme = localStorage.getItem('site-theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  $('html').attr('data-theme', currentTheme);

  $('#theme-toggle').on('click', function () {
    const activeTheme = $('html').attr('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    $('html').attr('data-theme', newTheme);
    localStorage.setItem('site-theme', newTheme);
    
    showToast(newTheme === 'dark' ? 'Switched to Dark Mode' : 'Switched to Light Mode');
  });

  // 2. Mobile Navigation Menu Toggle
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

  // Close mobile nav when clicking outside or clicking any nav link
  $(document).on('click', function (e) {
    if (!$(e.target).closest('.site-header').length) {
      $('#main-navigation').removeClass('is-open');
      $('#mobile-menu-btn').attr('aria-expanded', 'false')
        .find('.icon-menu').show();
      $('#mobile-menu-btn').find('.icon-close').hide();
    }
  });

  $('.nav-link').on('click', function () {
    $('#main-navigation').removeClass('is-open');
    $('#mobile-menu-btn').find('.icon-menu').show();
    $('#mobile-menu-btn').find('.icon-close').hide();
  });

  // 3. Highlight Current Active Page in Navigation
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  $('.nav-link').each(function () {
    const href = $(this).attr('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      $(this).addClass('active');
    } else {
      $(this).removeClass('active');
    }
  });

  // 4. Update Current Year in Footer
  $('#current-year').text(new Date().getFullYear());

  // 5. Global Toast Notification System
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

  // 6. Copy to Clipboard Utility for emails/phones/links
  $('.btn-copy').on('click', function (e) {
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
});
