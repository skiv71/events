//@ts-check

var random = require('randomstring')

var _state = {
    map: new Map()
}

class Events {

    static _uid() {
        return random
            .generate(128)
    }

    static get list() {
        return _state.map
    }

    static $emit(event, data) {
        for (var [uid, e] of Events.list) {
            if (e.name != event)
                continue
            e.handler({ name: e.name, data })
            if (e.once)
                Events.$off(uid)
        }
    }

    static $off(uid) {
        if (typeof uid != `string` || uid.length != Events._uid().length)
            throw new Error(`Invalid arguments, invalid uid, ${uid}!`)
        if (!Events.list.has(uid))
            throw new Error(`Invalid arguments, uid ${uid} is not found!`)
        Events.list.delete(uid)
    }

    static $on(event, handler, once = false) {
        if (typeof event != 'string')
            throw new Error(`Invalid arguments, event should be a string!`)
        if (typeof handler != 'function')
            throw new Error(`Invalid arguments, event handler requires a function!`)
        var uid = Events._uid()
        Events.list.set(uid, { name: event, handler, once })
        return uid
    }

    static $once(event, handler) {
        return Events.$on(event, handler, true)
    }

    static $watch(events) {
        if (typeof events != `object` || !Object.keys(events).length)
            throw new Error(`Invalid arguments, requires an object with at least one event!`)
        return Object.keys(events)
            .map(e => Events.$on(e, events[e]))
    }

    static $unwatch(uids) {
        if (!Array.isArray(uids))
            throw new Error(`Invalid arguments, list of UID's expected!`)
        for (var uid of uids) {
            Events.$off(uid)
        }
    }

}

module.exports = Events