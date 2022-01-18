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
            console[this.errorSum? 'error': 'log'](`error: ${this.errorSum} (${(this.errorSum/this.sum*100).toFixed(3)}%)`)
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

            const next = (errorMsg)=>{
                if(errorMsg){
                    this.errorSum ++
                    console.error(errorMsg)
                }
                console.timeEnd(flag)
                this.index ++
                this.run()
            }

            try{
                todo(()=>next(), (msg='UNKNOWN')=>next(msg))
            }catch(e){
                next(e)
            }
        }, 0)
    }

    once(test){
        this.list.push(test)
        if(!this.isRun){
            this.first()
        }
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