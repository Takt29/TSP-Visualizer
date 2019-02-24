//import { pushHistory } from './history.js'
//import effectiveBranchingFactor from './effectiveBranchingFactor.js'

let _step = 0
let maxScore = -Infinity
let minDistance = Infinity
let bestMinDistance = Infinity
let maxDepth = 0

const update = (state, displayStep = null) => {
  if (displayStep === null)
    $('#steps').text(_step.toString())
  else
    $('#steps').text(displayStep.toString())

  $('#ebfactor').text(effectiveBranchingFactor(maxDepth, _step).toFixed(2))
  if (state == null) return

  const { distance = 0, score = -Infinity, num = 0, history = [] } = state

  maxScore = Math.max(maxScore, score)
  maxDepth = Math.max(maxDepth, state.history.length)

  if (num == history.length && distance) {
    minDistance = Math.min(minDistance, distance)
    bestMinDistance = Math.min(bestMinDistance, distance)
  }

  $('#distance').text(distance.toFixed(2))
  $('#mindistance').text(minDistance.toFixed(2))
  $('#score').text(score.toFixed(2))
  $('#maxscore').text(maxScore.toFixed(2))
  $('#bestmindistance').text(bestMinDistance.toFixed(2))
}

const changeHeader = (algoName, num) => {
  $('#header-algo').text(algoName)
  $('#header-num').text('N = ' + num)
}

const initDisplay = (state, replace = false) => {
  _step = 0
  minDistance = Infinity
  maxScore = -Infinity
  maxDepth = 0

  if (replace)
    bestMinDistance = Infinity

  update(state)
}

const updateWithStep = (state) => {
  _step = (_step || 0) + 1
  update(state)
  pushHistory(state, _step)
}

Object.assign(this, {
  initDisplay,
  updateWithStep,
  changeHeader,
  update
})
