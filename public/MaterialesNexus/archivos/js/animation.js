window.addEventListener('load', () => {
    let title = document.querySelector('.main__title');
    if (!title) {
        return;
    }
    let text = '¡Conoce nuestra ruta de Aprendizaje!';
    let letterStart = 0;
    let letterEnd = 1;

    let write = () => {
        let interval = setInterval(() => {
            console.log('Animación en curso'); 
            title.innerText = text.slice(letterStart, letterEnd);
            letterEnd++;
            if (letterEnd > text.length) {
               letterEnd=1
               
            }
        }, 100);
    };

    write();
});

