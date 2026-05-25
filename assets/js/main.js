// Perfect Dream Modular shared interactions
(function () {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(nav.classList.contains('open')));
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  const form = document.getElementById('quote-form');
  if (form) {
    const required = ['name', 'email', 'phone', 'state', 'projectType', 'message'];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const showError = (field, message) => {
      const err = form.querySelector(`[data-error="${field}"]`);
      if (err) err.textContent = message;
    };

    const clearErrors = () => form.querySelectorAll('small.error').forEach(e => e.textContent = '');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();
      let valid = true;

      required.forEach(field => {
        const input = form.elements[field];
        if (!input || !String(input.value).trim()) {
          showError(field, 'This field is required.');
          valid = false;
        }
      });

      const email = String(form.elements.email.value).trim();
      if (email && !emailRegex.test(email)) {
        showError('email', 'Enter a valid email address.');
        valid = false;
      }

      if (!valid) return;

      const data = Object.fromEntries(new FormData(form).entries());
      const subject = encodeURIComponent(`Quote Request - ${data.projectType || 'Project Inquiry'}`);
      const body = encodeURIComponent(
`Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Company: ${data.company || 'N/A'}
State: ${data.state}
Project Type: ${data.projectType}
Budget Range: ${data.budget || 'N/A'}
Timeline: ${data.timeline || 'N/A'}

Message:
${data.message}`);

      window.location.href = `mailto:Matt@UnitedPaintersWW.com?subject=${subject}&body=${body}`;
    });
  }
})();
