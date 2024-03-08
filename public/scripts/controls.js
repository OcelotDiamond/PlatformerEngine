class Controls {
    static keys = {};
    static mouseX = 0;
    static mouseY = 0;
    static leftMouse = false;
    static middleMouse = false;
    static rightMouse = false;
    static init() {
        window.addEventListener('keydown', Controls.keyDown);
        window.addEventListener('keyup', Controls.keyUp);
        window.addEventListener('mousemove', Controls.mouseMove);
        window.addEventListener('mousedown', Controls.mouseClick);
        window.addEventListener('mouseup', Controls.mouseClick);
    }
    static keyDown(event) {
        Controls.keys[event.key.toLowerCase()] = true;
    }
    static keyUp(event) {
        Controls.keys[event.key.toLowerCase()] = undefined;
    }
    static mouseMove(event) {
        Controls.mouseX = event.clientX;
        Controls.mouseY = event.clientY;
    }
    static mouseClick(event) {
        let n = event.buttons;
        if (n >= 16) {
            n -= 16;
        }
        if (n >= 8) {
            n -= 8;
        }
        Controls.middleMouse = n >= 4;
        if (n >= 4) {
            n -= 4;
        }
        Controls.rightMouse = n >= 2;
        if (n >= 2) {
            n -= 2;
        }
        Controls.leftMouse = n >= 1;
    }
    static isKeyDown(key) {
        return typeof (Controls.keys[key]) === 'boolean';
    }
}
