/** @private */
export const generateRandomId = (prefix) => {
    let counter = 0;
    return () => `${prefix}-${++counter}`;
};

/** @private */
export const isSelectedPredicate = i => i.getAttribute('aria-selected') === 'true';

/** @private */
export function eventuallySetAttribute(target, attribute, value) {
    if (!target.hasAttribute(attribute)) {
        target.setAttribute(attribute, value);
    }
}

/** @private */
export const mixin = (...mixins) => klass => {
    const proto = klass.prototype;
    for (const mix of mixins) {
        const keys = Object.keys(mix);
        for (const key of keys) {
            switch (key) {
                case 'connectedCallback': {
                    const original = proto.connectedCallback;
                    proto.connectedCallback = function () {
                        if (original) {
                            original.call(this);
                        }
                        mix.connectedCallback.call(this);
                    };
                    break;
                }
                case 'attributeChangedCallback': {
                    const original = proto.attributeChangedCallback;
                    proto.attributeChangedCallback = function (name, oldValue, newValue) {
                        if (original) {
                            original.call(this, name, oldValue, newValue);
                        }
                        mix.attributeChangedCallback.call(this, name, oldValue, newValue);
                    };
                    break;
                }
                case 'observedAttributes': {
                    const propList = (klass.observedAttributes || []).concat(mix.observedAttributes);
                    Object.defineProperty(klass, 'observedAttributes', {
                        configurable: true,
                        get() {
                            return propList;
                        }
                    });
                    break;
                }
                default:
                    Object.defineProperty(proto, key, Object.assign({
                        enumerable: true
                    }, mix[key]));
            }
        }
    }
    return klass;
};

