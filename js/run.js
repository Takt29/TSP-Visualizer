import dfs from './dfs.js'
import { getDistance, sleep } from './tools.js'
import { initCanvas, drawGraph } from './canvas.js'

let iterator = null
let isStopped = false
let config = null

function init() {
  initCanvas()
  config = getConfig()
  change()
}

function change() {
  if (!config) config = getConfig()

  const type = $('#type').val()

  switch(type) {
  case 'dfs':
    iterator = dfs(config)
    break;
  default:
    iterator = null
    break;
  }

  console.log(config, type)
}

function getConfig() {
  const num = $('#numOfNodes').val()
  const start = 0
  const pos = new Array(num)
  const nodeSize = 30 //直径

  const height = $('#canvas').parent().height()
  const width = $('#canvas').parent().width()

  // generate Pos
  for (let i = 0; i < num; i++) {

    let isOK = false

    for (let k = 0; k < 100 && !isOK; k++) {
      isOK = true

      const x = Math.floor( Math.random() * width ) // 0 - height-1
      const y = Math.floor( Math.random() * height ) // 0 - width-1
      pos[i] = {x, y}

      if (pos[i].x < nodeSize || width - pos[i].x < nodeSize ||
          pos[i].y < nodeSize || height - pos[i].y < nodeSize)
        isOK = false

      for (let j = 0; j < i && isOK; j++) {
        if (getDistance(pos[j], pos[i]) < nodeSize * 2) {
          isOK = false
        }
      }
    }
  }

  return { num, start, pos, nodeSize }
}

async function run() {
  if(!config || !iterator) return

  isStopped = false
  if (!config) config = getConfig()
  change()

  while (iterator && !isStopped) {
    const nextState = iterator.next()
    if (nextState.done) break
    drawGraph(config, nextState.value)
    await sleep(30)
  }
}

function step() {
  if (!iterator) return

  const nextState = iterator.next()

  if (!nextState.done) {
    drawGraph(config, nextState.value)
  }
}

function stop() {
  isStopped = true
}

function toBegin() {
  if (!iterator) return
  stop()
  change()

  const nextState = iterator.next()

  drawGraph(config, nextState.value)
}

function toEnd() {
  if (!iterator) return
  stop()

  let lastState = null

  while (1) {
    const nextState = iterator.next()
    if (nextState.done) break
    lastState = nextState.value
  }

  drawGraph(config, lastState)
}

/* export */

window.init = init
window.change = change
window.run = run
window.step = step
window.stop = stop
window.toBegin = toBegin
window.toEnd = toEnd
