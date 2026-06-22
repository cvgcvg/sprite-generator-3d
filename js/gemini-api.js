/**
 * Gemini API Module - Integración con Google Gemini
 * Genera prompts optimizados y maneja la comunicación con la API
 */

const GeminiAPI = (() => {
    const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    const MODEL = 'gemini-2.0-flash';

    // Obtener API Key
    const getApiKey = () => {
        return Storage.getAPIKey();
    };

    // Validar API Key
    const validateApiKey = async (apiKey) => {
        try {
            const response = await fetch(`${API_ENDPOINT}?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: 'test'
                        }]
                    }]
                })
            });

            return response.ok || response.status === 400;
        } catch (error) {
            console.error('Error validating API Key:', error);
            return false;
        }
    };

    // Generar prompt optimizado para sprite
    const generateSpritePrompt = (description, options = {}) => {
        const {
            category = 'personaje',
            style = '3d-stylizado',
            effects = false,
            size = '512'
        } = options;

        const styleMap = {
            '3d-stylizado': '3D stylized, low polygon, vibrant colors',
            'cartoon': 'Cartoon style, bold outlines, colorful',
            'realista': 'Realistic, detailed, professional quality',
            'pixel-art': '8-bit pixel art, retro style',
            'anime': 'Anime style, detailed, expressive'
        };

        const categoryMap = {
            'personaje': 'game character sprite, standing pose',
            'enemigo': 'game enemy sprite, aggressive stance',
            'objeto': 'game item sprite, isolated object',
            'escenario': 'game environment sprite, background element',
            'vehiculo': 'game vehicle sprite, side view',
            'arma': 'game weapon sprite, detailed design',
            'efecto': 'game effect sprite, particle effect',
            'otro': 'game sprite'
        };

        const effectsText = effects ? ', with special effects, glow, particles' : '';
        const styleText = styleMap[style] || styleMap['3d-stylizado'];
        const categoryText = categoryMap[category] || categoryMap['otro'];

        const prompt = `Create a game sprite image for: "${description}"
Style: ${styleText}
Type: ${categoryText}
Size: ${size}x${size} pixels
Quality: High quality, game-ready${effectsText}
Background: Transparent
Details: Ultra detailed, professional game art

IMPORTANT: 
- Make it a single sprite suitable for video games
- Use a transparent background
- Ensure it's ready to use in game development
- Focus on visual clarity and detail`;

        return prompt;
    };

    // Generar imagen usando Gemini
    const generateImage = async (description, options = {}) => {
        const apiKey = getApiKey();

        if (!apiKey) {
            throw new Error('API Key no configurada. Por favor, configura tu API Key en los ajustes.');
        }

        const prompt = generateSpritePrompt(description, options);
        const startTime = Date.now();

        try {
            UI.showLoading('Generando tu sprite 3D...');

            const response = await Promise.race([
                fetch(`${API_ENDPOINT}?key=${apiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: prompt
                            }]
                        }],
                        generationConfig: {
                            maxOutputTokens: Storage.getSettings().maxTokens || 1000,
                            temperature: 0.7
                        }
                    })
                }),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout')),
                        (Storage.getSettings().timeout || 30) * 1000)
                )
            ]);

            if (!response.ok) {
                const error = await response.json();
                throw new Error(
                    error.error?.message || 
                    `Error en API (${response.status}): ${response.statusText}`
                );
            }

            const data = await response.json();

            if (!data.candidates || !data.candidates[0]) {
                throw new Error('Respuesta inválida de Gemini API');
            }

            const generationTime = Date.now() - startTime;

            return {
                success: true,
                prompt,
                generationTime,
                rawResponse: data,
                message: data.candidates[0].content?.parts[0]?.text || ''
            };

        } catch (error) {
            console.error('Error generating image:', error);
            throw error;
        }
    };

    // Optimizar descripción con Gemini
    const optimizeDescription = async (description) => {
        const apiKey = getApiKey();

        if (!apiKey) {
            throw new Error('API Key no configurada');
        }

        try {
            UI.showLoading('Optimizando descripción...');

            const response = await fetch(`${API_ENDPOINT}?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Eres un experto en diseño de sprites para videojuegos. 
                            
El usuario describe un sprite que quiere crear: "${description}"

Por favor, proporciona:
1. Una descripción mejorada y detallada del sprite
2. Una lista de etiquetas relevantes
3. Una categoría recomendada

Responde en formato simple.`
                        }]
                    }],
                    generationConfig: {
                        maxOutputTokens: 500
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Error al optimizar descripción');
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

            return { text };

        } catch (error) {
            console.error('Error optimizing description:', error);
            throw error;
        }
    };

    return {
        getApiKey,
        validateApiKey,
        generateImage,
        generateSpritePrompt,
        optimizeDescription
    };
})();
