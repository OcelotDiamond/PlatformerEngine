class PackageManager {
    static #syncLoadLogic(generator, source, callback = null, augmenter = null) {
        const element = generator();
        if (callback) {
            element.onload = () => {
                callback(element);
            };
        }
        element.src = source;
        if (augmenter) {
            augmenter(element);
        }
        return element;
    }
    static #syncMultiLoadLogic(generator, sources, callback = null, augmenter = null) {
        let array = [];
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
        }
        else {
            for (let i = 0; i < sources.length; i++) {
                array.push(this.#syncLoadLogic(generator, sources[i], null, null));
            }
        }
        return array;
    }
    static async #asyncLoadLogic(generator, source, augmenter = null) {
        const element = generator();
        const promise = new Promise(resolve => element.onload = resolve);
        element.src = source;
        if (augmenter) {
            augmenter(element);
        }
        await promise;
        return element;
    }
    static async #asyncMultiLoadLogic(generator, sources, augmenter = null) {
        let array = [];
        for (let i = 0; i < sources.length; i++) {
            array.push(await this.#asyncLoadLogic(generator, sources[i], augmenter));
        }
        return array;
    }
    static syncLoadPackage(source, callback = null) {
        return this.#syncLoadLogic(() => document.createElement('script'), source, callback, document.head.appendChild);
    }
    static syncLoadPackages(sources, callback = null) {
        return this.#syncMultiLoadLogic(() => document.createElement('script'), sources, callback, document.head.appendChild);
    }
    static async asyncLoadPackage(source) {
        return await this.#asyncLoadLogic(() => document.createElement('script'), source, document.head.appendChild);
    }
    static async asyncLoadPackages(sources) {
        return await this.#asyncMultiLoadLogic(() => document.createElement('script'), sources, document.head.appendChild);
    }
    static syncLoadImage(source, callback = null) {
        return this.#syncLoadLogic(() => new Image(), source, callback);
    }
    static syncLoadImages(sources, callback = null) {
        return this.#syncMultiLoadLogic(() => new Image(), sources, callback);
    }
    static async asyncLoadImage(source) {
        return await this.#asyncLoadLogic(() => new Image(), source);
    }
    static async asyncLoadImages(sources) {
        return await this.#asyncMultiLoadLogic(() => new Image(), sources);
    }
}
