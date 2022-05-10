import { Chain, getCounter, getFinisher, getStepper } from "./index.js"
import { getTest } from "../../test/index.js"

getTest('getCounter')
.once([
    'count',
    (correct, wrong)=>{
        const name = 'COUNT',
            count = getCounter(
            ({sum, count})=>{
                if(sum === 2 && count === 2){
                    correct()
                }
                wrong('计数错误')
            }, name
        )

        if(count.name !== name){
            wrong('名字错误')
        }

        count.add(2)
        window.setTimeout(()=>{
            count.pass(1)
        }, 200)
        window.setTimeout(()=>{
            count.pass(1)
        }, 300)

        window.setTimeout(()=>{
            wrong('没有结束')
        }, 300)
    }
])
.once([
    'onoverflow',
    (correct, wrong)=>{
        const counter = getCounter()

        counter.onoverflow = ()=>{
            correct()
        }
        counter.pass(1)

        wrong('没有溢出')
    }
])
.once([
    'add after pass',
    (correct, wrong)=>{
        const counter = getCounter(()=>correct())

        counter.add(1)
        counter.pass(1)
        counter.add(1)
        counter.pass(1)

        wrong()
    }
])
.once([
    'add in onload',
    (c, w)=>{
        const counter = getCounter(
            ({sum, count})=>{
                if(count === 1){
                    counter.add(1)
                    counter.pass(1)
                }else{
                    c()
                }
            }
        )

        counter.add(1)
        counter.pass(1)
        w('不能续杯')
    }
])

getTest('getFinisher')
.once([
    'onFinish',
    (c, w)=>{
        const finisher = getFinisher()

        let flag = ''
        finisher.add(()=>flag += 1)
        finisher.add(()=>flag += 2)
        finisher.finish()
        if(flag === '12'){
            c()
        }else if(flag.length < 2){
            w('回调缺失')
        }else{
            w('回调错误')
        }
    }
])
.once([
    'after finish',
    (c, w)=>{
        const finisher = getFinisher()

        finisher.add(()=>{})
        finisher.finish()
        finisher.add(()=>c())
        w()
    }
])
.once([
    'delete',
    (c, w)=>{
        const finisher = getFinisher()

        const lsn = ()=>w()
        finisher.add(lsn)
        finisher.add(()=>{})
        finisher.remove(lsn)
        finisher.finish()
        c()
    }
])

getTest('Chan')
.once([
    'trave linked before after remove',
    (c, w)=>{
        const n1 = Chain.getNode(1)
        const n2 = Chain.getNode(2)
        const n3 = Chain.getNode(3)
        const n4 = Chain.getNode(4)

        function strError(flag){
            let str = ''

            try{
                chan.trave(s=>{str+=s}, true)
            }catch(e){
                w('遍历报错')
            }

            if(str !== flag){
                w(`顺序错误: ${flag}->${str}`)
            }

            return str
        }

        function linkError(flag){
            for(let n = chan.root; n; n=n.next){
                if(n.next && n.next.last !== n){
                    w(`链接错误: ${n.data} @${flag}`)
                }
            }
        }

        let chan = new Chain()
        if(chan.linked(n1)){
            w('还没添加')
        }
        chan.after(n1)
        linkError(1)
        chan.after(n2)
        linkError(2)
        chan.after(n3, n1)
        linkError(3)
        chan.after(n4, n2)
        linkError(4)
        strError('1324')

        chan.before(n2, n1)
        linkError('b2')
        strError('2134')
        chan.before(n3, n1)
        linkError('b3')
        strError('2314')
        chan.before(n4, n1)
        linkError('b4')
        strError('2341')

        c()
    }
])
.once([
    'push trave contain delete isEmpty',
    (c, w)=>{
        const chan = new Chain()
        
        if(!chan.isEmpty()){
            w('应为空')
        }
        
        const n1 = chan.push(1)
        
        if(chan.isEmpty()){
            w('包含1')
        }
        
        const n2 = chan.push(2)
        const n3 = chan.push(3)
        
        if(chan.isEmpty()){
            w('不应为空')
        }

        function getStr(){
            let str = ''

            try{
                chan.trave(s=>{str+=s}, true)
            }catch(e){
                w('遍历报错')
            }

            return str
        }

        if(getStr() !== '123'){
            w('顺序错误')
        }
        if(!(chan.contain(1)&&chan.contain(2)&&chan.contain(3))){
            w('包含错误')
        }

        if(!chan.delete(2)){
            w('删除存在')
        }
        if(chan.delete(2)){
            w('删除已删除')
        }
        if(getStr() !== '13'){
            w('删除错误')
        }
        chan.delete(3)
        if(getStr() !== '1'){
            w('删除错误')
        }
        chan.delete(1)
        if(getStr() !== ''){
            w('删除错误')
        }
        if(chan.contain(1)||chan.contain(2)||chan.contain(3)){
            w('包含错误')
        }
        
        if(!chan.isEmpty()){
            w('已全部删除')
        }

        c()
    }
])

getTest('getStepper')
.once([
    'oneByOne',
    (c, w)=>{
        const stepper = getStepper()

        let i = 0
        stepper.add((done)=>{
            if(i === 0){
                i = 1
            }else{
                w(1)
            }
            done()
        })
        stepper.add((done)=>{
            if(i === 1){
                i = 2
            }else{
                w(2)
            }
            done()
        })
        stepper.add((done)=>{
            if(i === 2){
                c()
            }else{
                w(2)
            }
            done()
        })
        stepper.start()
    }
])
.once([
    'oneByOneAsync',
    (c, w)=>{
        const stepper = getStepper()

        let i = 0,
            next = (done)=>{
                window.setTimeout(done, 20)
            }
        stepper.add((done)=>{
            if(i === 0){
                i = 1
            }else{
                w(1)
            }
            next(done)
        })
        stepper.add((done)=>{
            if(i === 1){
                i = 2
            }else{
                w(2)
            }
            next(done)
        })
        stepper.add((done)=>{
            if(i === 2){
                c()
            }else{
                w(2)
            }
            next(done())
        })
        stepper.start()
    }
])
.once([
    'oneByOneStep',
    (c, w)=>{
        const stepper = getStepper(3, 10)

        let f = 0,
            next = (done)=>{
                window.setTimeout(()=>{
                    f = 0
                    done()
                }, 20)
            }

        for(let i=0; i<10; i++){
            stepper.add((done)=>{
                f++

                if(f > 3){
                    w('步进错误')
                }else if(i === 9){
                    c()
                }
                next(done)
            })
        }

        stepper.start()
    }
])
.once([
    'oneByOneTimeout',
    (c, w)=>{
        const stepper = getStepper(3, 10, 30)

        let next = (done, time)=>{
            window.setTimeout(()=>{
                done()
            }, time)
        }

        for(let i=0; i<10; i++){
            const t = i * 5
            let out = false
            stepper.add(
                [
                    (d)=>{
                        next(()=>{
                            d()
                            t >= 30 && !out && w('没有超时')
                        }, t)
                    },
                    ()=>{
                        t < 30 && w('不该超时')
                        out = true
                    }
                ]
            )
        }
        stepper.add((done)=>{                
            done(),
            c()
        })

        stepper.start()
    }
])
.once([
    'stopAdd',
    (c, w)=>{
        let stepper = getStepper()
        stepper.add((d)=>{
            stepper.stop()
            d()
        })
        stepper.add((d)=>{
            w('已停止')
            d()
        })
        stepper.start()

        stepper = getStepper(2)
        stepper.add((d)=>{
            stepper.stop()
            d()
        })
        stepper.add((d)=>{
            w('已停止2')
            d()
        })
        stepper.start()


        stepper = getStepper(2)
        stepper.add((d)=>{
            stepper.stop()
            d()
        })
        let i = 0
        stepper.add((d)=>{
            i ++
            d()
        })
        stepper.start()
        stepper.add((d)=>{
            if(i === 1){
                c()
            }else{
                w('暂停缺失')
            }
            d()
        })
        stepper.start()
    }
])
.once([
    'cutIn',
    (c, w)=>{
        const stepper = getStepper(),
            next = (done)=>{
                window.setTimeout(done, 0)
            }

        let i = 0

        stepper.add((d)=>{
            if(i !==0 ) w(0)
            i = 1
            
            stepper.cutIn([(d)=>{
                if(i !== 1) w(1)
                i = 2
                next(d)
            }])

            d()
        })
        stepper.add((d)=>{
            if(i !== 3) w(3)
            c()
            next(d)
        })
        stepper.start()
        stepper.cutIn([(d)=>{
            if(i !== 2) w(2)
            i = 3
            next(d)
        }])
    }
])