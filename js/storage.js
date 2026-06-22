/**
 * Storage Module - Gestión de almacenamiento local
 * Maneja la persistencia de sprites y configuraciones
 */

const Storage = (() => {
    const STORAGE_KEY = 'sprite-generator-data';
    const API_KEY_STORAGE = 'sprite-generator-api-key';
    const SETTINGS_STORAGE = 'sprite-generator-settings';

    // Obtener todos los sprites
    const getSprites = () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error al obtener sprites:', error);
            return [];
        }
    };

    // Guardar un sprite
    const saveSprite = (sprite) => {
        try {
            const sprites = getSprites();
            const newSprite = {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                ...sprite,
                metadata: {
                    ...sprite.metadata,
                    generatedAt: new Date().toISOString(),
                    fileSize: sprite.imageData ? sprite.imageData.length : 0
                }
            };
            sprites.unshift(newSprite);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sprites));
            return newSprite;
        } catch (error) {
            console.error('Error al guardar sprite:', error);
            return null;
        }
    };

    // Obtener un sprite por ID
    const getSprite = (id) => {
        const sprites = getSprites();
        return sprites.find(s => s.id === id);
    };

    // Actualizar un sprite
    const updateSprite = (id, updates) => {
        try {
            const sprites = getSprites();
            const index = sprites.findIndex(s => s.id === id);
            if (index !== -1) {
                sprites[index] = { ...sprites[index], ...updates };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(sprites));
                return sprites[index];
            }
            return null;
        } catch (error) {
            console.error('Error al actualizar sprite:', error);
            return null;
        }
    };

    // Eliminar un sprite
    const deleteSprite = (id) => {
        try {
            const sprites = getSprites();
            const filtered = sprites.filter(s => s.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
            return true;
        } catch (error) {
            console.error('Error al eliminar sprite:', error);
            return false;
        }
    };

    // Buscar sprites
    const searchSprites = (query, filters = {}) => {
        let sprites = getSprites();

        // Filtro por búsqueda de texto
        if (query) {
            const q = query.toLowerCase();
            sprites = sprites.filter(s =>
                s.description.toLowerCase().includes(q) ||
                s.tags.some(t => t.toLowerCase().includes(q)) ||
                (s.title && s.title.toLowerCase().includes(q))
            );
        }

        // Filtro por categoría
        if (filters.category) {
            sprites = sprites.filter(s => s.category === filters.category);
        }

        // Filtro por estilo
        if (filters.style) {
            sprites = sprites.filter(s => s.style === filters.style);
        }

        // Filtro por rango de fechas
        if (filters.dateFrom || filters.dateTo) {
            sprites = sprites.filter(s => {
                const date = new Date(s.timestamp);
                if (filters.dateFrom && date < new Date(filters.dateFrom)) return false;
                if (filters.dateTo && date > new Date(filters.dateTo)) return false;
                return true;
            });
        }

        return sprites;
    };

    // Ordenar sprites
    const sortSprites = (sprites, sortBy = 'reciente') => {
        const sorted = [...sprites];
        switch (sortBy) {
            case 'antiguo':
                return sorted.reverse();
            case 'nombre':
                return sorted.sort((a, b) =>
                    (a.title || '').localeCompare(b.title || '')
                );
            case 'reciente':
            default:
                return sorted;
        }
    };

    // Guardar API Key
    const saveAPIKey = (key) => {
        try {
            localStorage.setItem(API_KEY_STORAGE, key);
            return true;
        } catch (error) {
            console.error('Error al guardar API Key:', error);
            return false;
        }
    };

    // Obtener API Key
    const getAPIKey = () => {
        try {
            return localStorage.getItem(API_KEY_STORAGE) || '';
        } catch (error) {
            console.error('Error al obtener API Key:', error);
            return '';
        }
    };

    // Limpiar API Key
    const clearAPIKey = () => {
        try {
            localStorage.removeItem(API_KEY_STORAGE);
            return true;
        } catch (error) {
            console.error('Error al limpiar API Key:', error);
            return false;
        }
    };

    // Guardar configuraciones
    const saveSettings = (settings) => {
        try {
            const current = getSettings();
            const merged = { ...current, ...settings };
            localStorage.setItem(SETTINGS_STORAGE, JSON.stringify(merged));
            return merged;
        } catch (error) {
            console.error('Error al guardar configuraciones:', error);
            return null;
        }
    };

    // Obtener configuraciones
    const getSettings = () => {
        try {
            const data = localStorage.getItem(SETTINGS_STORAGE);
            return data ? JSON.parse(data) : getDefaultSettings();
        } catch (error) {
            console.error('Error al obtener configuraciones:', error);
            return getDefaultSettings();
        }
    };

    // Configuraciones por defecto
    const getDefaultSettings = () => ({
        darkMode: false,
        compactView: true,
        autoSave: true,
        maxTokens: 1000,
        timeout: 30,
        language: 'es'
    });

    // Calcular estadísticas
    const getStatistics = () => {
        const sprites = getSprites();
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Contar por categoría
        const categoryCount = {};
        sprites.forEach(s => {
            categoryCount[s.category] = (categoryCount[s.category] || 0) + 1;
        });

        // Sprites en los últimos 7 días
        const recentSprites = sprites.filter(s =>
            new Date(s.timestamp) > sevenDaysAgo
        );

        // Calcular tamaño total
        const totalSize = sprites.reduce((sum, s) =>
            sum + (s.metadata?.fileSize || 0), 0
        );

        // Encontrar categoría favorita
        const favoriteCategory = Object.entries(categoryCount)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

        // Contar por día
        const dailyCounts = {};
        sprites.forEach(s => {
            const date = new Date(s.timestamp).toLocaleDateString();
            dailyCounts[date] = (dailyCounts[date] || 0) + 1;
        });

        return {
            totalGenerated: sprites.length,
            storageUsed: (totalSize / (1024 * 1024)).toFixed(2),
            recentCount: recentSprites.length,
            categoryDistribution: categoryCount,
            favoriteCategory,
            dailyDistribution: dailyCounts,
            averageTime: calculateAverageTime(sprites)
        };
    };

    // Calcular tiempo promedio
    const calculateAverageTime = (sprites) => {
        if (sprites.length === 0) return '0s';

        const totalTime = sprites.reduce((sum, s) =>
            sum + (s.metadata?.generationTime || 0), 0
        );

        const averageMs = totalTime / sprites.length;
        return `${(averageMs / 1000).toFixed(1)}s`;
    };

    // Exportar datos
    const exportData = () => {
        try {
            const sprites = getSprites();
            const settings = getSettings();
            const stats = getStatistics();

            const exportedData = {
                version: '1.0',
                exportDate: new Date().toISOString(),
                sprites,
                settings,
                statistics: stats
            };

            return JSON.stringify(exportedData, null, 2);
        } catch (error) {
            console.error('Error al exportar datos:', error);
            return null;
        }
    };

    // Importar datos
    const importData = (jsonString) => {
        try {
            const data = JSON.parse(jsonString);

            if (!data.sprites || !Array.isArray(data.sprites)) {
                throw new Error('Formato de importación inválido');
            }

            const currentSprites = getSprites();
            const mergedSprites = [...data.sprites, ...currentSprites];

            localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedSprites));

            if (data.settings) {
                saveSettings(data.settings);
            }

            return {
                success: true,
                spritesImported: data.sprites.length
            };
        } catch (error) {
            console.error('Error al importar datos:', error);
            return {
                success: false,
                error: error.message
            };
        }
    };

    // Limpiar todos los datos
    const clearAllData = () => {
        try {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(API_KEY_STORAGE);
            localStorage.removeItem(SETTINGS_STORAGE);
            return true;
        } catch (error) {
            console.error('Error al limpiar datos:', error);
            return false;
        }
    };

    // Calcular uso de almacenamiento
    const getStorageUsage = () => {
        try {
            let total = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    total += localStorage[key].length + key.length;
                }
            }
            return {
                used: (total / 1024).toFixed(2),
                formatted: `${(total / 1024).toFixed(2)} KB`
            };
        } catch (error) {
            console.error('Error al calcular almacenamiento:', error);
            return { used: 0, formatted: '0 KB' };
        }
    };

    return {
        getSprites,
        saveSprite,
        getSprite,
        updateSprite,
        deleteSprite,
        searchSprites,
        sortSprites,
        saveAPIKey,
        getAPIKey,
        clearAPIKey,
        saveSettings,
        getSettings,
        getDefaultSettings,
        getStatistics,
        exportData,
        importData,
        clearAllData,
        getStorageUsage
    };
})();
