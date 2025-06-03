// Haupt-Anwendungsfunktionen
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

// Verbesserte loadFile Funktion mit besserer Fehlerbehandlung
function loadFile(event, targetId) {
    const file = event.target.files[0];
    if (!file) return;

    // Prüfe ob es ein Bild ist
    if (!file.type.startsWith('image/')) {
        alert('Bitte wählen Sie eine Bilddatei aus.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const targetImage = document.getElementById(targetId);
        if (targetImage) {
            targetImage.src = e.target.result;

            // Auch das entsprechende URL-Input-Feld leeren
            if (targetId === 'img1') {
                document.getElementById('input-img1').value = '';
            } else if (targetId === 'img2') {
                document.getElementById('input-img2').value = '';
            }
        }
    };

    reader.onerror = function () {
        alert('Fehler beim Laden der Datei. Bitte versuchen Sie es erneut.');
    };

    reader.readAsDataURL(file);
}

// Reset-Funktion
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
}

// Verbesserte PDF-Generierung mit besserer Qualität
async function downloadPDF() {
    try {
        const { jsPDF } = window.jspdf;
        const a5Wrapper = document.querySelector('.a5-wrapper');

        if (!a5Wrapper) {
            alert('Fehler: PDF-Bereich nicht gefunden.');
            return;
        }

        // Verbesserte html2canvas Optionen für bessere PDF-Qualität
        const canvas = await html2canvas(a5Wrapper, {
            scale: 3, // Höhere Auflösung
            useCORS: true, // Für externe Bilder
            allowTaint: false,
            backgroundColor: '#ffffff',
            logging: false,
            width: a5Wrapper.offsetWidth,
            height: a5Wrapper.offsetHeight,
            onclone: function (clonedDoc) {
                // Styles für geklontes Dokument optimieren
                const clonedElement = clonedDoc.querySelector('.a5-wrapper');
                if (clonedElement) {
                    clonedElement.style.transform = 'none';
                    clonedElement.style.boxShadow = 'none';
                }

                // Text-Gradienten für PDF optimieren
                const gradientElements = clonedDoc.querySelectorAll('.text-gradient');
                gradientElements.forEach(el => {
                    el.style.background = 'none';
                    el.style.color = '#1e3a8a';
                    el.style.webkitTextFillColor = 'initial';
                });
            }
        });

        const imgData = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF('portrait', 'mm', 'a4');

        // A5 zentriert in A4 positionieren
        const x = (210 - 148) / 2; // A4 width = 210mm, A5 width = 148mm
        const y = (297 - 210) / 2; // A4 height = 297mm, A5 height = 210mm

        pdf.addImage(imgData, 'PNG', x, y, 148, 210, '', 'FAST');
        pdf.save('einladung.pdf');

    } catch (error) {
        console.error('Fehler beim PDF-Export:', error);
        alert('Fehler beim PDF-Export. Bitte versuchen Sie es erneut.');
    }
}

// Event Listeners nach DOM-Load
document.addEventListener('DOMContentLoaded', function () {
    // Initiale Anwendung der Werte
    applyInput();

    // Auto-Update bei Eingabeänderungen
    const inputs = document.querySelectorAll('#editor input[type="text"], #editor input:not([type="file"])');
    inputs.forEach(input => {
        if (input.type !== 'file') {
            input.addEventListener('input', applyInput);
        }
    });
});