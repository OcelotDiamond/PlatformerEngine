window.onerror = (error:string) => {
    document.body.innerHTML = 'Game crashed! Error: ' + error;
}

const canvas = document.querySelector('canvas');
if (!canvas) {
    throw new Error('No canvas found');
}

const game = new Game(canvas);

game.init();