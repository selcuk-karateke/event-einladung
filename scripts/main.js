// === CORE FUNCTIONALITY ===

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

// === BILD-UPLOAD-FUNKTION ===
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

// === INITIALISIERUNG ===
function initializeApp() {
    // Initiale Anwendung der Werte
    applyInput();

    // Auto-Update bei Eingabeänderungen - auch für textarea
    const inputs = document.querySelectorAll('#input-title, #input-subtitle, #input-presenter1, #input-presenter2, #input-date, #input-time, #input-location, #input-name1, #input-name2, #input-img1, #input-img2');
    inputs.forEach(input => {
        input.addEventListener('input', applyInput);
    });

    // Button Event Listeners
    const applyBtn = document.querySelector('[data-action="apply"]');
    if (applyBtn) applyBtn.addEventListener('click', applyInput);

    const resetBtn = document.querySelector('[data-action="reset"]');
    if (resetBtn) resetBtn.addEventListener('click', resetForm);

    console.log('App initialisiert - Core-Funktionalität geladen');
}

// === EVENT LISTENERS ===
document.addEventListener('DOMContentLoaded', function () {
    // Core App initialisieren
    initializeApp();

    // Theme-System initialisieren (falls themes.js geladen)
    if (typeof initializeThemes === 'function') {
        initializeThemes();
    }

    // PDF-System initialisieren (falls pdf.js geladen)
    if (typeof initializePDF === 'function') {
        initializePDF();
    }

    console.log('Event Einladung Generator 2.0 - Modular Edition geladen');
});

// === FUNKTIONEN GLOBAL VERFÜGBAR MACHEN ===
window.applyInput = applyInput;
window.resetForm = resetForm;
window.loadFile = loadFile;