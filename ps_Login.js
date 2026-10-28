document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initPasswordToggle();
  initForms();
});

function initTabs() {
  const tabs = document.querySelectorAll('.auth-tab');
  const forms = document.querySelectorAll('.auth-form');

  const activate = (name) => {
    tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.tab === name));
    forms.forEach(form => form.classList.toggle('active', form.dataset.panel === name));
    document.getElementById('authFeedback').hidden = true;
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activate(tab.dataset.tab));
  });

  document.querySelectorAll('[data-switch]').forEach(btn => {
    btn.addEventListener('click', () => activate(btn.dataset.switch));
  });
}

function initPasswordToggle() {
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      const isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      btn.innerHTML = isHidden ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
    });
  });
}

function initForms() {
  const feedback = document.getElementById('authFeedback');

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showFeedback(feedback, 'Login realizado! Redirecionando para sua área do doador...');
    });
  }

  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const senha = signupForm.querySelector('[name="senha"]');
      const confirmar = signupForm.querySelector('[name="confirmar-senha"]');

      if (senha.value !== confirmar.value) {
        confirmar.style.borderColor = 'var(--color-red)';
        showFeedback(feedback, 'As senhas não coincidem. Verifique e tente novamente.', true);
        return;
      }
      confirmar.style.borderColor = 'transparent';

      showFeedback(feedback, 'Conta criada com sucesso! Que tal fazer sua pré-triagem agora?');
      signupForm.reset();
    });
  }
}

function showFeedback(el, message, isError) {
  el.textContent = message;
  el.hidden = false;
  el.style.color = isError ? 'var(--color-red)' : '#2E9E63';
  el.style.background = isError ? 'rgba(230,57,70,0.1)' : 'rgba(46,158,99,0.1)';
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}