var random = require('randomstring')

var _state = {
    map: new Map()
}

class Events {

    static _id() {
        return random
            .generate(64)
    }

    static get _map() {
        return _state.map
    }

    static $emit(event, data) {
        var map = Events._map
        for (var [id, item] of map) {
            if (item.event != event)
                continue
            item.handler(data)
            if (item.once)
                map.delete(id)
        }
    }

    static $off(id) {
        var { handler } = Events._map.get(id) || {}
        if (typeof handler != 'function')
            throw new Error(`Invalid event watcher id, ${id}!`)
    }

    static $on(event, handler, once = false) {
        if (typeof event != 'string')
            throw new Error(`Expected a string for event name!`)
        if (typeof handler != 'function')
            throw new Error(`Expected a function for event handler!`)
        var id = Events._id()
        Events._map.set(id, { event, handler, once })
        return id
    }

    static $once(event, handler) {
        return Events.$on(event, handler, true)
    }

    static $watch(watch) {
        return Object.keys(watch)
            .map((event) => {
                var handler = watch[event]
                return Events.$on(event, handler)
            })
    }

    static $unwatch(...ids) {
        for (var id of ids) {
            Events.$off(id)
        }
    }

}

module.exports = Events