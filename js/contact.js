/**
 * Contact Form Interactive Validation & Handling - jQuery
 */

$(document).ready(function () {
  'use strict';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  $('#contact-form').on('submit', function (e) {
    e.preventDefault();

    let isValid = true;

    // Name Validation
    const $name = $('#contact-name');
    if ($name.val().trim().length < 2) {
      $name.addClass('is-invalid');
      $name.siblings('.form-error-feedback').text('Please enter your name (at least 2 characters).').show();
      isValid = false;
    } else {
      $name.removeClass('is-invalid');
      $name.siblings('.form-error-feedback').hide();
    }

    // Email Validation
    const $email = $('#contact-email');
    if (!emailRegex.test($email.val().trim())) {
      $email.addClass('is-invalid');
      $email.siblings('.form-error-feedback').text('Please enter a valid email address.').show();
      isValid = false;
    } else {
      $email.removeClass('is-invalid');
      $email.siblings('.form-error-feedback').hide();
    }

    // Subject Validation
    const $subject = $('#contact-subject');
    if ($subject.val().trim().length < 3) {
      $subject.addClass('is-invalid');
      $subject.siblings('.form-error-feedback').text('Please enter a subject (at least 3 characters).').show();
      isValid = false;
    } else {
      $subject.removeClass('is-invalid');
      $subject.siblings('.form-error-feedback').hide();
    }

    // Message Validation
    const $message = $('#contact-message');
    if ($message.val().trim().length < 10) {
      $message.addClass('is-invalid');
      $message.siblings('.form-error-feedback').text('Please enter a message (at least 10 characters).').show();
      isValid = false;
    } else {
      $message.removeClass('is-invalid');
      $message.siblings('.form-error-feedback').hide();
    }

    if (isValid) {
      const $submitBtn = $('#btn-submit-contact');
      const originalText = $submitBtn.html();

      // Show sending state
      $submitBtn.prop('disabled', true).html(`
        <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg> Sending...
      `);

      setTimeout(function () {
        $submitBtn.prop('disabled', false).html(originalText);
        $('#contact-form')[0].reset();
        
        // Show success alert in card
        $('#contact-success-alert').slideDown(300);
        setTimeout(function() {
          $('#contact-success-alert').slideUp(300);
        }, 6000);

        if (window.showToast) {
          window.showToast('Thank you! Your message has been sent successfully.');
        }
      }, 1200);
    }
  });

  // Real-time input clearing of error states
  $('.form-control').on('input', function () {
    if ($(this).hasClass('is-invalid')) {
      $(this).removeClass('is-invalid');
      $(this).siblings('.form-error-feedback').hide();
    }
  });
});
