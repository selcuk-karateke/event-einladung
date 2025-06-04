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
        // PDF-spezifische Optimierungen - überschreibt Mobile Styles
        clonedElement.style.cssText = `
            width: 148mm !important;
            height: 210mm !important;
            transform: none !important;
            margin: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            overflow: hidden !important;
            box-shadow: 0 0 20px rgba(0,0,0,0.1) !important;
            border-radius: 20px !important;
            background: var(--theme-card-bg) !important;
            position: relative !important;
        `;

        // Angled Background für PDF optimieren
        const angledBg = clonedElement.querySelector('.angled-bg');
        if (angledBg) {
            angledBg.style.cssText = `
                padding: 3rem 2rem !important;
                transform: skewY(-2deg) !important;
                background: var(--theme-card-bg) !important;
                border-radius: 20px !important;
                position: relative !important;
                z-index: 1 !important;
            `;

            // Theme-spezifische Skew-Werte
            if (clonedElement.classList.contains('theme-modern')) {
                angledBg.style.transform = 'skewY(-4deg) !important';
            } else if (clonedElement.classList.contains('theme-warm')) {
                angledBg.style.transform = 'skewY(-3deg) !important';
            }
        }

        // Angled Content für PDF optimieren
        const angledContent = clonedElement.querySelectorAll('.angled-content');
        angledContent.forEach(content => {
            content.style.cssText = `
                transform: skewY(2deg) !important;
                position: relative !important;
                z-index: 2 !important;
            `;

            // Theme-spezifische Skew-Werte
            if (clonedElement.classList.contains('theme-modern')) {
                content.style.transform = 'skewY(4deg) !important';
            } else if (clonedElement.classList.contains('theme-warm')) {
                content.style.transform = 'skewY(3deg) !important';
            }
        });

        // Footer für PDF optimieren
        const footer = clonedElement.querySelector('.angled-footer');
        if (footer) {
            footer.style.cssText = `
                padding: 1.5rem 2rem !important;
                margin-top: -2rem !important;
                transform: skewY(-2deg) !important;
                background: linear-gradient(135deg, var(--theme-primary), var(--theme-secondary)) !important;
                border-radius: 20px !important;
                color: white !important;
                position: relative !important;
                min-height: 60px !important;
            `;

            // Theme-spezifische Werte
            if (clonedElement.classList.contains('theme-modern')) {
                footer.style.transform = 'skewY(-4deg) !important';
            } else if (clonedElement.classList.contains('theme-elegant')) {
                footer.style.marginTop = '-1rem !important';
            } else if (clonedElement.classList.contains('theme-warm')) {
                footer.style.transform = 'skewY(-3deg) !important';
            }
        }

        // Desktop Bildgrößen für PDF
        const heroIcon = clonedElement.querySelector('.hero-icon');
        if (heroIcon) {
            heroIcon.style.cssText = `
                width: 80px !important;
                height: 80px !important;
                border-radius: 50% !important;
                object-fit: cover !important;
            `;
        }

        const speakerImgs = clonedElement.querySelectorAll('.speaker-img');
        speakerImgs.forEach(img => {
            img.style.cssText = `
                width: 100px !important;
                height: 100px !important;
                border-radius: 50% !important;
                object-fit: cover !important;
            `;
        });

        // Desktop Typografie für PDF
        const h1Elements = clonedElement.querySelectorAll('h1');
        h1Elements.forEach(h1 => {
            let fontSize = '1.8rem';
            if (clonedElement.classList.contains('theme-elegant') || clonedElement.classList.contains('theme-warm')) {
                fontSize = '1.9rem';
            }
            h1.style.cssText = `
                font-size: ${fontSize} !important;
                margin-bottom: 0.5rem !important;
                line-height: 1.2 !important;
                font-weight: 700 !important;
            `;
        });

        const h2Elements = clonedElement.querySelectorAll('h2');
        h2Elements.forEach(h2 => {
            let fontSize = '1.3rem';
            if (clonedElement.classList.contains('theme-elegant')) {
                fontSize = '1.4rem';
            }
            h2.style.cssText = `
                font-size: ${fontSize} !important;
                margin-bottom: 1rem !important;
                line-height: 1.2 !important;
                font-weight: 600 !important;
            `;
        });

        // Desktop Padding für PDF
        const eventDetails = clonedElement.querySelector('.event-details');
        if (eventDetails) {
            eventDetails.style.cssText = `
                padding: 1.5rem !important;
                margin: 1.5rem 0 !important;
            `;
        }

        const speakerCards = clonedElement.querySelectorAll('.speaker-card');
        speakerCards.forEach(card => {
            card.style.cssText = `
                padding: 1rem !important;
            `;
        });
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