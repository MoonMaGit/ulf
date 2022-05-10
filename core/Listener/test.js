import { getTest } from "../../test/index.js"
import { Listener } from "./index.js"

getTest('Listener')
.once([
    'add remove',
    (r, w)=>{
        const lsn = new Listener(),
            fn = ()=>{}

        if(lsn.remove(1, 'test', fn)){
            w('remove未存在')
        }
        lsn.add(1, 'test', fn)
        if(!lsn.remove(1, 'test', fn)){
            w('remove已存在')
        }
        if(lsn.remove(1, 'test', fn)){
            w('remove已删除')
        }

        const event = {},
            handle = {}
        lsn.add(event, handle, fn)
        if(!lsn.remove(event, handle, fn)){
            w('remove对象句柄')
        }

        r()
    }
])
.once([
    'dispatch',
    (r, w)=>{
        const lsn = new Listener()

        const event = {},
            handle = {},
            DATA = 0,
            CONTEX = {flag: ''},
            dataWrong = (data)=>{
                if(data !== DATA){
                    w('data')
                }
            },
            fn1 = (data, contex)=>{
                dataWrong(data)
                contex.flag += '1'
            },
            fn2 = (data, contex)=>{
                dataWrong(data)
            },
            fn3 = (data, contex)=>{
                dataWrong(data)
                contex.flag += '3'
            },
            fn4 = (data, contex)=>{
                dataWrong(data)
                contex.flag += '4'
            },
            fn5 = (data, contex)=>{
                dataWrong(data)
                contex.flag += '5'
            }
        lsn.add(event, handle, fn1)
        lsn.add(event, handle, fn2)
        lsn.add(event, handle, fn3)
        lsn.add(event, handle, fn4)
        lsn.add(event, handle, fn5)
        lsn.dispatch(event, handle, DATA, CONTEX)

        if(CONTEX.flag !== '1345'){
            w('dispatch执行错误')
        }
        
        
        lsn.remove(event, handle, fn4)
        
        CONTEX.flag = ''
        lsn.dispatch(event, handle, DATA, CONTEX)
        if(CONTEX.flag !== '135'){
            w('删除后 dispatch执行错误')
        }
        
        r()
    }
])
.once([
    'callback',
    (r, w)=>{
        const lsn = new Listener()

        const event = {},
            handle = {},
            DATA = 0,
            CONTEX = {flag: ''},
            dataWrong = (data)=>{
                if(data !== DATA){
                    w('data')
                }
            },
            fn1 = ()=>(data, contex)=>{
                dataWrong(data)
                contex.flag += '1'
            },
            fn2 = ()=>(data, contex)=>{
                dataWrong(data)
            },
            fn3 = ()=>(data, contex)=>{
                dataWrong(data)
                contex.flag += '3'
            },
            fn4 = ()=>(data, contex)=>{
                dataWrong(data)
                contex.flag += '4'
            },
            fn5 = ()=>(data, contex)=>{
                dataWrong(data)
                contex.flag += '5'
            }
        lsn.add(event, handle, fn1)
        lsn.add(event, handle, fn2)
        lsn.add(event, handle, fn3)
        lsn.add(event, handle, fn4)
        lsn.add(event, handle, fn5)
        lsn.dispatch(event, handle, DATA, CONTEX)

        if(CONTEX.flag !== '5431'){
            w('dispatch执行错误')
        }
        r()
    }
])
.once([
    'withMap({})',
    (r, w)=>{
        const lsn = new Listener()
        
        const map = {
            a: {
                1: (data, contex)=>{
                    if(data){
                       ( ++ contex.n !== 1) && w('&a-1')
                    }else{
                       w('xa-1')
                    }
                },
                2: (data, contex)=>{
                    if(data){
                       ( ++ contex.n !== 2) && w('&a-2')
                    }else{
                       w('xa-2')
                    }
                },
                3: (data, contex)=>{
                    if(data){
                       ( ++ contex.n !== 3) && w('&a-3')
                    }else{
                       w('xa-3')
                    }
                }
            },
            b: {
                1: (data, contex)=>{
                    if(!data){
                       w('xb-1')
                    }
                }
            }
        }
        
        const temp = {n: 0}
        
        lsn.addWithMap(map)
        lsn.dispatch('1', 'a', true, temp)
        lsn.dispatch('2', 'a', true, temp)
        lsn.dispatch('3', 'a', true, temp)
        lsn.dispatch('1', 'b', true, temp)
        
        if(temp.n === 0){
            w('listener未添加')
        }
        
        lsn.removeWithMap(map)
        lsn.dispatch('1', 'a', false, temp)
        lsn.dispatch('2', 'a', false, temp)
        lsn.dispatch('3', 'a', false, temp)
        lsn.dispatch('1', 'b', false, temp)
        
        r()
    }
])
.once([
    'withMap(Map)&&prune',
    (r, w)=>{
        const lsn = new Listener()
        
        const ha = {name: 'a'},
            hb = {name: 'b'},
            e1 = {name: 1},
            e2 = {name: 2},
            e3 = {name: 3},
            ma = new Map(),
            mb = new Map(),
            map = new Map()
            
        const a1 = (data, contex)=>{
                if(data){
                   ( ++ contex.n !== 1) && w('&a-1')
                }else{
                   w('xa-1')
                }
            },
            a2 = (data, contex)=>{
                if(data){
                   ( ++ contex.n !== 2) && w('&a-2')
                }else{
                   w('xa-2')
                }
            },
            a3 = (data, contex)=>{
                if(data){
                   ( ++ contex.n !== 3) && w('&a-3')
                }else{
                   w('xa-3')
                }
            },
            b1 = (data, contex)=>{
                if(!data){
                   w('xb-1')
                }
            }
            
        ma.set(e1, a1)
        ma.set(e2, a2)
        ma.set(e3, a3)
        map.set(ha, ma)
        
        mb.set(e1, b1)
        map.set(hb, mb)
        
        const temp = {n: 0}
        
        lsn.addWithMap(map)
        lsn.dispatch(e1, ha, true, temp)
        lsn.dispatch(e2, ha, true, temp)
        lsn.dispatch(e3, ha, true, temp)
        lsn.dispatch(e1, hb, true, temp)
        
        if(temp.n === 0){
            w('listener未添加')
        }
        
        lsn.removeWithMap(map)
        lsn.dispatch(e1, ha, false, temp)
        lsn.dispatch(e2, ha, false, temp)
        lsn.dispatch(e3, ha, false, temp)
        lsn.dispatch(e1, hb, false, temp)
        
        lsn.addWithMap(map)
        
        const mapStr = ()=>{
            let str = ''    
            lsn.__forMap(lsn.root, (h, em, e, l)=>{
                str += h.name + '->' + e.name + ';'
            })
            return str
        }
        
        lsn.prune()
        if(mapStr() !== 'a->1;a->2;a->3;b->1;'){
            w('prune all')
        }
        
        lsn.remove(e1, ha, a1)
        lsn.prune()
        if(mapStr() !== 'a->2;a->3;b->1;'){
            w('X a1')
        }
        
        lsn.remove(e3, ha, a3)
        lsn.prune()
        if(mapStr() !== 'a->2;b->1;'){
            w('X a3')
        }
        
        lsn.remove(e3, ha, a3)
        lsn.prune()
        if(mapStr() !== 'a->2;b->1;'){
            w('X a3 II')
        }
        
        lsn.remove(e2, ha, a2)
        lsn.prune()
        if(mapStr() !== 'b->1;'){
            w('X a2')
        }
        
        lsn.remove(e1, hb, b1)
        lsn.prune()
        if(mapStr() !== ''){
            w('X b1')
        }
        
        r()
    }
])
