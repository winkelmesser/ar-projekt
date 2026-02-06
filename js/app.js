const stations = [
    { id: 'station1', marker: 'marker1', entity: 'objekt1', hint: "Such nach der ersten Ente!" },
    { id: 'station2', marker: 'marker2', entity: 'objekt2', hint: "Station 2: Die Schatztruhe wartet." },
    { id: 'station3', marker: 'marker3', entity: 'objekt3', hint: "Das Finale: Die goldene Ente!" }
];

let foundCounter = 0;

function init() {
    stations.forEach((s, index) => {
        // Fortschritt aus LocalStorage laden
        if(localStorage.getItem(s.id) === 'true') {
            foundCounter++;
        }
        
        const m = document.getElementById(s.marker);
        const e = document.getElementById(s.entity);

        // Marker Erkennung
        m.addEventListener('markerFound', () => {
            if(localStorage.getItem(s.id) !== 'true') {
                showHint(s.hint);
            }
        });

        m.addEventListener('markerLost', () => {
            hideHint();
        });

        // Klick auf 3D Objekt
        e.addEventListener('click', () => {
            if(localStorage.getItem(s.id) !== 'true') {
                handleDiscovery(s.id, e, index);
            }
        });
    });
    updateUI();
}

function handleDiscovery(id, entity, index) {
    localStorage.setItem(id, 'true');
    foundCounter++;
    entity.emit('click-event'); // Animation starten
    alert("Station " + (index + 1) + " gefunden!");
    updateUI();
}

function showHint(text) {
    const hb = document.getElementById('hint-box');
    hb.innerText = text;
    hb.style.display = 'block';
}

function hideHint() {
    document.getElementById('hint-box').style.display = 'none';
}

function updateUI() {
    document.getElementById('found-count').innerText = foundCounter;
    const btn = document.getElementById('actionBtn');
    if(foundCounter === 3) {
        btn.innerText = "Alle Schätze gefunden! 🎉";
        btn.style.background = "#4CAF50";
    } else {
        btn.innerText = "Station " + (foundCounter + 1) + " suchen";
    }
}

// Start der App
window.onload = init;

// PWA Service Worker Registrierung
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
}