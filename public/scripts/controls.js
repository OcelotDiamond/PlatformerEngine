class Controls {
    static keys = {};
    static events = [];
    static init() {
        window.addEventListener('keydown', Controls.keyDown);
        window.addEventListener('keyup', Controls.keyUp);
    }
    static keyDown(event) {
        const key = event.key.toLowerCase();
        Controls.keys[key] = true;
        Controls.events.push(new KeyEvent(key, false));
    }
    static keyUp(event) {
        Controls.keys[event.key.toLowerCase()] = undefined;
    }
    static getEvents() {
        const events = Controls.events;
        Controls.events = [];
        return events;
    }
    static isKeyDown(key) {
        return typeof (Controls.keys[key]) === 'boolean';
    }
}
class KeyEvent {
    key;
    isRelease;
    timeSinceFired = 0;
    constructor(key, isRelease) {
        this.key = key;
        this.isRelease = isRelease;
    }
}
class InputBuffer {
    static events = [];
    static maxDelay = 1000;
    static update(deltaTime) {
        for (let i = 0; i < this.events.length; i++) {
            this.events[i].timeSinceFired += deltaTime;
            if (this.events[i].timeSinceFired > this.maxDelay) {
                this.events.splice(i, 1);
                i--;
            }
        }
        const newEvents = Controls.getEvents();
        this.events.push(...newEvents);
    }
}
