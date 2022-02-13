type Fn = (data: unknown) => void;
class EventHub {
    private cache: { [key: string]: { fn: Fn; thisObj: null }[] } = {};
    public dispatchEvent(eventName: string, data?: unknown) {
        if (!this.cache[eventName]) return;
        this.cache[eventName].forEach(({ fn, thisObj }) => fn.bind(thisObj, data));
    }
    public addEventListener(eventName: string, fn: Fn, thisObj = null) {
        this.cache[eventName] = this.cache[eventName] || [];
        this.cache[eventName].push({ fn, thisObj });
    }
    public removeEventListener(eventName: string, eventFn: Fn) {
        if (!this.cache[eventName]) return;
        let index = this.cache[eventName].findIndex(({ fn, thisObj }) => eventFn === fn);
        if (index === -1) return;
        this.cache[eventName].splice(index, 1);
    }
}

const EventBus = new EventHub();

export default EventBus;
