/**
 * NOVA Framework - UI Script
 * Sistema de Progressbar (Notificações via nova_notify)
 */

// ============================================================
// PROGRESSBAR
// ============================================================

const progressContainer = document.getElementById('progressbar-container');
const progressLabel = document.getElementById('progressbar-label');
const progressFill = document.getElementById('progressbar-fill');
let progressInterval = null;

/**
 * Mostra a barra de progresso
 * @param {string} label - Texto da barra
 * @param {number} duration - Duração em ms
 */
function showProgressbar(label, duration) {
    progressLabel.textContent = label;
    progressFill.style.width = '0%';
    progressContainer.classList.remove('hidden');

    const startTime = Date.now();

    if (progressInterval) clearInterval(progressInterval);

    progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / duration) * 100, 100);
        progressFill.style.width = `${progress}%`;

        if (progress >= 100) {
            clearInterval(progressInterval);
            progressInterval = null;
            setTimeout(() => {
                progressContainer.classList.add('hidden');
                progressFill.style.width = '0%';
            }, 200);
        }
    }, 50);
}

// ============================================================
// UTILIDADES
// ============================================================

/**
 * Escapa HTML para prevenir XSS
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================================
// NUI MESSAGE HANDLER
// ============================================================

window.addEventListener('message', (event) => {
    const data = event.data;

    switch (data.action) {
        case 'progressbar':
            showProgressbar(data.label, data.duration);
            break;

        case 'hideProgressbar':
            if (progressInterval) {
                clearInterval(progressInterval);
                progressInterval = null;
            }
            progressContainer.classList.add('hidden');
            break;

        case 'openTpcds':
            openTpcds();
            break;

        case 'copyToClipboard':
            if (data.text) {
                const ta = document.createElement('textarea');
                ta.value = data.text;
                ta.style.position = 'fixed';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            }
            break;
    }
});

// ============================================================
// NUI CALLBACK HELPER
// ============================================================

/**
 * Envia um NUI callback para o client Lua
 * @param {string} name - Nome do callback
 * @param {object} data - Dados a enviar
 * @returns {Promise}
 */
async function nuiCallback(name, data = {}) {
    try {
        const response = await fetch(`https://${GetParentResourceName()}/${name}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (error) {
        console.error(`[NOVA UI] Erro no callback ${name}:`, error);
        return null;
    }
}

/**
 * Obtém o nome do resource pai
 * @returns {string}
 */
function GetParentResourceName() {
    return window.__cfx_nui_resource || 'nova_core';
}

// ============================================================
// TP COORDS PANEL
// ============================================================

const tpcdsOverlay = document.getElementById('tpcds-overlay');
const tpcdsInput = document.getElementById('tpcds-input');
let tpcdsOpen = false;

function openTpcds() {
    tpcdsInput.value = '';
    tpcdsOverlay.classList.remove('hidden');
    tpcdsOpen = true;
    setTimeout(() => tpcdsInput.focus(), 50);
}

function closeTpcds(coords) {
    tpcdsOverlay.classList.add('hidden');
    tpcdsOpen = false;
    nuiCallback('tpcds_result', coords || { cancelled: true });
}

tpcdsInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const raw = tpcdsInput.value.trim();
        if (!raw) return;

        let x, y, z;
        const vec3 = raw.match(/vector3\(\s*([-.\d]+)\s*,\s*([-.\d]+)\s*,\s*([-.\d]+)\s*\)/i);
        if (vec3) {
            x = parseFloat(vec3[1]); y = parseFloat(vec3[2]); z = parseFloat(vec3[3]);
        } else {
            const parts = raw.split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
            if (parts.length >= 3) {
                x = parts[0]; y = parts[1]; z = parts[2];
            }
        }

        if (x != null && y != null && z != null && !isNaN(x) && !isNaN(y) && !isNaN(z)) {
            closeTpcds({ x, y, z });
        }
    }
    e.stopPropagation();
});

tpcdsInput.addEventListener('keyup', (e) => e.stopPropagation());
tpcdsInput.addEventListener('keypress', (e) => e.stopPropagation());

// ESC global
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        if (tpcdsOpen) {
            closeTpcds();
        } else {
            nuiCallback('closeUI');
        }
    }
});
