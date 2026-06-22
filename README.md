# 🎮 Sprite Generator 3D

Una aplicación web interactiva para generar sprites 3D stylizados usando **Google Gemini API**.

## ✨ Características

- 🤖 **Generación con IA**: Usa Gemini para crear prompts optimizados
- 🎨 **Galería de Sprites**: Visualiza todos tus sprites generados
- 💾 **Descarga**: Guarda sprites en alta resolución
- 🔍 **Búsqueda y Filtrado**: Encuentra sprites por tema o etiqueta
- 📋 **Historial**: Acceso a todas tus generaciones anteriores
- 🏷️ **Etiquetado**: Organiza sprites por categorías
- 📊 **Estadísticas**: Seguimiento de generaciones
- 🌙 **Modo Oscuro**: Interfaz personalizable

## 🚀 Instalación Rápida

### Opción 1: GitHub Pages (Recomendado)
1. Clona el repositorio
2. Ve a Settings → Pages
3. Selecciona `main` como rama de origen
4. ¡Accede a tu app en línea!

### Opción 2: Local
```bash
git clone https://github.com/cvgcvg/sprite-generator-3d.git
cd sprite-generator-3d
python -m http.server 8000
# Abre http://localhost:8000 en tu navegador
```

## 🔑 Configuración de API Key

### Paso 1: Obtén una API Key Gratuita
1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikeys)
2. Clic en "Create API Key"
3. Copia tu clave

### Paso 2: Configúrala en la App
1. Abre la aplicación
2. Clic en ⚙️ (Configuración)
3. Pega tu API Key
4. ¡Listo!

## 📖 Cómo Usar

### 1️⃣ Describe tu Sprite
Escribe una descripción detallada en el panel izquierdo:
- "Guerrero futurista con armadura azul y espada de energía"
- "Dragón rojo volador con fuego"
- "Cofre del tesoro antiguo dorado"

### 2️⃣ Configura los Parámetros
- **Categoría**: Personaje, Enemigo, Objeto, etc.
- **Estilo**: 3D Stylizado, Cartoon, Realista, etc.
- **Tamaño**: 256x256, 512x512, 1024x1024
- **Efectos**: Activa para añadir efectos especiales

### 3️⃣ Genera
Haz clic en **"✨ Generar Sprite"** y espera

### 4️⃣ Gestiona
- **Descargar**: Guarda el sprite en tu computadora
- **Buscar**: Usa la barra de búsqueda
- **Etiquetar**: Organiza tus sprites
- **Eliminar**: Borra los que no necesites

## 🔐 Seguridad

✅ **Tu API Key está segura**
- Se almacena SOLO en tu navegador
- No se envía a servidores externos
- Puedes eliminarla en cualquier momento

## 📁 Estructura del Proyecto

```
sprite-generator-3d/
├── index.html              # Interfaz principal
├── css/
│   └── styles.css          # Estilos completos
├── js/
│   ├── app.js              # Lógica principal
│   ├── gemini-api.js       # Integración Gemini
│   ├── storage.js          # Almacenamiento local
│   └── ui.js               # Gestión de interfaz
└── README.md               # Este archivo
```

## 🎨 Personalización

### Temas Disponibles
Puedes cambiar entre modo claro y oscuro en ⚙️ Configuración

### Categorías de Sprites
- 👤 **Personaje**: Héroes, NPCs
- 👹 **Enemigo**: Jefes, enemigos
- 🎁 **Objeto**: Items, equipamiento
- 🏞️ **Escenario**: Fondos, ambientes
- 🚗 **Vehículo**: Coches, naves
- ⚔️ **Arma**: Espadas, armas
- ✨ **Efecto**: Explosiones, magia

### Estilos de Renderizado
- **3D Stylizado**: Baja poligonización, colores vibrantes
- **Cartoon**: Contornos negros, colores sólidos
- **Realista**: Detallado, profesional
- **Pixel Art**: Retro, 8-bit
- **Anime**: Estilo japonés

## 🛠️ Funcionalidades Avanzadas

### Exportar/Importar Datos
- Exporta todos tus sprites en JSON
- Importa desde otro navegador o dispositivo
- Copia de seguridad automática

### Estadísticas
- Visualiza gráficos de sprites generados
- Categoría favorita
- Tiempo de generación promedio
- Historial de actividad

### Almacenamiento
- Espacio ilimitado (limitado por navegador)
- Sincronización local automática
- Gestión de datos integrada

## ⚡ Optimizaciones

- **Carga rápida**: Interfaz optimizada
- **Sin servidor**: Todo funciona localmente
- **Escalable**: Maneja cientos de sprites
- **Responsive**: Funciona en móviles y tablets

## 🐛 Solución de Problemas

### "API Key no válida"
```
❌ Problema: La clave no funciona
✅ Solución: 
   1. Verifica en https://aistudio.google.com/app/apikeys
   2. Genera una nueva clave
   3. Copia sin espacios en blanco
```

### "La generación es lenta"
```
❌ Problema: Tarda mucho tiempo
✅ Solución:
   1. Es normal (10-30 segundos)
   2. Verifica tu conexión
   3. Intenta con descripciones más simples
```

### "Los datos no se guardan"
```
❌ Problema: Pierdo mis sprites
✅ Solución:
   1. Verifica que el navegador permita almacenamiento
   2. No uses modo privado/incógnito
   3. Limpia caché si hay conflictos
```

### "No puedo generar imágenes"
```
❌ Problema: Error de generación
✅ Solución:
   1. Asegúrate de tener API Key válida
   2. Revisa tu cuota en Google AI Studio
   3. Intenta con otra descripción
```

## 📚 API Reference

### Gemini 2.0 Flash
- **Endpoint**: Google Generative AI API
- **Modelo**: gemini-2.0-flash
- **Max Tokens**: 1000 (configurable)
- **Timeout**: 30 segundos (configurable)

### Storage Local
- **Límite**: Hasta 10MB por dominio
- **Persistencia**: Mientras no limpies caché
- **Respaldo**: Función de exportación disponible

## 🚀 Próximas Características

- [ ] Integración con múltiples modelos de IA
- [ ] Generación de spritesheet
- [ ] Editor integrado
- [ ] Compartir sprites con comunidad
- [ ] Historial de versiones
- [ ] Animación automática
- [ ] Convertidor de formatos

## 📝 Licencia

MIT License - Libre para uso personal y comercial

## 🤝 Contribuciones

¿Ideas para mejorar? ¡Abre un Issue o Pull Request!

## 📞 Soporte

- 📧 Email: Contacta al autor
- 🐛 Issues: Reporta problemas en GitHub
- 💬 Discussions: Únete a la comunidad

---

**Creado por**: @cvgcvg  
**Tecnología**: Gemini API + Vanilla JavaScript + LocalStorage  
**Estado**: 🚀 En desarrollo activo  
**Última actualización**: 2024

### Consejos para Mejores Resultados

1. **Sé específico**: Cuanto más detallado, mejor el resultado
2. **Describe el estilo**: Menciona si quieres futurista, medieval, etc.
3. **Especifica colores**: "Con armadura azul y rojo" funciona mejor
4. **Usa etiquetas**: Facilita encontrar sprites después
5. **Experimenta**: Prueba diferentes estilos y tamaños

¡Diviértete creando sprites! 🎮✨
