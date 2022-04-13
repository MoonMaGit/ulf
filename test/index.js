function logCor(msg){
    console.log(`%c${msg}`, 'color: green')
}
function logErr(msg){
    console.log(`%c${msg}`, 'color: red')
}

class Test{
    constructor(des){
        this.des = des
        this.index = 0
        this.list = []
        this.isRun = false
        this.first = ()=>{}
        this.final = ()=>{}

        this.sum = 0
        this.errorSum = 0
    }

    run(){
        if(this.index === 0){
            console.log(': '+this.des)
            console.time(this.des)
            this.isRun = true
        }else if(this.index === this.list.length){
            console.timeEnd(this.des)
            this.isRun = false
            console.log('sum: ' + this.sum)
            const msg = `error: ${this.errorSum} (${(this.errorSum/this.sum*100).toFixed(3)}%)`
            if(this.errorSum){
                logErr(msg)
            }else{
                logCor(msg)
            }
            console.log('')
            this.final()
            return
        }
        window.setTimeout(()=>{
            const [title, todo] = this.list[this.index],
                flag = this.des+'.'+title
            console.log('---> '+flag)
            console.time(flag)

            this.sum ++

            let done = false
            const next = (errorMsg, trace)=>{
                if(done) return
                
                done = true
                if(errorMsg){
                    this.errorSum ++
                    logErr(errorMsg)
                    if(trace){
                        console.trace(errorMsg)
                    }
                }
                console.timeEnd(flag)
                this.index ++
                this.run()
            }

            try{
                if(todo){
                    todo(()=>next(), (msg='UNKNOWN')=>next(msg))
                }else{
                    console.warn('no test body: ', title)
                    next()
                }
            }catch(e){
                next(e, true)
            }
        }, 0)
    }

    once(test){
        this.list.push(test)
        if(this.list.length === 1){
            this.first()
        }
        return this
    }
}

const testList = []
export const getTest = function(des){
    const test = new Test(des)
    test.first = ()=>{
        if(testList.length === 0){
            test.run()
        }
        testList.unshift(test)
    }
    test.final = ()=>{
        testList.length --
        const next = testList[testList.length-1]
        next && next.run()
    }
    return test
}