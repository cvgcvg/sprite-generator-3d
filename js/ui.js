/**
 * UI Module - Gestión de interfaz de usuario
 * Maneja actualizaciones de DOM, modales y notificaciones
 */

const UI = (() => {
    let currentDetailSprite = null;

    // Mostrar carga
    const showLoading = (message = 'Procesando...') => {
        const status = document.getElementById('loadingStatus');
        const text = document.getElementById('loadingText');
        const progress = document.getElementById('progressFill');

        text.textContent = message;
        status.classList.remove('hidden');
        progress.style.width = '0%';

        // Animación de progreso
        let width = 0;
        const interval = setInterval(() => {
            width += Math.random() * 30;
            if (width > 90) width = 90;
            progress.style.width = width + '%';
        }, 500);

        return () => {
            clearInterval(interval);
            progress.style.width = '100%';
            setTimeout(() => status.classList.add('hidden'), 500);
        };
    };

    // Notificaciones Toast
    const showToast = (message, type = 'info') => {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 4000);
    };

    // Renderizar galería
    const renderGallery = (sprites) => {
        const gallery = document.getElementById('galleryContainer');

        if (sprites.length === 0) {
            gallery.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">🎨</span>
                    <h3>Sin sprites aún</h3>
                    <p>¡Genera tu primer sprite usando el panel izquierdo!</p>
                </div>
            `;
            return;
        }

        gallery.innerHTML = sprites.map(sprite => `
            <div class="sprite-card" data-sprite-id="${sprite.id}">
                <img src="${sprite.imageData}" alt="${sprite.title}" class="sprite-card-image" loading="lazy">
                <div class="sprite-card-content">
                    <h3 class="sprite-card-title">${sprite.title || 'Sin título'}</h3>
                    <div class="sprite-card-meta">
                        <span class="sprite-card-category">${sprite.category}</span>
                        <span>${new Date(sprite.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div class="sprite-card-actions">
                        <button class="btn btn-primary btn-view" title="Ver detalles">👁️</button>
                        <button class="btn btn-secondary btn-download" title="Descargar">⬇️</button>
                        <button class="btn btn-danger btn-delete" title="Eliminar">🗑️</button>
                    </div>
                </div>
            </div>
        `).join('');

        // Event listeners para tarjetas
        document.querySelectorAll('.sprite-card').forEach(card => {
            const id = card.dataset.spriteId;

            card.querySelector('.btn-view').addEventListener('click', (e) => {
                e.stopPropagation();
                showSpriteDetail(id);
            });

            card.querySelector('.btn-download').addEventListener('click', (e) => {
                e.stopPropagation();
                downloadSprite(id);
            });

            card.querySelector('.btn-delete').addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('¿Estás seguro de que quieres eliminar este sprite?')) {
                    deleteSprite(id);
                }
            });
        });
    };

    // Mostrar detalles del sprite
    const showSpriteDetail = (spriteId) => {
        const sprite = Storage.getSprite(spriteId);
        if (!sprite) return;

        currentDetailSprite = sprite;

        document.getElementById('galleryContainer').classList.add('hidden');
        document.getElementById('detailView').classList.remove('hidden');

        document.getElementById('detailTitle').textContent = sprite.title || 'Sprite';
        document.getElementById('detailImage').src = sprite.imageData;
        document.getElementById('detailDescription').textContent = sprite.description;
        document.getElementById('detailCategory').textContent = sprite.category;
        document.getElementById('detailStyle').textContent = sprite.style;
        document.getElementById('detailSize').textContent = `${sprite.size}x${sprite.size}px`;
        document.getElementById('detailDate').textContent = new Date(sprite.timestamp).toLocaleString();
        document.getElementById('detailPrompt').textContent = sprite.metadata?.prompt || sprite.description;

        // Etiquetas
        const tagsContainer = document.getElementById('detailTags');
        tagsContainer.innerHTML = sprite.tags.map(tag => 
            `<span class="tag">${tag}</span>`
        ).join('');
    };

    // Volver a galería
    const backToGallery = () => {
        document.getElementById('detailView').classList.add('hidden');
        document.getElementById('galleryContainer').classList.remove('hidden');
        currentDetailSprite = null;
    };

    // Descargar sprite
    const downloadSprite = (spriteId) => {
        const sprite = Storage.getSprite(spriteId);
        if (!sprite) return;

        const link = document.createElement('a');
        link.href = sprite.imageData;
        link.download = `${sprite.title || 'sprite'}_${spriteId}.png`;
        link.click();

        showToast('✅ Sprite descargado', 'success');
    };

    // Eliminar sprite
    const deleteSprite = (spriteId) => {
        Storage.deleteSprite(spriteId);
        showToast('🗑️ Sprite eliminado', 'success');
        updateGallery();
        backToGallery();
    };

    // Actualizar galería
    const updateGallery = () => {
        const query = document.getElementById('searchInput')?.value || '';
        const category = document.getElementById('filterCategory')?.value || '';
        const sortBy = document.getElementById('sortBy')?.value || 'reciente';

        let sprites = Storage.searchSprites(query, { category });
        sprites = Storage.sortSprites(sprites, sortBy);

        renderGallery(sprites);
        updateStats();
    };

    // Actualizar estadísticas
    const updateStats = () => {
        const stats = Storage.getStatistics();
        const storage = Storage.getStorageUsage();

        document.getElementById('statCount').textContent = stats.totalGenerated;
        document.getElementById('statStorage').textContent = storage.formatted;
    };

    // Modales
    const openSettings = () => {
        document.getElementById('settingsModal').classList.remove('hidden');
        loadSettingsForm();
    };

    const closeSettings = () => {
        document.getElementById('settingsModal').classList.add('hidden');
    };

    const openStats = () => {
        document.getElementById('statsModal').classList.remove('hidden');
        loadStatsModal();
    };

    const closeStats = () => {
        document.getElementById('statsModal').classList.add('hidden');
    };

    // Cargar formulario de configuraciones
    const loadSettingsForm = () => {
        const settings = Storage.getSettings();
        const apiKey = Storage.getAPIKey();

        document.getElementById('apiKeyInput').value = apiKey;
        document.getElementById('apiKeySaved').checked = !!apiKey;
        document.getElementById('darkMode').checked = settings.darkMode;
        document.getElementById('compactView').checked = settings.compactView;
        document.getElementById('autoSave').checked = settings.autoSave;
        document.getElementById('maxTokens').value = settings.maxTokens;
        document.getElementById('timeout').value = settings.timeout;
    };

    // Cargar modal de estadísticas
    const loadStatsModal = () => {
        const stats = Storage.getStatistics();

        document.getElementById('statTotalGenerated').textContent = stats.totalGenerated;
        document.getElementById('statStorageUsed').textContent = `${stats.storageUsed} MB`;
        document.getElementById('statAvgTime').textContent = stats.averageTime;
        document.getElementById('statFavoriteCategory').textContent = stats.favoriteCategory;

        // Gráficos simples
        const categoryChart = document.getElementById('categoryChart');
        categoryChart.innerHTML = Object.entries(stats.categoryDistribution)
            .map(([cat, count]) => `
                <div style="margin: 5px 0;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                        <span>${cat}: </span>
                        <span>${count}</span>
                    </div>
                    <div style="width: 100%; height: 20px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
                        <div style="width: ${(count / stats.totalGenerated * 100) || 0}%; height: 100%; background: linear-gradient(90deg, #6366f1, #8b5cf6);"></div>
                    </div>
                </div>
            `).join('');

        // Actividad reciente
        const recentSprites = Storage.getSprites().slice(0, 5);
        const activityList = document.getElementById('recentActivityList');
        activityList.innerHTML = recentSprites.map(sprite => `
            <div class="activity-item">
                <strong>${sprite.title || 'Sprite'}</strong>
                <small>${new Date(sprite.timestamp).toLocaleString()}</small>
                <p>${sprite.category}</p>
            </div>
        `).join('');
    };

    // Exportar datos
    const exportData = () => {
        const data = Storage.exportData();
        if (!data) {
            showToast('❌ Error al exportar datos', 'error');
            return;
        }

        const link = document.createElement('a');
        link.href = 'data:application/json,' + encodeURIComponent(data);
        link.download = `sprite-generator-backup-${Date.now()}.json`;
        link.click();

        showToast('✅ Datos exportados', 'success');
    };

    // Importar datos
    const importData = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const result = Storage.importData(event.target.result);
                    if (result.success) {
                        showToast(`✅ ${result.spritesImported} sprites importados`, 'success');
                        updateGallery();
                    } else {
                        showToast(`❌ Error: ${result.error}`, 'error');
                    }
                } catch (error) {
                    showToast('❌ Error al importar archivo', 'error');
                }
            };
            reader.readAsText(file);
        });

        input.click();
    };

    return {
        showLoading,
        showToast,
        renderGallery,
        showSpriteDetail,
        backToGallery,
        downloadSprite,
        deleteSprite,
        updateGallery,
        updateStats,
        openSettings,
        closeSettings,
        openStats,
        closeStats,
        loadSettingsForm,
        loadStatsModal,
        exportData,
        importData
    };
})();
