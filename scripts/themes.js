// === EINFACHES THEME SYSTEM ===

const themes = {
    modern: { primary: '#667eea', secondary: '#764ba2', accent: '#f093fb' },
    elegant: { primary: '#1a1a2e', secondary: '#16213e', accent: '#e94560' },
    warm: { primary: '#ee7752', secondary: '#e73c7e', accent: '#feca57' }
};

let currentTheme = 'modern';

function setTheme(themeName) {
    if (!themes[themeName]) return;

    currentTheme = themeName;
    const theme = themes[themeName];
    const wrapper = document.querySelector('.a5-wrapper');

    if (wrapper) {
        wrapper.style.setProperty('--theme-primary', theme.primary);
        wrapper.style.setProperty('--theme-secondary', theme.secondary);
        wrapper.style.setProperty('--theme-accent', theme.accent);
        wrapper.className = wrapper.className.replace(/theme-\w+/g, '');
        wrapper.classList.add(`theme-${themeName}`);
    }

    document.querySelectorAll('.theme-option').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-theme') === themeName) {
            btn.classList.add('active');
        }
    });

    const customAccent = document.getElementById('custom-accent');
    if (customAccent) customAccent.value = theme.accent;
}

function applyCustomColors() {
    const customBg = document.getElementById('custom-bg');
    const customAccent = document.getElementById('custom-accent');
    const wrapper = document.querySelector('.a5-wrapper');

    if (wrapper && customBg && customAccent) {
        wrapper.style.setProperty('--theme-card-bg', customBg.value);
        wrapper.style.setProperty('--theme-accent', customAccent.value);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.theme-option').forEach(button => {
        button.addEventListener('click', function () {
            setTheme(this.getAttribute('data-theme'));
        });
    });

    const customBg = document.getElementById('custom-bg');
    const customAccent = document.getElementById('custom-accent');

    if (customBg) customBg.addEventListener('input', applyCustomColors);
    if (customAccent) customAccent.addEventListener('input', applyCustomColors);

    setTheme('modern');
}); 