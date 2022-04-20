import {Chain} from '../base/index.js'

class Listener{
    constructor(){
        this.root = new Map()
    }

    __getList(event, handle){
        let events = this.root.get(handle)
        if(!events){
            events = new Map()
            this.root.set(handle, events)
        }

        let list = events.get(event)
        if(!list){
            list = new Chain()
            events.set(event, list)
        }

        return list
    }

    add(event, handle, listener){
        this.__getList(event, handle).push(listener)
    }

    remove(event, handle, listener){
        return !!this.__getList(event, handle).delete(listener)
    }

    dispatch(event, handle, data, contex){
        const list = this.__getList(event, handle),
            callbacks = []
        list.trave((fn)=>{
            callbacks.unshift(fn(data, contex))
        }, true)
        callbacks.forEach((fn)=>{
            fn && fn(data, contex)
        })
    }
}

export default Listener