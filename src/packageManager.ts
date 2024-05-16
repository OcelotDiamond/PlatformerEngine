// Version 2
// Written by Ocelotdiamond

class PackageManager {
    static #syncLoadLogic<T extends Loadable>(generator:() => T, source:string, callback:(element:T) => void = null, augmenter:(element:T) => void = null):T {
        const element = generator();

        if (callback) {
            element.onload = () => {
                callback(element);
            }
        }

        element.src = source;

        if (augmenter) {
            augmenter(element);
        }

        return element;
    }

    static #syncMultiLoadLogic<T extends Loadable>(generator:() => T, sources:string[], callback:(element:T[]) => void = null, augmenter:(element:T) => void = null):T[] {
        let array:T[] = [];
        if (callback !== null) {
            let callsRemaining = sources.length;
            for (let i = 0; i < sources.length; i++) {
                array.push(this.#syncLoadLogic(generator, sources[i], () => {
                    callsRemaining--;
                    if (callsRemaining <= 0) {
                        callback(array);
                    }
                }, augmenter));
            }
        } else {
            for (let i = 0; i < sources.length; i++) {
                array.push(this.#syncLoadLogic(generator, sources[i], null, null));
            }
        }
        return array;
    }

    static async #asyncLoadLogic<T extends Loadable>(generator:() => T, source:string, augmenter:(element:T) => void = null):Promise<T> {
        const element = generator();

        const promise = new Promise(resolve => element.onload = resolve);

        element.src = source;

        if (augmenter) {
            augmenter(element);
        }

        await promise;

        return element;
    }

    static async #asyncMultiLoadLogic<T extends Loadable>(generator:() => T, sources:string[], augmenter:(element:T) => void = null):Promise<T[]> {
        let array:T[] = []

        for (let i = 0; i < sources.length; i++) {
            array.push(await this.#asyncLoadLogic(generator, sources[i], augmenter));
        }

        return array;
    }

    static syncLoadPackage(source:string, callback:() => void = null):HTMLScriptElement {
        return this.#syncLoadLogic<HTMLScriptElement>(() => document.createElement('script'), source, callback, document.head.appendChild);
    }

    static syncLoadPackages(sources:string[], callback:(element:HTMLScriptElement[]) => void = null) {
        return this.#syncMultiLoadLogic<HTMLScriptElement>(() => document.createElement('script'), sources, callback, document.head.appendChild);
    }

    static async asyncLoadPackage(source:string):Promise<HTMLScriptElement> {
        return await this.#asyncLoadLogic<HTMLScriptElement>(() => document.createElement('script'), source, document.head.appendChild);
    }

    static async asyncLoadPackages(sources:string[]):Promise<HTMLScriptElement[]> {
        return await this.#asyncMultiLoadLogic<HTMLScriptElement>(() => document.createElement('script'), sources, document.head.appendChild);
    }

    static syncLoadImage(source:string, callback:() => void = null) {
        return this.#syncLoadLogic<HTMLImageElement>(() => new Image(), source, callback);
    }

    static syncLoadImages(sources:string[], callback:(element:HTMLImageElement[]) => void = null) {
        return this.#syncMultiLoadLogic<HTMLImageElement>(() => new Image(), sources, callback);
    }

    static async asyncLoadImage(source:string):Promise<HTMLImageElement> {
        return await this.#asyncLoadLogic<HTMLImageElement>(() => new Image(), source);
    }

    static async asyncLoadImages(sources:string[]):Promise<HTMLImageElement[]> {
        return await this.#asyncMultiLoadLogic<HTMLImageElement>(() => new Image(), sources);
    }
}

interface Loadable {
    onload:(this:GlobalEventHandlers, ev:Event) => any,
    src:string
}