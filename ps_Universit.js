document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initBackToTop();
  initForm();
  initFaq();
  initStoryCarousel();
});

function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    const isOpen = nav.classList.contains('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 480);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initForm() {
  const form = document.getElementById('donationRequestForm');
  const feedback = document.getElementById('formFeedback');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    feedback.hidden = false;
    form.reset();
    setTimeout(() => { feedback.hidden = true; }, 6000);
  });
}

function initFaq() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question i').className = 'bi bi-plus';
      });
      if (!isOpen) {
        item.classList.add('open');
        question.querySelector('i').className = 'bi bi-dash';
      }
    });
  });
}

function initStoryCarousel() {
  const track = document.getElementById('storyTrack');
  const prevBtn = document.getElementById('storyPrev');
  const nextBtn = document.getElementById('storyNext');
  if (!track) return;

  const cards = track.querySelectorAll('.story-card');
  let current = 0;

  const render = () => {
    cards.forEach((card, i) => card.classList.toggle('active', i === current));
  };

  prevBtn.addEventListener('click', () => {
    current = (current - 1 + cards.length) % cards.length;
    render();
  });

  nextBtn.addEventListener('click', () => {
    current = (current + 1) % cards.length;
    render();
  });

  render();
}