class Controls {
    static keys:Keys = {};

    static events:KeyEvent[] = [];

    static init() {
        window.addEventListener('keydown', Controls.keyDown);
        window.addEventListener('keyup', Controls.keyUp);
    }

    static keyDown(event:KeyboardEvent) {
        const key = event.key.toLowerCase();
        Controls.keys[key] = true;
        Controls.events.push(new KeyEvent(key, false));
    }

    static keyUp(event:KeyboardEvent) {
        Controls.keys[event.key.toLowerCase()] = undefined;
    }

    static getEvents() {
        const events = Controls.events;
        Controls.events = [];
        return events;
    }

    static isKeyDown(key:string) {
        return typeof(Controls.keys[key]) === 'boolean';
    }
}

class KeyEvent {
    key:string;
    isRelease:boolean;
    timeSinceFired:number = 0; // Will only work through the InputBuffer class

    constructor(key:string, isRelease:boolean) {
        this.key = key;
        this.isRelease = isRelease;
    }
}

class InputBuffer {
    static events:KeyEvent[] = [];
    static maxDelay:number = 1000; // Time in ms

    static update(deltaTime:number) {
        for (let i = 0; i < this.events.length; i++) {
            this.events[i].timeSinceFired += deltaTime;

            if (this.events[i].timeSinceFired > this.maxDelay) {
                this.events.splice(i,1);
                i--;
            }
        }

        const newEvents = Controls.getEvents();

        this.events.push(...newEvents);
    }
}

interface Keys {
    [key: string]: boolean;
}