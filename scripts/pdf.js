// === PDF GENERATION ===

let isDoublePDF = false;

function toggleDoublePDF() {
    isDoublePDF = !isDoublePDF;
    const button = document.getElementById('toggle-double-pdf');
    const icon = document.getElementById('double-pdf-icon');

    if (button && icon) {
        if (isDoublePDF) {
            button.classList.add('btn-success');
            button.classList.remove('btn-outline-secondary');
            icon.textContent = '📄📄';
            button.querySelector('span:last-child').textContent = 'Doppel-PDF aktiv';
        } else {
            button.classList.remove('btn-success');
            button.classList.add('btn-outline-secondary');
            icon.textContent = '📄';
            button.querySelector('span:last-child').textContent = 'Doppel-PDF';
        }
    }

    console.log(`Doppel-PDF ${isDoublePDF ? 'aktiviert' : 'deaktiviert'}`);
}

async function downloadPDF() {
    try {
        const { jsPDF } = window.jspdf;
        const a5Wrapper = document.querySelector('.a5-wrapper');

        if (!a5Wrapper) {
            alert('Fehler: PDF-Bereich nicht gefunden.');
            return;
        }

        // Loading-Indikator anzeigen
        const downloadBtn = document.querySelector('[data-action="download-pdf"]');
        const originalText = downloadBtn ? downloadBtn.innerHTML : '';
        if (downloadBtn) {
            downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> PDF wird erstellt...';
            downloadBtn.disabled = true;
        }

        // Theme-spezifische Optimierungen
        const theme = getCurrentTheme();

        // PDF erstellen
        const pdf = new jsPDF('portrait', 'mm', 'a4');

        if (isDoublePDF) {
            await createDoublePDF(pdf, a5Wrapper, theme);
        } else {
            await createSinglePDF(pdf, a5Wrapper, theme);
        }

        // PDF speichern
        const themeName = getCurrentThemeName();
        const filename = `einladung_${themeName}_${isDoublePDF ? 'doppel' : 'einzel'}.pdf`;
        pdf.save(filename);

        // Button zurücksetzen
        if (downloadBtn) {
            downloadBtn.innerHTML = originalText;
            downloadBtn.disabled = false;
        }

        console.log(`PDF erfolgreich erstellt: ${filename}`);

    } catch (error) {
        console.error('Fehler beim PDF-Export:', error);
        alert('Fehler beim PDF-Export. Bitte versuchen Sie es erneut.');

        // Button zurücksetzen
        const downloadBtn = document.querySelector('[data-action="download-pdf"]');
        if (downloadBtn) {
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Als PDF speichern';
            downloadBtn.disabled = false;
        }
    }
}

async function createSinglePDF(pdf, element, theme) {
    const canvas = await html2canvas(element, {
        scale: 3,
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

    // A5 zentriert positionieren
    const x = (210 - 148) / 2; // A4 width = 210mm, A5 width = 148mm
    const y = (297 - 210) / 2; // A4 height = 297mm, A5 height = 210mm

    pdf.addImage(imgData, 'PNG', x, y, 148, 210, '', 'FAST');
}

async function createDoublePDF(pdf, element, theme) {
    const canvas = await html2canvas(element, {
        scale: 2.5,
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

    // Zwei A5-Einladungen untereinander - angepasst für A4
    // A4: 210x297mm, optimale Aufteilung
    const scale = 0.68; // Kleinere Skalierung damit beide passen
    const width = 148 * scale;   // ~100.6mm
    const height = 210 * scale;  // ~142.8mm
    const x = (210 - width) / 2; // Horizontal zentriert

    // Vertikale Positionierung mit gleichmäßigen Abständen
    const totalContentHeight = height * 2; // Höhe beider Einladungen
    const availableSpace = 297 - totalContentHeight; // Verfügbarer Platz
    const spacing = availableSpace / 3; // Gleichmäßige Verteilung: oben, zwischen, unten

    // Erste Einladung oben
    const y1 = spacing;
    pdf.addImage(imgData, 'PNG', x, y1, width, height, '', 'FAST');

    // Zweite Einladung unten
    const y2 = y1 + height + spacing;
    pdf.addImage(imgData, 'PNG', x, y2, width, height, '', 'FAST');

    console.log(`Doppel-PDF: Skalierung ${scale}, Einladung 1 bei y=${y1}mm, Einladung 2 bei y=${y2}mm`);
}

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

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function initializePDF() {
    // Doppel-PDF Button Event Listener
    const doublePdfBtn = document.querySelector('[data-action="toggle-double-pdf"]');
    if (doublePdfBtn) {
        doublePdfBtn.addEventListener('click', toggleDoublePDF);
    }

    // Download Button Event Listener
    const downloadBtn = document.querySelector('[data-action="download-pdf"]');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadPDF);
    }

    console.log('PDF-System initialisiert');
}

// Funktionen global verfügbar machen
window.toggleDoublePDF = toggleDoublePDF;
window.downloadPDF = downloadPDF; 