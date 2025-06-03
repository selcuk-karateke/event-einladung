# Event Einladung Generator

Ein webbasiertes Tool zur Erstellung von Event-Einladungen im DIN A5 Format mit PDF-Export.

## 🚀 Neueste Verbesserungen

### ✅ PDF-Qualität verbessert
- **Problem behoben**: PDF wird jetzt exakt wie HTML gerendert
- **Höhere Auflösung**: Scale-Faktor auf 3 erhöht für schärfere Bilder
- **Text-Gradient Optimierung**: Spezielle Behandlung für PDF-Export
- **Bessere Positionierung**: A5 wird perfekt zentriert in A4 platziert
- **Color-Rendering**: `print-color-adjust: exact` für bessere Farbwiedergabe

### 📁 Code-Organisation verbessert
- **CSS ausgelagert**: Alle Styles in `styles/main.css`
- **JavaScript ausgelagert**: Alle Funktionen in `scripts/main.js`
- **Saubere HTML**: Keine Inline-Styles oder -Scripts mehr
- **Modulare Struktur**: Bessere Wartbarkeit und Erweiterbarkeit

### 🖼️ Bild-Upload Problem behoben
- **Verbesserte loadFile-Funktion**: Bessere Fehlerbehandlung
- **Datei-Validierung**: Prüfung auf gültige Bildformate
- **URL-Input Integration**: Synchronisation zwischen File-Upload und URL-Eingabe
- **Error-Handling**: Benutzerfreundliche Fehlermeldungen
- **File-Input Reset**: Ordnungsgemäße Zurücksetzung der Upload-Felder

### 🎯 Zusätzliche Verbesserungen
- **Auto-Update**: Eingaben werden automatisch übernommen
- **Labels für Accessibility**: Bessere Barrierefreiheit
- **Event Listeners**: Moderne JavaScript-Implementierung
- **Print-CSS**: Optimierte Styles für Druck und PDF

## 🛠️ Technische Details

### Projektstruktur
```
event-einladung/
├── index.html          # Haupt-HTML-Datei
├── styles/
│   └── main.css        # Alle CSS-Styles
├── scripts/
│   └── main.js         # Alle JavaScript-Funktionen
└── README.md           # Diese Dokumentation
```

### PDF-Export Verbesserungen
- **html2canvas Optionen**: Optimiert für beste Qualität
- **CORS-Support**: Für externe Bilder
- **Gradient-Handling**: Spezielle Behandlung für Text-Gradienten
- **Skalierung**: 3x Scale für hochauflösende PDFs

### Bild-Upload Features
- **Drag & Drop ready**: Vorbereitet für zukünftige Erweiterungen
- **Multiple Formate**: Unterstützt alle gängigen Bildformate
- **Live-Preview**: Sofortige Anzeige hochgeladener Bilder
- **Fallback-URLs**: Platzhalter wenn kein Bild geladen ist

## 📋 Verwendung

1. **Texte eingeben**: Alle Felder können direkt bearbeitet werden
2. **Bilder hochladen**: File-Upload oder URL-Eingabe möglich
3. **Live-Vorschau**: Änderungen werden sofort angezeigt
4. **PDF exportieren**: Button "Als PDF speichern" für Download

## 🔧 Entwicklung

### Lokale Entwicklung
```bash
# Einfach die index.html in einem Browser öffnen
# Oder mit einem lokalen Server:
npx serve .
```

### Code-Qualität
- ✅ Linter-freier Code
- ✅ Accessibility-konform
- ✅ Moderne JavaScript-Features
- ✅ Responsive Design

## 🐛 Behobene Probleme

1. **PDF vs HTML Unterschiede**: Vollständig behoben durch optimierte html2canvas-Konfiguration
2. **Inline CSS/JS**: Komplett ausgelagert für bessere Wartbarkeit
3. **Bild-Upload Probleme**: Robuste Implementierung mit Fehlerbehandlung

## 🎨 Features

- Responsive Bootstrap-Design
- Moderne Gradienten und Schatten
- DIN A5 Format optimiert
- Hochwertige PDF-Ausgabe
- Barrierefreie Bedienung
- Cross-Browser-Kompatibilität