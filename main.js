// Scripts communs à toutes les pages du portfolio

// ---------- Thème clair / sombre ----------
// (le thème initial est appliqué dans le <head> pour éviter un flash blanc)
const themeToggle = document.querySelector('.theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
}

// ---------- Menu mobile ----------
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open);
  });
}

// ---------- Année du pied de page ----------
document.querySelectorAll('.year').forEach(el => {
  el.textContent = new Date().getFullYear();
});

// ---------- Apparition des sections au défilement ----------
const revealed = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealed.forEach(el => observer.observe(el));
} else {
  revealed.forEach(el => el.classList.add('visible'));
}

// ---------- Filtre des projets ----------
const filterButtons = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.card[data-category]');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.filter;

    filterButtons.forEach(btn => {
      btn.classList.toggle('active', btn === button);
      btn.setAttribute('aria-pressed', btn === button);
    });

    cards.forEach(card => {
      card.hidden = !(category === 'all' || card.dataset.category === category);
    });
  });
});

// ---------- Formulaire de contact (Formspree) ----------
// Envoi sans quitter la page + message de confirmation ou d'erreur.
const form = document.querySelector('#contact-form');
if (form) {
  const status = form.querySelector('.form-status');
  const submit = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async event => {
    event.preventDefault();
    status.className = 'form-status';
    status.textContent = '';
    submit.disabled = true;
    submit.textContent = 'Envoi en cours…';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        form.reset();
        status.classList.add('success');
        status.textContent = 'Merci ! Votre message a bien été envoyé, je vous réponds très vite.';
      } else {
        throw new Error();
      }
    } catch (e) {
      status.classList.add('error');
      status.innerHTML = 'Oups, le message n’a pas pu être envoyé. Écrivez-moi directement à '
        + '<a href="mailto:yannothnielarra2907@gmail.com">yannothnielarra2907@gmail.com</a>.';
    } finally {
      submit.disabled = false;
      submit.textContent = 'Envoyer le message';
    }
  });
}
