const stations = [
    { 
        id: 'station1', 
        marker: 'marker1', 
        entity: 'objekt1', 
        hint: "Gefunden! Die Ente hat dir etwas verraten...", 
        searchHint: "Gehe zum Wasser und suche den ersten Hinweis (Barcode 5)." 
    },
    { 
        id: 'station2', 
        marker: 'marker2', 
        entity: 'objekt2', 
        hint: "Die Schatztruhe! Klick sie an!", 
        searchHint: "Super! Gehe nun zum Marktplatz und suche die alte Truhe (Barcode 10)." 
    },
    { 
        id: 'station3', 
        marker: 'marker3', 
        entity: 'objekt3', 
        hint: "Das Ziel! Die goldene Ente!", 
        searchHint: "Fast geschafft! Das Finale (Barcode 15) ist ganz nah." 
    }
];

let foundCounter = 0;

function init() {
    // Fortschritt aus Speicher laden
    foundCounter = 0;
    stations.forEach(s => {
        if(localStorage.getItem(s.id) === 'true') foundCounter++;
    });

    stations.forEach((s, index) => {
        const m = document.getElementById(s.marker);
        const e = document.getElementById(s.entity);

        if (!m || !e) return;

        // Marker erkannt
        m.addEventListener('markerFound', () => {
            if(index === foundCounter) {
                showHint(s.hint, true);
            }
        });

        // Marker verloren
        m.addEventListener('markerLost', () => {
            updateUI(); 
        });

        // Klick auf das 3D-Modell
        e.addEventListener('click', () => {
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
    
    // Animation auslösen
    entity.emit('click-event'); 
    
    // Kleiner Trick: Wir ändern die Farbe bei Station 3 (Gold)
    if(id === 'station3') {
        entity.setAttribute('material', 'color', 'gold');
    }

    alert("Station " + (index + 1) + " gefunden!");
    updateUI();
}

function showHint(text, isAction = false) {
    const hb = document.getElementById('hint-box');
    hb.innerText = text;
    hb.style.display = 'block';
    hb.className = isAction ? 'action-hint' : '';
}

function updateUI() {
    document.getElementById('found-count').innerText = foundCounter;
    const btn = document.getElementById('actionBtn');
    
    if(foundCounter >= stations.length) {
        btn.innerText = "Schatz gefunden! 🎉";
        btn.style.background = "#4CAF50";
        showHint("Du hast es geschafft! Lübeck ist stolz auf dich.");
    } else {
        const current = stations[foundCounter];
        btn.innerText = "Suche Station " + (foundCounter + 1);
        showHint(current.searchHint);
    }
}

window.onload = init;