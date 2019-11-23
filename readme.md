Simple Events bus
=================

A lightweight events bus, for use in all JavaScript environments


Usage
-----

```JavaScript
var Events = require('@skivy71/events')

var uid = Events.$on('someEvent', (data) => {  // returns a uid, which can be used later, to remove the watcher
    console.log('someEvent', data)
})

Events.$off(uid) // remove the above watcher

Events.$once('someOtherEvent', (data) => { // automatically removed after the event handler is called
    console.log('someOtherEvent', data)
})

Events.$emit('someSillyEvent', 'someSillyData') // broadcast an event with data...

var events = { // this events object (and the Events.$watch method) derives the event name(s) from Object.keys(events)
    eventA(data) { // and the event handler from events[event]
        console.log('eventA', data)
    },
    eventB(data) {
        console.log('eventB', data)
    }
}

var uids = Events.$watch(events) // returns a list of uids, which can be used to remove later (as above)

Events.$unwatch(uids)
```