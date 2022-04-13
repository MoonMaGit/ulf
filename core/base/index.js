export const Chain = class {
    constructor() {
        this.root = null
        this.tail = null
    }
    push(data) {
        const node = Chain.getNode(data)
        node.container = this

        if (this.tail) {
            this.tail.next = node
            node.last = this.tail
        } else {
            this.root = node
        }

        this.tail = node

        return node
    }
    contain(data){
        let contained = false
        this.trave(
            (node)=>{
                if(node.data === data){
                    contained = node
                    return true
                }
            }
        )
        return contained
    }
    delete(data){
        this.remove(this.contain(data))
    }
    before(node, flag=this.root) {
        if (!Chain.isNode(node)) {
            return false
        }

        if(node.container){
            node.container.remove(node)
        }

        if(this.root === null){
            this.root = this.tail = node
            return true
        }


        const start = flag.last
        start && (start.next = node)
        node.last = start
        node.next = flag
        flag.last = node
        if (flag === this.root) {
            this.root = node
        }

        node.container = this

        return true
    }
    after(node, flag=this.tail) {
        if (!Chain.isNode(node)) {
            return false
        }

        if(node.container){
            node.container.remove(node)
        }

        if(this.root === null){
            this.root = this.tail = node
            return true
        }

        const end = flag.next
        flag.next = node
        node.last = flag
        node.next = end
        end&&(end.last = node)

        if(flag === this.tail){
            this.tail = node
        }

        node.container = this

        return true
    }
    remove(node) {
        if (!Chain.isNode(node)) {
            return null
        }
        if (!this.linked(node)) {
            console.warn('不包含: ', node)
            return null
        }

        const { last, next } = node


        if(this.root === node){
            this.root = next
        }else{
            last.next = next
        }

        if(this.tail === node){
            this.tail = last
        }else{
            next.last = last
        }

        node.container = null

        return node
    }
    linked(node) {
        let isLinked = false
        this.trave(
            (n) => {
                if (n === node) {
                    isLinked = true
                    return true
                }
            }
        )
        return isLinked
    }
    trave(fn, forData) {
        for (let node = this.root; node; node = node.next) {
            if(fn(forData ? node.data : node)){
                break
            }
        }
    }
}
class Node {
    constructor(data) {
        this.data = data
        this.last = null
        this.next = null
        this.container = null
    }
}
Chain.isNode = function (node) {
    return node instanceof Node
}
Chain.getNode = function (data) {
    return new Node(data)
}

export const getCounter = function (onload=()=>{}, name) {
    return {
        name,
        onload,
        onoverflow: ()=>{},
        sum: 0,
        count: 0,
        add: function (sum = 1) {
            this.sum += sum
        },
        pass: function (step = 1) {
            this.count += step
            if (this.count === this.sum) {
                this.onload({sum: this.sum, count: this.count})
            }else if(this.count > this.sum){
                this.onoverflow({sum: this.sum, count: this.count})
            }
        }
    }
}

export const getFinisher = function () {
    return {
        finished: false,
        listeners: [],
        add: function (lsn) {
            if (this.finished) {
                lsn()
            } else {
                this.listeners.push(lsn)
            }
        },
        remove: function(lsn){
            this.listeners = this.listeners.filter(listener => listener !== lsn)
        },
        finish: function (data) {
            this.listeners.forEach(lsn => lsn(data))
            this.finished = true
            this.listeners = []
        }
    }
}

export const getStepper = function (step=1, delay = null, timeout) {
    return {
        step,
        delay,
        timeout,
        running: false,
        list: [],
        index: 0,
        __running: false,
        start: function(){
            this.__running = true

            const run = (next)=>{
                if(this.index === this.list.length){
                    this.index = 0
                    this.list = []
                    return false
                }

                const one = this.list[this.index]
                this.index ++
                if(one){
                    const [todo, ontimeout] = Array.isArray(one)? one: [one, ()=>{}]

                    let done = false,
                        timeout = Number(this.timeout),
                        clear = timeout && window.setTimeout(
                            ()=>{
                                done=true
                                next()
                                ontimeout()
                            }, this.timeout
                        )

                    todo(
                        ()=>{
                            clear && window.clearTimeout(clear)
                            !done && next()
                        }
                    )
                }

                return true
            }

            const {step = 1} = this,
                nextStep = ()=>{
                    if(!this.__running) return

                    const todo = ()=>this.start()
                    this.delay? window.setTimeout(todo, this.delay): todo()
                },
                counter = getCounter(nextStep)

            counter.add()
            for(let i=0; i<step; i++){
                counter.add()
                this.__running && run(()=>counter.pass())
            }
            counter.pass()
        },
        stop: function(){
            this.__running = false
        },
        add: function(one){
            this.list.push(one)
            this.__running && this.start()
        },
        cutIn: function(list=[]){
            this.list = list.concat(this.list.slice(this.index))
            this.index = 0
        }
    }
}