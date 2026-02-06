const stations = [
    { 
        id: 'station1', 
        marker: 'marker1', 
        entity: 'objekt1', 
        hint: "Gefunden! Die Ente hat dir etwas verraten...", 
        searchHint: "Suche den ersten Hinweis (Barcode 5) in der Nähe des Wassers!" 
    },
    { 
        id: 'station2', 
        marker: 'marker2', 
        entity: 'objekt2', 
        hint: "Die Schatztruhe! Klicke sie an, um sie zu öffnen!", 
        searchHint: "Gute Arbeit. Gehe nun zur alten Truhe (Barcode 10) beim Marktplatz." 
    },
    { 
        id: 'station3', 
        marker: 'marker3', 
        entity: 'objekt3', 
        hint: "Das Ziel! Die goldene Ente!", 
        searchHint: "Fast geschafft! Suche das goldene Finale (Barcode 15)!" 
    }
];

let foundCounter = 0;

function init() {
    // Fortschritt beim Start berechnen
    foundCounter = 0;
    stations.forEach(s => {
        if(localStorage.getItem(s.id) === 'true') foundCounter++;
    });

    stations.forEach((s, index) => {
        const m = document.getElementById(s.marker);
        const e = document.getElementById(s.entity);

        // Wenn ein Marker GEFUNDEN wird
        m.addEventListener('markerFound', () => {
            if(localStorage.getItem(s.id) !== 'true') {
                // Nur den "Aktions-Hinweis" zeigen, wenn diese Station aktuell ist
                if(index === foundCounter) {
                    showHint(s.hint, true);
                }
            }
        });

        // Wenn ein Marker VERLOREN geht
        m.addEventListener('markerLost', () => {
            updateUI(); // Zurück zum Navigations-Hinweis
        });

        // Klick auf das 3D-Objekt
        e.addEventListener('click', () => {
            // Man kann nur die aktuelle Station aktivieren
            if(index === foundCounter && localStorage.getItem(s.id) !== 'true') {
                handleDiscovery(s.id, e, index);
            }
        });
    });

    updateUI();
}

function handleDiscovery(id, entity, index) {
    localStorage.setItem(id, 'true');
    foundCounter++;
    entity.emit('click-event'); 
    
    // Kleiner Sound oder Vibration wäre hier cool
    if (navigator.vibrate) navigator.vibrate(200);

    alert("Station " + (index + 1) + " erfolgreich gefunden!");
    updateUI();
}

function showHint(text, isAction = false) {
    const hb = document.getElementById('hint-box');
    hb.innerText = text;
    hb.style.display = 'block';
    // Falls es ein Aktions-Hinweis ist, machen wir ihn farbig
    hb.style.background = isAction ? "#ffeff2" : "white";
    hb.style.border = isAction ? "2px solid #ff004c" : "none";
}

function updateUI() {
    document.getElementById('found-count').innerText = foundCounter;
    const btn = document.getElementById('actionBtn');
    
    if(foundCounter >= stations.length) {
        btn.innerText = "Alle Schätze gefunden! 🎉";
        btn.style.background = "#4CAF50";
        showHint("Herzlichen Glückwunsch! Du hast die Schatzsuche in Lübeck beendet.");
    } else {
        const currentStation = stations[foundCounter];
        btn.innerText = "Suche Station " + (foundCounter + 1);
        // Zeige dauerhaft den Wegweiser zur nächsten Station
        showHint(currentStation.searchHint);
    }
}

window.onload = init;

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
}