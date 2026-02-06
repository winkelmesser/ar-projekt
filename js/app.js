const clickables = document.querySelectorAll('.clickable');

clickables.forEach(entity => {
    entity.addEventListener('click', function() {
        // Zufällige Farbe generieren
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        
        // Farbe des Modells ändern
        const mesh = this.getObject3D('mesh');
        if (mesh) {
            mesh.traverse(node => {
                if (node.isMesh) node.material.color.set(randomColor);
            });
        }
        
        // Kleiner visueller Effekt: Hüpfen beim Klicken
        this.setAttribute('animation', {
            property: 'position',
            to: '0 0.8 0',
            dur: 200,
            dir: 'alternate',
            loop: 2
        });
    });
});

console.log("AR Galerie Modus aktiv: Alle Marker sind frei schaltbar.");