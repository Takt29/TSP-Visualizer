/*
import { getDistance, sleep } from './tools.js'
import { initCanvas, drawGraph } from './canvas.js'
import { initDisplay, updateWithStep, changeHeader, update } from './display.js'
import { initHistory, getHistorySize, getHistory, pushHistory } from './history.js'
import dfs from './dfs.js'
import bfs from './bfs.js'
import astar from './astar.js'
import hc from './hc.js'
import sa from './sa.js'
*/

let iterator = null
let isStopped = false
let config = null
let historyIndex = null

function init() {
  isStopped = true
  initCanvas()
  config = getConfig()
  change(true)
  $('.btn').removeAttr('disabled');
}

function change(replace = false) {
  isStopped = true
  if (!config) config = getConfig()

  const type = $('#type').val()
  let algoName = ''

  switch(type) {
  case 'dfs':
    iterator = dfs(config)
    algoName = '[最適解]深さ優先探索'
    break;
  case 'bfs':
    iterator = bfs(config)
    algoName = '[最適解]幅優先探索'
    break;
  case 'astar1':
    iterator = astar(config, 1)
    algoName = '[最適解]A*探索①'
    break;
  case 'astar2':
    iterator = astar(config, 2)
    algoName = '[最適解]A*探索②'
    break;
  case 'hc':
    iterator = hc(config)
    algoName = '[近似解]山登り法'
    break;
  case 'sa':
    iterator = sa(config)
    algoName = '[近似解]焼きなまし法'
    break;
  default:
    iterator = null
    algoName = ''
    break;
  }

  initHistory()
  historyIndex = null
  const state = step()
  initDisplay(state.value, replace)
  changeHeader(algoName, config.num)
  pushHistory(state.value, 0)
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

const showHistory = (historyIndex) => {
  const historyItem = getHistory(historyIndex)

  console.log(historyItem)

  if (historyItem && config) {
    update(historyItem.state, historyItem.step)
    drawGraph(config, historyItem.state)
  }
}

async function run() {
  if(!config || !iterator) return

  isStopped = false

  while (iterator && !isStopped) {
    if (historyIndex === 1) {
      historyIndex = null
    }

    if (historyIndex !== null) {
      historyIndex -= 1
      showHistory(historyIndex)
      await sleep(30)
      continue
    }

    const nextState = iterator.next()
    if (nextState.done) break
    drawGraph(config, nextState.value)
    updateWithStep(nextState.value)
    if(nextState.value) await sleep(30)
  }
}

function backstep() {
  if (!iterator) return

  if (historyIndex === null) {
    historyIndex = 1
  } else if (historyIndex + 1 < getHistorySize()) {
    historyIndex += 1
  }

  showHistory(historyIndex)
}

function step() {
  if (!iterator) return

  if (historyIndex !== null) {
    if (historyIndex === 1) {
      historyIndex = null
    } else {
      historyIndex -= 1
      showHistory(historyIndex)
      return
    }
  }

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
window.backstep = backstep
window.stop = stop
window.toBegin = toBegin
window.toEnd = toEnd
