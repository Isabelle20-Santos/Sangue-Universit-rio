document.addEventListener('DOMContentLoaded', () => {
  initTriagemWizard();
});

function initTriagemWizard() {
  const form = document.getElementById('triagemForm');
  if (!form) return;

  const steps = Array.from(form.querySelectorAll('.triagem-step'));
  const progressItems = Array.from(document.querySelectorAll('#progressList li'));
  const progressFill = document.getElementById('progressFill');
  const totalSteps = steps.length;
  let current = 1;

  const goToStep = (stepNumber) => {
    steps.forEach(step => {
      step.classList.toggle('active', Number(step.dataset.step) === stepNumber);
    });

    progressItems.forEach(item => {
      const n = Number(item.dataset.step);
      item.classList.remove('current', 'done');
      if (n < stepNumber) item.classList.add('done');
      else if (n === stepNumber) item.classList.add('current');
    });

    progressFill.style.width = `${(stepNumber / totalSteps) * 100}%`;
    current = stepNumber;
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  form.querySelectorAll('.next-step').forEach(btn => {
    btn.addEventListener('click', () => {
      const activeStep = form.querySelector('.triagem-step.active');
      const requiredFields = activeStep.querySelectorAll('[required]');
      let valid = true;
      requiredFields.forEach(field => {
        if (!field.value) {
          valid = false;
          field.style.borderColor = 'var(--color-red)';
        } else {
          field.style.borderColor = 'transparent';
        }
      });
      if (valid) goToStep(current + 1);
    });
  });

  form.querySelectorAll('.prev-step').forEach(btn => {
    btn.addEventListener('click', () => goToStep(current - 1));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const requiredFields = form.querySelector('.triagem-step.active').querySelectorAll('[required]');
    let valid = true;
    requiredFields.forEach(field => {
      if (!field.value) {
        valid = false;
        field.style.borderColor = 'var(--color-red)';
      }
    });
    if (!valid) return;

    const data = Object.fromEntries(new FormData(form).entries());
    renderResult(data);
    goToStep(4);
  });

  function renderResult(data) {
    const resultBox = document.getElementById('resultBox');
    const blockers = [];
    const warnings = [];

    if (data.idade === 'menor16') blockers.push('Idade mínima para doar é 16 anos (com autorização dos responsáveis).');
    if (data.idade === 'maior69') warnings.push('Doadores com 70 anos ou mais precisam de avaliação médica adicional no local.');
    if (data.peso === 'menor50') blockers.push('Peso mínimo exigido para doação é 50 kg.');
    if (data['saude-hoje'] === 'nao') blockers.push('É necessário estar sem sintomas de gripe, resfriado ou febre no dia da doação.');
    if (data['condicao-cronica'] === 'nao-controlada') blockers.push('Condições crônicas não controladas impedem a doação até estabilização clínica.');
    if (data.gravidez === 'gravida') blockers.push('Gestantes não podem doar sangue durante a gravidez.');
    if (data.gravidez === 'amamentando') warnings.push('Lactantes só podem doar após 12 meses do parto, com avaliação médica.');
    if (data.tatuagem === 'sim') warnings.push('É necessário aguardar 12 meses após tatuagem, piercing ou procedimento estético invasivo.');
    if (data.alcool === 'sim') warnings.push('Aguarde pelo menos 12 horas após consumo de álcool antes de doar.');
    if (data.fumo === 'sim') warnings.push('Aguarde pelo menos 2 horas sem fumar antes da doação.');
    if (data.medicamento === 'sim') warnings.push('Leve a lista de medicamentos em uso para avaliação da equipe médica no local.');

    let status = 'apto';
    if (blockers.length) status = 'inapto';
    else if (warnings.length) status = 'atencao';

    const content = {
      apto: {
        icon: 'bi-check-circle-fill',
        title: 'Você está apto a doar!',
        text: 'Com base nas suas respostas, você atende aos critérios básicos para doação. A confirmação final é feita presencialmente pela equipe do HEMOAM.',
      },
      atencao: {
        icon: 'bi-exclamation-circle-fill',
        title: 'Atenção a alguns pontos',
        text: 'Você pode doar, mas alguns cuidados precisam ser observados antes de ir até o HEMOAM.',
      },
      inapto: {
        icon: 'bi-x-circle-fill',
        title: 'Ainda não é possível doar',
        text: 'Identificamos um ou mais impedimentos temporários ou permanentes com base nas suas respostas.',
      },
    }[status];

    const reasons = [...blockers, ...warnings];
    const reasonsHtml = reasons.length
      ? `<ul class="result-reasons">${reasons.map(r => `<li><i class="bi bi-dot"></i>${r}</li>`).join('')}</ul>`
      : '';

    resultBox.className = `result-box ${status}`;
    resultBox.innerHTML = `
      <div class="result-icon"><i class="bi ${content.icon}"></i></div>
      <h2>${content.title}</h2>
      <p>${content.text}</p>
      ${reasonsHtml}
      <div class="result-actions">
        <a href="login.html" class="btn btn-primary btn-lg">Criar minha conta <i class="bi bi-arrow-right"></i></a>
        <a href="index.html#onde-doar" class="btn btn-outline btn-lg">Ver locais de doação</a>
      </div>
    `;
  }

  goToStep(1);
}