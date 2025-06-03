// === THEME MANAGEMENT ===

const themes = {
    modern: {
        name: 'Modern',
        primary: '#667eea',
        secondary: '#764ba2',
        accent: '#f093fb',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        cardBg: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)'
    },
    elegant: {
        name: 'Elegant',
        primary: '#1a1a2e',
        secondary: '#16213e',
        accent: '#e94560',
        gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        cardBg: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
    },
    warm: {
        name: 'Warm',
        primary: '#ee7752',
        secondary: '#e73c7e',
        accent: '#feca57',
        gradient: 'linear-gradient(135deg, #ee7752 0%, #e73c7e 100%)',
        cardBg: 'linear-gradient(145deg, #fff8f5 0%, #fef3f2 100%)'
    }
};

let currentTheme = 'modern';

function setTheme(themeName) {
    if (!themes[themeName]) {
        console.error(`Theme "${themeName}" not found`);
        return;
    }

    currentTheme = themeName;
    const theme = themes[themeName];

    // CSS-Variablen NUR für das PDF/Vorschau setzen
    const a5Wrapper = document.querySelector('.a5-wrapper');
    if (a5Wrapper) {
        a5Wrapper.style.setProperty('--theme-primary', theme.primary);
        a5Wrapper.style.setProperty('--theme-secondary', theme.secondary);
        a5Wrapper.style.setProperty('--theme-accent', theme.accent);
        a5Wrapper.style.setProperty('--theme-gradient', theme.gradient);
        a5Wrapper.style.setProperty('--theme-card-bg', theme.cardBg);

        // Theme-Klasse setzen
        a5Wrapper.className = a5Wrapper.className.replace(/theme-\w+/g, '');
        a5Wrapper.classList.add(`theme-${themeName}`);
    }

    // Body-Gradient setzen (für Hintergrund)
    document.body.style.background = theme.gradient;

    // Theme-Buttons aktualisieren
    updateThemeButtons(themeName);

    console.log(`Theme gewechselt zu: ${theme.name} (nur für PDF)`);
}

function updateThemeButtons(activeTheme) {
    document.querySelectorAll('.theme-option').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-theme') === activeTheme) {
            btn.classList.add('active');
        }
    });
}

function getCurrentTheme() {
    return themes[currentTheme];
}

function getCurrentThemeName() {
    return currentTheme;
}

function initializeThemes() {
    // Theme-Button Event Listeners
    document.querySelectorAll('.theme-option').forEach(button => {
        button.addEventListener('click', function () {
            const theme = this.getAttribute('data-theme');
            if (theme) {
                setTheme(theme);
            }
        });
    });

    // Standard-Theme setzen
    setTheme('modern');

    console.log('Theme-System initialisiert');
}

// Funktionen global verfügbar machen
window.setTheme = setTheme;
window.getCurrentTheme = getCurrentTheme;
window.getCurrentThemeName = getCurrentThemeName; 