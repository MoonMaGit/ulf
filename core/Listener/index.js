import {Chain} from '../base/index.js'

export const Listener = class{
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

        return [this.root, events, list]
    }

    add(event, handle, listener){
        this.__getList(event, handle)[2].push(listener)
    }

    remove(event, handle, listener){
        const [handles, events, list] = this.__getList(event, handle),
            rtn = !!list.delete(listener)
        
        return rtn
    }

    dispatch(event, handle, data, contex){
        const list = this.__getList(event, handle)[2],
            callbacks = []
        list.trave((fn)=>{
            callbacks.unshift(fn(data, contex))
        }, true)
        callbacks.forEach((fn)=>{
            fn && fn(data, contex)
        })
    }

    __forMap(map, todo){
        function keyTodo(keyMap, fn){
            if(keyMap instanceof Map){
                for(let [key, value] of keyMap.entries()){
                    fn(key, value)
                }
            }else if(keyMap instanceof Object){
                for(let key in keyMap){
                    fn(key, keyMap[key])
                }
            }
        }
        
        keyTodo(map, (k0, v0)=>{
            keyTodo(v0, (k1, v1)=>{
                todo(k0, v0, k1, v1)
            })
        })
    }
    addWithMap(map){
        this.__forMap(map, (handle, em, event, listener)=>{
            this.add(event, handle, listener)
        })
    }
    removeWithMap(map){
        this.__forMap(map, (handle, em, event, listener)=>{
            this.remove(event, handle, listener)
        })
    }
    prune(){
        const cut = (hm, h, em, e, l)=>{
            if(l.isEmpty()){
                em.delete(e)
            }
            if(em.size === 0){
                hm.delete(h)
            }
        }
        
        this.__forMap(this.root, (handle, eventMap, event, list)=>{
            cut(this.root, handle, eventMap, event, list)
        })
    }
}