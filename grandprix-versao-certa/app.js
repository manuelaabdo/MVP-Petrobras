// Petrobras ZTA - Mock Application Logic

const AppState = {
    currentTab: 'tunnels',
    tunnels: [],
    phantomDevices: [],
    boneSessions: [],
    cryptoRotationTimeTotal: 60, // 1 minuto em segundos
    cryptoRotationTimeLeft: 60,
    timerInterval: null
};

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMockData();
    renderTunnels();
    renderPhantomDevices();
    renderBoneSessions();
    startCryptoTimer();
    startInterceptsSim();

    // Modal Overrides
    document.getElementById('force-rotation-btn').addEventListener('click', showModal);
    document.getElementById('cancel-modal-btn').addEventListener('click', hideModal);
    document.getElementById('confirm-rotation-btn').addEventListener('click', executeCryptoRotation);

    // Theme setup
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
    updateThemeIcon();
});

// ----------------------------------------
// Theme Functions
// ----------------------------------------
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = document.getElementById('theme-icon');
    if (!icon) return;

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    if (currentTheme === 'dark') {
        icon.setAttribute('data-lucide', 'sun');
    } else {
        icon.setAttribute('data-lucide', 'moon');
    }

    if (window.lucide) {
        lucide.createIcons();
    }
}

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view');
    const pageTitle = document.getElementById('page-title');
    const pageDesc = document.getElementById('page-desc');

    const titles = {
        'tunnels': { title: 'Gestão de Túneis Micro Segmentados', desc: 'Mapeamento em tempo real do tráfego através de nós seguros ZTA.' },
        'crypto': { title: 'IA de Salto com Criptografia Rotativa', desc: 'Monitoramento da entropia dinâmica de chaves e IPs mascarados (Fantasmas).' },
        'bone': { title: 'Autenticação por Condução Óssea', desc: 'Controle contínuo de vitalidade e prova de presença física por wearables.' },
    };

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');

            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            views.forEach(view => view.classList.remove('active'));
            document.getElementById(target).classList.add('active');

            pageTitle.innerText = titles[target].title;
            pageDesc.innerText = titles[target].desc;
        });
    });
}

function initMockData() {
    AppState.tunnels = [
        { id: 'T-001X', name: 'Offshore P-75 / Sede Admin', status: 'active', traffic: '1.2 GB/s', auth: 'Grupo_Sec_A' },
        { id: 'T-002B', name: 'Refinaria REPLAN / IoT Hub', status: 'active', traffic: '850 MB/s', auth: 'Grupo_Sec_B' },
        { id: 'T-015Z', name: 'Base RedTeam / Sandbox', status: 'maintenance', traffic: '0 B/s', auth: 'Apenas Admins' },
        { id: 'T-044A', name: 'Oleodutos SCADA (CRÍTICO)', status: 'alert', traffic: '4.5 GB/s', auth: 'Nível_Master' },
    ];

    AppState.phantomDevices = [
        { id: 'WK-55B1', type: 'Terminal Rígido', physicalIP: '10.5.12.45', phantomIP: '192.168.101.99', status: 'Seguro' },
        { id: 'SGPS-21', type: 'Smart Glasses', physicalIP: '10.5.15.112', phantomIP: '192.168.101.45', status: 'Seguro' },
        { id: 'HLMT-04', type: 'Capacete V2', physicalIP: '10.5.15.19', phantomIP: '192.168.103.11', status: 'Suspeito' },
        { id: 'SRV-AI', type: 'Node Analytics', physicalIP: '10.10.10.50', phantomIP: '192.168.100.8', status: 'Em Salto' },
    ];

    AppState.boneSessions = [
        { user: 'Marcos T.', device: 'Capacete Smart H-01', freq: 'Regular (Bio)', uptime: 45, status: 'ok' },
        { user: 'Sonia A.', device: 'Glasses P-75', freq: 'Regular (Bio)', uptime: 120, status: 'ok' },
        { user: 'Robson J.', device: 'Wearable Pulso V3', freq: 'Alterada', uptime: 490, status: 'critical' },
    ];
}

// ----------------------------------------
// Feature 1: Tunnels
// ----------------------------------------
function renderTunnels() {
    const tbody = document.querySelector('#tunnels-table tbody');
    tbody.innerHTML = '';

    AppState.tunnels.forEach(t => {
        let badgeClass = 'badge-success';
        let icon = '<i data-lucide="check-circle"></i>';
        let statusText = 'Em Operação';

        if (t.status === 'maintenance') {
            badgeClass = 'badge-warning';
            icon = '<i data-lucide="tool"></i>';
            statusText = 'Manutenção / Fechado';
        } else if (t.status === 'alert') {
            badgeClass = 'badge-danger';
            icon = '<i data-lucide="alert-triangle"></i>';
            statusText = 'Atenção Total';
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="badge ${badgeClass}">${icon} ${statusText}</span></td>
            <td><strong>${t.name}</strong><br><small class="text-secondary">ID: ${t.id}</small></td>
            <td style="font-family: monospace">${t.traffic}</td>
            <td><span class="badge badge-accent"><i data-lucide="users"></i> ${t.auth}</span></td>
            <td>
                <button class="btn btn-outline btn-sm">Auditar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    lucide.createIcons();
}

function startInterceptsSim() {
    const list = document.getElementById('interception-list');
    const ipsAtacantes = ['189.2.xxx.xx', '45.12.xxx.xx', '221.4.xxx.xx'];

    setInterval(() => {
        const tr = document.createElement('li');
        tr.className = 'alert-item';
        const atIp = ipsAtacantes[Math.floor(Math.random() * ipsAtacantes.length)];

        tr.innerHTML = `
            <p><strong>Acesso Negado Pelo ZTA</strong></p>
            <span class="ip">Source: ${atIp} -> Target: Túnel Rígido</span><br>
            <span class="text-secondary" style="font-size: 0.75rem;">Motivo: Assinatura Óssea Ausente</span>
        `;
        list.prepend(tr);
        if (list.children.length > 5) list.removeChild(list.lastChild);
    }, 6500);
}

// ----------------------------------------
// Feature 2: Crypto Rotation (IA) 
// ----------------------------------------
function startCryptoTimer() {
    const timerDisplay = document.getElementById('rotation-timer');
    const circle = document.querySelector('.donut-progress');
    const glow = document.querySelector('.donut-progress-glow');

    // circunferência = 2 * pi * r (r=100) = ~628
    const circumference = 2 * Math.PI * 100;
    circle.style.strokeDasharray = circumference;
    glow.style.strokeDasharray = circumference;

    const updateTimer = () => {
        AppState.cryptoRotationTimeLeft--;

        if (AppState.cryptoRotationTimeLeft <= 0) {
            executeCryptoRotation(false);
        }

        const mins = Math.floor(AppState.cryptoRotationTimeLeft / 60);
        const secs = AppState.cryptoRotationTimeLeft % 60;
        timerDisplay.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        // Atualizar Anel SVG
        const ratio = AppState.cryptoRotationTimeLeft / AppState.cryptoRotationTimeTotal;
        const offset = circumference - (ratio * circumference);
        circle.style.strokeDashoffset = offset;
        glow.style.strokeDashoffset = offset;

        // Cuidado/Critico style changes
        if (AppState.cryptoRotationTimeLeft < 30) {
            circle.style.stroke = 'var(--danger)';
            glow.style.stroke = 'var(--danger)';
            timerDisplay.style.color = 'var(--danger)';
        } else {
            circle.style.stroke = 'var(--accent)';
            glow.style.stroke = 'var(--accent)';
            timerDisplay.style.color = 'var(--accent)';
        }
    };

    updateTimer();
    AppState.timerInterval = setInterval(updateTimer, 1000);
}

function processIPSwapSimul() {
    AppState.phantomDevices.forEach(d => {
        const lastPart = Math.floor(Math.random() * 255);
        d.phantomIP = `192.168.10X.${lastPart}`;
        d.status = 'Salto Concluído';
    });
    renderPhantomDevices();
}

function executeCryptoRotation(fromInterface = true) {
    if (fromInterface) {
        hideModal();
    }

    clearInterval(AppState.timerInterval);

    const timerDisplay = document.getElementById('rotation-timer');
    timerDisplay.innerText = "ROT...";
    document.querySelector('.donut-progress').style.strokeDashoffset = 0;
    document.querySelector('.donut-progress-glow').style.strokeDashoffset = 0;

    setTimeout(() => {
        processIPSwapSimul();
        AppState.cryptoRotationTimeLeft = AppState.cryptoRotationTimeTotal;
        startCryptoTimer();
    }, 1500);
}

function renderPhantomDevices() {
    const tbody = document.querySelector('#phantom-table tbody');
    tbody.innerHTML = '';

    AppState.phantomDevices.forEach(d => {
        let sc = 'badge-success';
        if (d.status === 'Suspeito') sc = 'badge-warning';
        if (d.status === 'Em Salto') sc = 'badge-accent';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${d.type}</strong><br><small class="text-secondary">${d.id}</small></td>
            <td><span class="badge ${sc}">${d.status}</span></td>
            <td style="font-family:monospace; color:var(--text-secondary)">${d.physicalIP}</td>
            <td style="font-family:monospace; color:var(--accent)">${d.phantomIP}</td>
        `;
        tbody.appendChild(tr);
    });
}

// ----------------------------------------
// Feature 3: Bone Conduction
// ----------------------------------------
function renderBoneSessions() {
    const tbody = document.querySelector('#bone-table tbody');
    document.getElementById('total-wearables').innerText = AppState.boneSessions.length;
    tbody.innerHTML = '';

    AppState.boneSessions.forEach((s, idx) => {
        const isCritical = s.status === 'critical';
        const mins = s.uptime;

        let rowClass = isCritical ? 'style="background: rgba(255, 77, 77, 0.1); border: 1px solid var(--danger);"' : '';
        let warnText = isCritical ? `<span class="text-danger"><i data-lucide="alert-circle"></i> Extremamente Alto (${mins}m)</span>` : `<span class="text-success">${mins}m (Normal)</span>`;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td ${rowClass}><strong>${s.user}</strong></td>
            <td ${rowClass}>${s.device}</td>
            <td ${rowClass}>${s.freq}</td>
            <td ${rowClass}>${warnText}</td>
            <td ${rowClass}>
                ${isCritical ? `<button class="btn btn-danger btn-sm" onclick="killSession(${idx})"><i data-lucide="power-off"></i> Forçar Logoff (ZTA)</button>` : '-'}
            </td>
        `;
        tbody.appendChild(tr);
    });
    lucide.createIcons();
}

window.killSession = function (index) {
    if (confirm('Tem certeza? Isso expulsará instantaneamente o dispositivo da rede de túneis via ZTA.')) {
        AppState.boneSessions.splice(index, 1);
        renderBoneSessions();
    }
}

// ----------------------------------------
// Modals
// ----------------------------------------
function showModal() {
    document.getElementById('confirm-modal').classList.add('active');
}

function hideModal() {
    document.getElementById('confirm-modal').classList.remove('active');
}
