// === GLOBALE VARIABLEN ===
let currentTheme = 'modern';
let isDoublePDF = false;

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
        primary: '#134e5e',
        secondary: '#71b280',
        accent: '#d4af37',
        gradient: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
        cardBg: 'linear-gradient(145deg, #fdfcfb 0%, #e2d1c3 100%)'
    },
    warm: {
        name: 'Warm',
        primary: '#ff9a9e',
        secondary: '#fecfef',
        accent: '#ff6b6b',
        gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        cardBg: 'linear-gradient(145deg, #fff5f5 0%, #fed7d7 100%)'
    }
};

function setTheme(themeName) {
    currentTheme = themeName;
    const theme = themes[themeName];

    // CSS-Variablen setzen
    document.documentElement.style.setProperty('--theme-primary', theme.primary);
    document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
    document.documentElement.style.setProperty('--theme-accent', theme.accent);
    document.documentElement.style.setProperty('--theme-gradient', theme.gradient);
    document.documentElement.style.setProperty('--theme-card-bg', theme.cardBg);

    // Body-Gradient setzen
    document.body.style.background = theme.gradient;

    // Theme-Klasse setzen
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${themeName}`);

    // Theme-Buttons aktualisieren
    document.querySelectorAll('.theme-option').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-theme="${themeName}"]`)?.classList.add('active');

    console.log(`Theme gewechselt zu: ${theme.name}`);
}

// === HAUPT-ANWENDUNGSFUNKTIONEN ===
function applyInput() {
    document.getElementById('title').textContent = document.getElementById('input-title').value;
    document.getElementById('subtitle').textContent = document.getElementById('input-subtitle').value;
    document.getElementById('presenter1').textContent = document.getElementById('input-presenter1').value;
    document.getElementById('presenter2').textContent = document.getElementById('input-presenter2').value;
    document.getElementById('event-date').textContent = document.getElementById('input-date').value;
    document.getElementById('event-time').textContent = document.getElementById('input-time').value;
    document.getElementById('event-location').textContent = document.getElementById('input-location').value;
    document.getElementById('name1').textContent = document.getElementById('input-name1').value;
    document.getElementById('name2').textContent = document.getElementById('input-name2').value;

    // URL-Inputs auch anwenden (falls sie geändert wurden)
    const img1Url = document.getElementById('input-img1').value;
    const img2Url = document.getElementById('input-img2').value;

    if (img1Url) {
        document.getElementById('img1').src = img1Url;
    }
    if (img2Url) {
        document.getElementById('img2').src = img2Url;
    }
}

// === VERBESSERTE BILD-UPLOAD-FUNKTION ===
function loadFile(event, targetId) {
    const file = event.target.files[0];
    if (!file) return;

    // Prüfe ob es ein Bild ist
    if (!file.type.startsWith('image/')) {
        alert('Bitte wählen Sie eine Bilddatei aus.');
        return;
    }

    // Dateigröße prüfen (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Die Datei ist zu groß. Bitte wählen Sie ein Bild unter 5MB.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const targetImage = document.getElementById(targetId);
        if (targetImage) {
            targetImage.src = e.target.result;

            // Entsprechende URL-Input-Felder leeren
            if (targetId === 'img1') {
                document.getElementById('input-img1').value = '';
            } else if (targetId === 'img2') {
                document.getElementById('input-img2').value = '';
            }

            console.log(`Bild ${targetId} erfolgreich geladen`);
        }
    };

    reader.onerror = function () {
        alert('Fehler beim Laden der Datei. Bitte versuchen Sie es erneut.');
    };

    reader.readAsDataURL(file);
}

// === RESET-FUNKTION ===
function resetForm() {
    const defaults = {
        'input-title': 'Gesundheit und Nahrungsergänzung',
        'input-subtitle': 'Amway Produkte und der Plan',
        'input-presenter1': 'Referentin: Frau Dr. Anna Skrobot',
        'input-presenter2': 'Referent: Herr Bülent Kazan',
        'input-date': '14. Mai 2023',
        'input-time': '13 Uhr bis 15 Uhr',
        'input-location': 'Beyoglu Restaurant, Oranienburgerstr. 88, 13437 Berlin',
        'input-name1': 'Dr. Anna Skrobot',
        'input-name2': 'Bülent Kazan',
        'input-img1': 'https://placehold.co/120x120?text=Bild+1',
        'input-img2': 'https://placehold.co/120x120?text=Bild+2'
    };

    for (let id in defaults) {
        const element = document.getElementById(id);
        if (element) {
            element.value = defaults[id];
        }
    }

    // Icon zurücksetzen
    document.getElementById('icon-img').src = 'https://placehold.co/100x100?text=Icon';

    // File inputs zurücksetzen
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => input.value = '');

    applyInput();
    console.log('Formular zurückgesetzt');
}

// === DOPPEL-PDF TOGGLE ===
function toggleDoublePDF() {
    isDoublePDF = !isDoublePDF;
    const button = document.getElementById('toggle-double-pdf');
    const icon = document.getElementById('double-pdf-icon');

    if (isDoublePDF) {
        button.classList.add('btn-success');
        button.classList.remove('btn-outline-secondary');
        icon.textContent = '📄📄';
        button.querySelector('span').textContent = 'Doppel-PDF aktiv';
    } else {
        button.classList.remove('btn-success');
        button.classList.add('btn-outline-secondary');
        icon.textContent = '📄';
        button.querySelector('span').textContent = 'Doppel-PDF';
    }

    console.log(`Doppel-PDF ${isDoublePDF ? 'aktiviert' : 'deaktiviert'}`);
}

// === ERWEITERTE PDF-GENERIERUNG ===
async function downloadPDF() {
    try {
        const { jsPDF } = window.jspdf;
        const a5Wrapper = document.querySelector('.a5-wrapper');

        if (!a5Wrapper) {
            alert('Fehler: PDF-Bereich nicht gefunden.');
            return;
        }

        // Loading-Indikator anzeigen
        const downloadBtn = document.querySelector('[onclick="downloadPDF()"]');
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> PDF wird erstellt...';
        downloadBtn.disabled = true;

        // Theme-spezifische Optimierungen
        const theme = themes[currentTheme];

        // PDF erstellen
        const pdf = new jsPDF('portrait', 'mm', 'a4');

        if (isDoublePDF) {
            // Doppel-PDF: Zwei Einladungen pro Seite
            await createDoublePDF(pdf, a5Wrapper, theme);
        } else {
            // Einzel-PDF: Eine Einladung zentriert
            await createSinglePDF(pdf, a5Wrapper, theme);
        }

        // PDF speichern
        const filename = `einladung_${currentTheme}_${isDoublePDF ? 'doppel' : 'einzel'}.pdf`;
        pdf.save(filename);

        // Button zurücksetzen
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;

        console.log(`PDF erfolgreich erstellt: ${filename}`);

    } catch (error) {
        console.error('Fehler beim PDF-Export:', error);
        alert('Fehler beim PDF-Export. Bitte versuchen Sie es erneut.');

        // Button zurücksetzen
        const downloadBtn = document.querySelector('[onclick="downloadPDF()"]');
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Als PDF speichern';
        downloadBtn.disabled = false;
    }
}

// === EINZEL-PDF ERSTELLEN ===
async function createSinglePDF(pdf, element, theme) {
    const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null, // Transparenter Hintergrund
        logging: false,
        width: element.offsetWidth,
        height: element.offsetHeight,
        onclone: function (clonedDoc) {
            optimizeForPDF(clonedDoc, theme);
        }
    });

    const imgData = canvas.toDataURL('image/png', 1.0);

    // A4-Hintergrund mit Theme-Gradient
    addGradientBackground(pdf, theme);

    // A5 zentriert positionieren
    const x = (210 - 148) / 2; // A4 width = 210mm, A5 width = 148mm
    const y = (297 - 210) / 2; // A4 height = 297mm, A5 height = 210mm

    pdf.addImage(imgData, 'PNG', x, y, 148, 210, '', 'FAST');
}

// === DOPPEL-PDF ERSTELLEN ===
async function createDoublePDF(pdf, element, theme) {
    const canvas = await html2canvas(element, {
        scale: 2.5, // Etwas geringere Auflösung für bessere Performance
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        logging: false,
        width: element.offsetWidth,
        height: element.offsetHeight,
        onclone: function (clonedDoc) {
            optimizeForPDF(clonedDoc, theme);
        }
    });

    const imgData = canvas.toDataURL('image/png', 1.0);

    // A4-Hintergrund mit Theme-Gradient
    addGradientBackground(pdf, theme);

    // Zwei A5-Einladungen untereinander
    const scale = 0.9; // Etwas kleiner für besseren Abstand
    const width = 148 * scale;
    const height = 210 * scale;
    const x = (210 - width) / 2;

    // Erste Einladung oben
    const y1 = 20;
    pdf.addImage(imgData, 'PNG', x, y1, width, height, '', 'FAST');

    // Zweite Einladung unten
    const y2 = y1 + height + 15; // 15mm Abstand
    pdf.addImage(imgData, 'PNG', x, y2, width, height, '', 'FAST');
}

// === PDF-OPTIMIERUNG ===
function optimizeForPDF(clonedDoc, theme) {
    const clonedElement = clonedDoc.querySelector('.a5-wrapper');
    if (clonedElement) {
        clonedElement.style.transform = 'none';
        clonedElement.style.boxShadow = '0 0 20px rgba(0,0,0,0.1)';
    }

    // Text-Gradienten für PDF optimieren
    const gradientElements = clonedDoc.querySelectorAll('.text-gradient');
    gradientElements.forEach(el => {
        el.style.background = 'none';
        el.style.color = theme.primary;
        el.style.webkitTextFillColor = 'initial';
    });

    // Alle Elemente für PDF optimieren
    const allElements = clonedDoc.querySelectorAll('*');
    allElements.forEach(el => {
        el.style.webkitPrintColorAdjust = 'exact';
        el.style.printColorAdjust = 'exact';
    });
}

// === GRADIENT-HINTERGRUND HINZUFÜGEN ===
function addGradientBackground(pdf, theme) {
    // Einfacher farbiger Hintergrund in Primärfarbe mit reduzierter Opacity
    const rgb = hexToRgb(theme.primary);
    if (rgb) {
        pdf.setFillColor(rgb.r, rgb.g, rgb.b);
        pdf.setGState(pdf.GState({ opacity: 0.08 }));
        pdf.rect(0, 0, 210, 297, 'F');
        pdf.setGState(pdf.GState({ opacity: 1 })); // Opacity zurücksetzen
    }
}

// === HEX ZU RGB KONVERTER ===
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// === EVENT LISTENERS UND INITIALISIERUNG ===
document.addEventListener('DOMContentLoaded', function () {
    // Standard-Theme setzen
    setTheme('modern');

    // Initiale Anwendung der Werte
    applyInput();

    // Auto-Update bei Eingabeänderungen
    const inputs = document.querySelectorAll('#editor input[type="text"], #editor input:not([type="file"])');
    inputs.forEach(input => {
        if (input.type !== 'file') {
            input.addEventListener('input', applyInput);
        }
    });

    console.log('Event Einladung Generator geladen - Version 2.0');
});