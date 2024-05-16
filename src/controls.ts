class Controls {
    static keys:Keys = {};

    static mouseX:number = 0;
    static mouseY:number = 0;

    static leftMouse:boolean = false;
    static middleMouse:boolean = false;
    static rightMouse:boolean = false;

    static init() {
        window.addEventListener('keydown', Controls.keyDown);
        window.addEventListener('keyup', Controls.keyUp);

        window.addEventListener('mousemove', Controls.mouseMove);

        window.addEventListener('mousedown', Controls.mouseClick);
        window.addEventListener('mouseup', Controls.mouseClick);
    }

    static keyDown(event:KeyboardEvent) {
        Controls.keys[event.key.toLowerCase()] = true;
    }

    static keyUp(event:KeyboardEvent) {
        Controls.keys[event.key.toLowerCase()] = undefined;
    }

    static mouseMove(event:MouseEvent) {
        Controls.mouseX = event.clientX;
        Controls.mouseY = event.clientY;
    }

    static mouseClick(event:MouseEvent) {
        let n:number = event.buttons;
        if (n >= 16) {
            n -= 16
        }
        if (n >= 8) {
            n -= 8 
        }
        Controls.middleMouse = n >= 4;
        if (n >= 4) {
            n -= 4
        }
        Controls.rightMouse = n >= 2;
        if (n >= 2) {
            n -= 2
        }
        Controls.leftMouse = n >= 1;
    }

    static isKeyDown(key:string) {
        return typeof(Controls.keys[key]) === 'boolean';
    }
}

interface Keys {
    [key: string]: boolean;
}