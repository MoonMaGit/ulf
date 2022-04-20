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
