import { Chain, getCounter, getFinisher, getStepper } from "./index.js"
import { getTest } from "../../test/index.js"

const test = getTest('core')

test.once([
    'getCounter',
    (correct, wrong)=>{
        getCounter()
        window.setTimeout(wrong, 1000)
        // done()
    }
])

test.once([
    'getFinisher',
    (done)=>{
        getFinisher()
        done()
    }
])

const test1 = getTest('test1')
test1.once([
    'test1',
    (done)=>{
        console.log('test1.............')
        done()
    }
])