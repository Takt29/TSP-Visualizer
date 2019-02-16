import { getDistance, sleep } from './tools.js'
import { initCanvas, drawGraph } from './canvas.js'
import { initDisplay, updateWithStep } from './display.js'
import dfs from './dfs.js'
import bfs from './bfs.js'
import astar from './astar.js'
import hc from './hc.js'
import sa from './sa.js'

let iterator = null
let isStopped = false
let config = null

function init() {
  isStopped = true
  initCanvas()
  config = getConfig()
  change(true)
}

function change(replace = false) {
  isStopped = true
  if (!config) config = getConfig()

  const type = $('#type').val()

  switch(type) {
  case 'dfs':
    iterator = dfs(config)
    break;
  case 'bfs':
    iterator = bfs(config)
    break;
  case 'astar1':
    iterator = astar(config, 1)
    break;
  case 'astar2':
    iterator = astar(config, 2)
    break;
  case 'hc':
    iterator = hc(config)
    break;
  case 'sa':
    iterator = sa(config)
    break;
  default:
    iterator = null
    break;
  }

  const state = step()
  initDisplay(state.value, replace)
}

function getConfig() {
  const num = parseInt($('#numOfNodes').val(), 10)
  const start = 0
  const pos = new Array(num)
  const nodeSize = 30 //直径

  const height = $('#canvas').attr('height')
  const width = $('#canvas').attr('width')

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

  while (iterator && !isStopped) {
    const nextState = iterator.next()
    if (nextState.done) break
    drawGraph(config, nextState.value)
    updateWithStep(nextState.value)
    if(nextState.value) await sleep(30)
  }
}

function step() {
  if (!iterator) return

  let nextState = iterator.next()

  while(!nextState.done && !nextState.value) {
    nextState = iterator.next()
    updateWithStep(nextState.value)
  }

  if (!nextState.done) {
    drawGraph(config, nextState.value)
    updateWithStep(nextState.value)
  }

  return nextState
}

function stop() {
  isStopped = true
}

function toBegin() {
  if (!iterator) return
  stop()
  change()
}

function toEnd() {
  if (!iterator) return
  stop()

  let lastState = null

  while (1) {
    const nextState = iterator.next()
    if (nextState.done) break
    if (nextState.value) lastState = nextState.value
    updateWithStep(nextState.value)
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
