/**
 * Contact Page Controller - Pure Vanilla JS
 * Inline field validation and feedback
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const form = document.getElementById('contact-form');
  const successAlert = document.getElementById('contact-success-alert');

  if (!form) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let isValid = true;

    // Name
    const nameInput = document.getElementById('contact-name');
    const nameError = document.getElementById('name-error');
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      if (nameError) nameError.textContent = 'Please enter your name (at least 2 characters).';
      nameInput.classList.add('is-invalid');
      isValid = false;
    } else {
      if (nameError) nameError.textContent = '';
      nameInput.classList.remove('is-invalid');
    }

    // Email
    const emailInput = document.getElementById('contact-email');
    const emailError = document.getElementById('email-error');
    if (!emailRegex.test(emailInput.value.trim())) {
      if (emailError) emailError.textContent = 'Please enter a valid email address.';
      emailInput.classList.add('is-invalid');
      isValid = false;
    } else {
      if (emailError) emailError.textContent = '';
      emailInput.classList.remove('is-invalid');
    }

    // Subject
    const subjectInput = document.getElementById('contact-subject');
    const subjectError = document.getElementById('subject-error');
    if (!subjectInput.value.trim() || subjectInput.value.trim().length < 3) {
      if (subjectError) subjectError.textContent = 'Please enter a subject.';
      subjectInput.classList.add('is-invalid');
      isValid = false;
    } else {
      if (subjectError) subjectError.textContent = '';
      subjectInput.classList.remove('is-invalid');
    }

    // Message
    const msgInput = document.getElementById('contact-message');
    const msgError = document.getElementById('message-error');
    if (!msgInput.value.trim() || msgInput.value.trim().length < 10) {
      if (msgError) msgError.textContent = 'Please enter a message (at least 10 characters).';
      msgInput.classList.add('is-invalid');
      isValid = false;
    } else {
      if (msgError) msgError.textContent = '';
      msgInput.classList.remove('is-invalid');
    }

    if (isValid) {
      const submitBtn = document.getElementById('btn-submit-contact');
      const originalText = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Message...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        form.reset();

        if (successAlert) {
          successAlert.style.display = 'block';
          setTimeout(() => {
            successAlert.style.display = 'none';
          }, 6000);
        }

        if (window.showToast) {
          window.showToast('Your message has been sent successfully!');
        }
      }, 900);
    }
  });

  // Clear errors on input
  form.querySelectorAll('.form-input, .form-textarea').forEach(input => {
    input.addEventListener('input', function () {
      this.classList.remove('is-invalid');
      const err = this.parentElement.querySelector('.form-error-feedback');
      if (err) err.textContent = '';
    });
  });
});
