/**
 * Main App Module - Lógica principal de la aplicación
 * Orquesta todos los módulos y maneja eventos
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Sprite Generator 3D - Inicializando...');

    // ===== INICIALIZACIÓN =====
    initializeApp();

    // ===== EVENT LISTENERS =====
    setupEventListeners();

    // ===== CARGAR DATOS INICIALES =====
    UI.updateGallery();
    checkAPIKey();
});

/**
 * Inicializar aplicación
 */
function initializeApp() {
    // Cargar tema oscuro si está guardado
    const settings = Storage.getSettings();
    if (settings.darkMode) {
        document.body.classList.add('dark-mode');
    }

    console.log('✅ Aplicación inicializada');
}

/**
 * Configurar event listeners
 */
function setupEventListeners() {
    // === GENERADOR ===
    document.getElementById('btnGenerate').addEventListener('click', generateSprite);
    document.getElementById('spriteDescription').addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') generateSprite();
    });

    // === GALERÍA ===
    document.getElementById('searchInput').addEventListener('input', debounce(() => {
        UI.updateGallery();
    }, 300));

    document.getElementById('filterCategory').addEventListener('change', () => {
        UI.updateGallery();
    });

    document.getElementById('sortBy').addEventListener('change', () => {
        UI.updateGallery();
    });

    // === VISTA DE DETALLES ===
    document.getElementById('btnBackToGallery').addEventListener('click', () => {
        UI.backToGallery();
    });

    document.getElementById('btnDownload').addEventListener('click', () => {
        const spriteId = document.getElementById('detailImage').closest('.detail-view')?.dataset?.spriteId;
        if (spriteId) UI.downloadSprite(spriteId);
    });

    // === HEADER ===
    document.getElementById('btnSettings').addEventListener('click', UI.openSettings);
    document.getElementById('btnStats').addEventListener('click', UI.openStats);

    // === MODAL: CONFIGURACIÓN ===
    document.getElementById('btnCloseSettings').addEventListener('click', UI.closeSettings);
    document.getElementById('settingsModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('settingsModal')) UI.closeSettings();
    });

    document.getElementById('btnToggleApiKey').addEventListener('click', toggleAPIKeyVisibility);
    document.getElementById('apiKeyInput').addEventListener('blur', saveAPIKey);
    document.getElementById('btnClearApiKey').addEventListener('click', clearAPIKey);

    document.getElementById('btnExportData').addEventListener('click', UI.exportData);
    document.getElementById('btnImportData').addEventListener('click', UI.importData);
    document.getElementById('btnClearAllData').addEventListener('click', clearAllData);

    document.getElementById('darkMode').addEventListener('change', toggleDarkMode);
    document.getElementById('compactView').addEventListener('change', toggleCompactView);
    document.getElementById('autoSave').addEventListener('change', toggleAutoSave);
    document.getElementById('maxTokens').addEventListener('change', updateMaxTokens);
    document.getElementById('timeout').addEventListener('change', updateTimeout);

    // === MODAL: ESTADÍSTICAS ===
    document.getElementById('btnCloseStats').addEventListener('click', UI.closeStats);
    document.getElementById('statsModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('statsModal')) UI.closeStats();
    });

    console.log('✅ Event listeners configurados');
}

/**
 * Generar sprite
 */
async function generateSprite() {
    const description = document.getElementById('spriteDescription').value.trim();
    
    if (!description) {
        UI.showToast('⚠️ Por favor describe el sprite que quieres generar', 'warning');
        return;
    }

    const category = document.getElementById('spriteCategory').value;
    const style = document.getElementById('spriteStyle').value;
    const size = document.getElementById('spriteSize').value;
    const effects = document.getElementById('spriteEffects').checked;
    const tags = document.getElementById('spriteTags').value
        .split(',')
        .map(t => t.trim())
        .filter(t => t);

    if (!category) {
        UI.showToast('⚠️ Por favor selecciona una categoría', 'warning');
        return;
    }

    const hideLoading = UI.showLoading('Generando tu sprite 3D...');

    try {
        // Generar imagen con Gemini
        const result = await GeminiAPI.generateImage(description, {
            category,
            style,
            effects,
            size
        });

        hideLoading();

        if (!result.success) {
            throw new Error('No se pudo generar la imagen');
        }

        // Crear sprite simulado (en versión real, usarías una API de generación de imágenes)
        const sprite = Storage.saveSprite({
            title: description.substring(0, 50) + '...',
            description,
            category,
            style,
            size: parseInt(size),
            tags,
            effects,
            imageData: generatePlaceholderImage(description, style, category, size),
            metadata: {
                prompt: GeminiAPI.generateSpritePrompt(description, { category, style, effects, size }),
                generationTime: result.generationTime,
                model: 'gemini-2.0-flash'
            }
        });

        if (sprite) {
            UI.showToast('✅ Sprite generado y guardado', 'success');
            UI.updateGallery();

            // Limpiar formulario
            document.getElementById('spriteDescription').value = '';
            document.getElementById('spriteTags').value = '';
        } else {
            UI.showToast('❌ Error al guardar el sprite', 'error');
        }

    } catch (error) {
        hideLoading();
        console.error('Error:', error);
        UI.showToast(`❌ Error: ${error.message}`, 'error');
    }
}

/**
 * Generar imagen placeholder (para demostración)
 * En producción, esto sería reemplazado por una API real de generación de imágenes
 */
function generatePlaceholderImage(description, style, category, size) {
    const canvas = document.createElement('canvas');
    canvas.width = parseInt(size);
    canvas.height = parseInt(size);
    const ctx = canvas.getContext('2d');

    // Gradiente de fondo transparente
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    
    // Colores según el estilo
    const styleColors = {
        '3d-stylizado': ['#FF6B6B', '#4ECDC4', '#45B7D1'],
        'cartoon': ['#FFE66D', '#95E1D3', '#F38181'],
        'realista': ['#8B7355', '#D2B48C', '#A0826D'],
        'pixel-art': ['#FF00FF', '#00FFFF', '#FFFF00'],
        'anime': ['#FF69B4', '#87CEEB', '#98FB98']
    };

    const colors = styleColors[style] || styleColors['3d-stylizado'];
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, colors[2]);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar formas según categoría
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    switch (category) {
        case 'personaje':
            drawCharacter(ctx, canvas);
            break;
        case 'enemigo':
            drawEnemy(ctx, canvas);
            break;
        case 'objeto':
            drawObject(ctx, canvas);
            break;
        case 'arma':
            drawWeapon(ctx, canvas);
            break;
        default:
            drawGeneric(ctx, canvas);
    }

    // Agregar texto
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = `bold ${canvas.width / 10}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const text = category.substring(0, 3).toUpperCase();
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL('image/png');
}

function drawCharacter(ctx, canvas) {
    const size = canvas.width;
    // Cabeza
    ctx.beginPath();
    ctx.arc(size / 2, size / 3, size / 6, 0, Math.PI * 2);
    ctx.fill();
    // Cuerpo
    ctx.fillRect(size / 2 - size / 8, size / 2, size / 4, size / 3);
}

function drawEnemy(ctx, canvas) {
    const size = canvas.width;
    // Triángulo
    ctx.beginPath();
    ctx.moveTo(size / 2, size / 4);
    ctx.lineTo(size / 4, size * 0.75);
    ctx.lineTo(size * 0.75, size * 0.75);
    ctx.fill();
}

function drawObject(ctx, canvas) {
    const size = canvas.width;
    // Caja
    ctx.fillRect(size / 4, size / 4, size / 2, size / 2);
}

function drawWeapon(ctx, canvas) {
    const size = canvas.width;
    // Espada
    ctx.fillRect(size / 2 - size / 20, size / 4, size / 10, size / 2);
    ctx.beginPath();
    ctx.arc(size / 2, size / 3, size / 8, 0, Math.PI * 2);
    ctx.fill();
}

function drawGeneric(ctx, canvas) {
    const size = canvas.width;
    ctx.fillRect(size / 4, size / 4, size / 2, size / 2);
}

/**
 * Validar API Key
 */
async function checkAPIKey() {
    const apiKey = Storage.getAPIKey();
    if (!apiKey) {
        UI.showToast('⚠️ Configura tu API Key de Gemini en los ajustes', 'warning');
    }
}

/**
 * Alternar visibilidad de API Key
 */
function toggleAPIKeyVisibility() {
    const input = document.getElementById('apiKeyInput');
    const btn = document.getElementById('btnToggleApiKey');
    
    if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈';
    } else {
        input.type = 'password';
        btn.textContent = '👁️';
    }
}

/**
 * Guardar API Key
 */
function saveAPIKey() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    
    if (apiKey) {
        Storage.saveAPIKey(apiKey);
        document.getElementById('apiKeySaved').checked = true;
        UI.showToast('✅ API Key guardada', 'success');
    }
}

/**
 * Limpiar API Key
 */
function clearAPIKey() {
    if (confirm('¿Estás seguro? Tendrás que configurar una nueva API Key después.')) {
        Storage.clearAPIKey();
        document.getElementById('apiKeyInput').value = '';
        document.getElementById('apiKeySaved').checked = false;
        UI.showToast('✅ API Key eliminada', 'success');
    }
}

/**
 * Alternar modo oscuro
 */
function toggleDarkMode(e) {
    const isDark = e.target.checked;
    document.body.classList.toggle('dark-mode', isDark);
    Storage.saveSettings({ darkMode: isDark });
    UI.showToast(`Modo ${isDark ? 'oscuro' : 'claro'} activado`, 'success');
}

/**
 * Alternar vista compacta
 */
function toggleCompactView(e) {
    Storage.saveSettings({ compactView: e.target.checked });
    UI.updateGallery();
}

/**
 * Alternar guardado automático
 */
function toggleAutoSave(e) {
    Storage.saveSettings({ autoSave: e.target.checked });
}

/**
 * Actualizar max tokens
 */
function updateMaxTokens(e) {
    const value = parseInt(e.target.value);
    if (value >= 100 && value <= 2000) {
        Storage.saveSettings({ maxTokens: value });
    }
}

/**
 * Actualizar timeout
 */
function updateTimeout(e) {
    const value = parseInt(e.target.value);
    if (value >= 10 && value <= 120) {
        Storage.saveSettings({ timeout: value });
    }
}

/**
 * Limpiar todos los datos
 */
function clearAllData() {
    if (confirm('⚠️ ¿Estás completamente seguro? Esto eliminará TODOS tus sprites y configuraciones.')) {
        if (confirm('⚠️ Última confirmación: Esta acción no se puede deshacer.')) {
            Storage.clearAllData();
            UI.showToast('🗑️ Todos los datos han sido eliminados', 'success');
            location.reload();
        }
    }
}

/**
 * Debounce utility
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

console.log('🚀 Sprite Generator 3D cargado y listo');
