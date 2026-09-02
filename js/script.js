/* =========================================================
   UNO AI Technical College — Main JavaScript
   Handles: mobile nav toggle, active link highlighting,
   contact form validation, current year injection.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  initNavToggle();
  setActiveNavLink();
  setCurrentYear();
  initContactForm();
});

/**
 * Toggles the mobile navigation menu open/closed.
 */
function initNavToggle() {
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.nav-menu');

  if (!toggle || !menu) {
    return;
  }

  toggle.addEventListener('click', function () {
    var isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * Highlights the navigation link matching the current page.
 */
function setActiveNavLink() {
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(function (link) {
    var linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });
}

/**
 * Inserts the current year into any element with the
 * data-current-year attribute (used in the footer copyright).
 */
function setCurrentYear() {
  var yearEls = document.querySelectorAll('[data-current-year]');
  var year = new Date().getFullYear();
  yearEls.forEach(function (el) {
    el.textContent = year;
  });
}

/**
 * Provides lightweight client-side validation and a success
 * message for the contact/admissions inquiry form. No backend
 * is required at this stage.
 */
function initContactForm() {
  var form = document.querySelector('#contact-form');
  if (!form) {
    return;
  }

  var successMessage = document.querySelector('.form-success');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (successMessage) {
      successMessage.classList.add('visible');
    }

    form.reset();

    if (successMessage) {
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}
