document.addEventListener('DOMContentLoaded', () => {
  initModal();
  bindServiceActions();
});

const Modal = {
  overlay: null,
  box: null,
  content: null,

  init() {
    this.overlay = document.getElementById('modalOverlay');
    this.box = document.getElementById('modalBox');
    this.content = document.getElementById('modalContent');
    if (!this.overlay) return;

    document.getElementById('modalClose').addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  },

  open(html) {
    this.content.innerHTML = html;
    this.overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  close() {
    this.overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
};

function initModal() {
  Modal.init();
}

function bindServiceActions() {
  const actions = {
    carteirinha: renderCarteirinha,
    exames: renderExames,
    declaracao: renderDeclaracao,
    horas: renderHoras,
    historico: renderHistorico,
    ranking: renderRanking,
  };

  document.querySelectorAll('[data-action]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const action = actions[el.dataset.action];
      if (action) action();
    });
  });
}

function renderCarteirinha() {
  Modal.open(`
    <span class="modal-eyebrow">Carteirinha de doador</span>
    <h2>Sua carteirinha digital</h2>
    <p>A partir da 3ª doação sua carteirinha física fica disponível no Salão do Doador
       (leve uma foto 3x4). Aqui está sua versão digital atual:</p>

    <div class="donor-card-visual">
      <span class="level">Nível Prata &middot; 21 doações</span>
      <div class="name">Doador(a) &mdash; Sangue Universitário</div>
      <div class="row">
        <span>UNIESBAM &middot; ADS</span>
        <span>Válida até 12/2026</span>
      </div>
    </div>

    <div class="modal-actions">
      <button class="btn btn-primary" onclick="window.print()"><i class="bi bi-printer"></i> Imprimir</button>
      <a href="index.html#onde-doar" class="btn btn-outline">Retirar física no HEMOAM</a>
    </div>
  `);
}

function renderExames() {
  Modal.open(`
    <span class="modal-eyebrow">Exames gratuitos</span>
    <h2>Seus últimos resultados</h2>
    <p>Realizados automaticamente a cada doação, sem custo. Resultados liberados em até 30 dias.</p>

    <table class="modal-table">
      <thead>
        <tr><th>Exame</th><th>Resultado</th><th>Data</th></tr>
      </thead>
      <tbody>
        <tr><td>Tipagem sanguínea</td><td>O+</td><td>10/06/2026</td></tr>
        <tr><td>Hemoglobina</td><td>Normal</td><td>10/06/2026</td></tr>
        <tr><td>Hepatites B/C</td><td>Não reagente</td><td>15/06/2026</td></tr>
        <tr><td>HIV</td><td>Não reagente</td><td>15/06/2026</td></tr>
        <tr><td>Doença de Chagas</td><td>Não reagente</td><td>15/06/2026</td></tr>
      </tbody>
    </table>

    <div class="modal-actions">
      <button class="btn btn-primary" data-action-inner="baixar-exames">Baixar relatório</button>
    </div>
  `);

  document.querySelector('[data-action-inner="baixar-exames"]')?.addEventListener('click', () => {
    downloadTextFile('exames-sangue-universitario.txt',
      'RESULTADOS DE EXAMES — SANGUE UNIVERSITÁRIO\n\n' +
      'Tipagem sanguínea: O+\n' +
      'Hemoglobina: Normal\n' +
      'Hepatites B/C: Não reagente\n' +
      'HIV: Não reagente\n' +
      'Doença de Chagas: Não reagente\n');
  });
}

function renderDeclaracao() {
  Modal.open(`
    <span class="modal-eyebrow">Declaração automática</span>
    <h2>Emitir declaração de doação</h2>
    <p>Gere agora um comprovante para apresentar na sua faculdade ou empresa. O documento
       inclui data, local e carga horária reconhecida.</p>

    <div class="modal-actions">
      <button class="btn btn-primary btn-lg" id="gerarDeclaracaoBtn">
        <i class="bi bi-file-earmark-text"></i> Gerar declaração agora
      </button>
    </div>
  `);

  document.getElementById('gerarDeclaracaoBtn')?.addEventListener('click', () => {
    const hoje = new Date().toLocaleDateString('pt-BR');
    const texto =
      'DECLARAÇÃO DE DOAÇÃO DE SANGUE\n\n' +
      'Projeto Sangue Universitário — UNIESBAM x HEMOAM\n\n' +
      `Declaramos, para os devidos fins, que o(a) doador(a) compareceu ao HEMOAM ` +
      `(Av. Constantino Nery, 4397, Manaus/AM) e realizou doação voluntária de sangue.\n\n` +
      `Data de emissão: ${hoje}\n` +
      'Carga horária reconhecida: 4 horas de atividade de extensão universitária.\n\n' +
      '_____________________________________\n' +
      'Sangue Universitário — HEMOAM';

    downloadTextFile('declaracao-doacao-sangue.txt', texto);
  });
}

function renderHoras() {
  const horasFeitas = 12;
  const horasTotais = 20;
  const percentual = Math.round((horasFeitas / horasTotais) * 100);

  Modal.open(`
    <span class="modal-eyebrow">Horas complementares</span>
    <h2>Seu progresso na UNIESBAM</h2>
    <p>Cada doação equivale a 4 horas de atividade de extensão curricularizada, somadas
       automaticamente ao seu histórico acadêmico.</p>

    <div class="hours-progress-track">
      <div class="hours-progress-fill" style="width: ${percentual}%"></div>
    </div>
    <div class="hours-progress-label">
      <span>${horasFeitas}h de ${horasTotais}h necessárias</span>
      <span>${percentual}%</span>
    </div>

    <table class="modal-table">
      <thead><tr><th>Doação</th><th>Horas</th><th>Data</th></tr></thead>
      <tbody>
        <tr><td>1ª doação</td><td>4h</td><td>12/02/2026</td></tr>
        <tr><td>2ª doação</td><td>4h</td><td>18/04/2026</td></tr>
        <tr><td>3ª doação</td><td>4h</td><td>10/06/2026</td></tr>
      </tbody>
    </table>
  `);
}

function renderHistorico() {
  const proximaData = calcularProximaDoacao('10/06/2026');

  Modal.open(`
    <span class="modal-eyebrow">Histórico de doações</span>
    <h2>Suas doações registradas</h2>
    <p>Próxima data disponível: <strong>${proximaData}</strong></p>

    <table class="modal-table">
      <thead><tr><th>#</th><th>Data</th><th>Local</th></tr></thead>
      <tbody>
        <tr><td>01</td><td>12/02/2026</td><td>HEMOAM &mdash; Sede Manaus</td></tr>
        <tr><td>02</td><td>18/04/2026</td><td>Campus UNIESBAM (mutirão)</td></tr>
        <tr class="highlight"><td>03</td><td>10/06/2026</td><td>HEMOAM &mdash; Sede Manaus</td></tr>
      </tbody>
    </table>
  `);
}

function calcularProximaDoacao(dataStr) {
  const [dia, mes, ano] = dataStr.split('/').map(Number);
  const data = new Date(ano, mes - 1, dia);
  data.setDate(data.getDate() + 60);
  return data.toLocaleDateString('pt-BR');
}

function renderRanking() {
  Modal.open(`
    <span class="modal-eyebrow">Ranking UNIESBAM</span>
    <h2>Maiores doadores do semestre</h2>
    <p>Atualizado a cada doação confirmada. Os três primeiros de cada curso ganham prêmios
       ao final do semestre.</p>

    <table class="modal-table">
      <thead><tr><th>Posição</th><th>Curso</th><th>Doações</th></tr></thead>
      <tbody>
        <tr class="highlight"><td>1º</td><td>ADS</td><td>47</td></tr>
        <tr><td>2º</td><td>Enfermagem</td><td>39</td></tr>
        <tr><td>3º</td><td>Direito</td><td>31</td></tr>
        <tr><td>4º</td><td>Administração</td><td>22</td></tr>
      </tbody>
    </table>

    <div class="modal-actions">
      <a href="login.html" class="btn btn-primary">Entrar para pontuar</a>
    </div>
  `);
}

function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}