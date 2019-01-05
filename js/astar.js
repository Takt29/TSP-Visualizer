import { getInitState, copyState, getDistance } from './tools.js'

const calcScore = (config, state, scoreType = 1) => {
  if (scoreType == 1) return calcScore1(config, state)
  if (scoreType == 2) return calcScore2(config, state)
  return state.distance
}

const calcScore1 = (config, state) => {
  let score = state.distance

  let arrayX = []
  let arrayY = []

  for (let i = 0; i < state.num; i++) {
    if (state.visited[i]) continue
    arrayX.push(config.pos[i].x)
    arrayY.push(config.pos[i].y)
  }
  arrayX.push(config.pos[state.pos].x)
  arrayY.push(config.pos[state.pos].y)

  arrayX.sort((a, b) => a - b)
  arrayY.sort((a, b) => a - b)

  score += Math.max(arrayX[arrayX.length-1] - arrayX[0], arrayY[arrayY.length-1] - arrayY[0])

  return score
}

const calcScore2 = (config, state) => {
  let score = state.distance

  if (state.history.length == state.num) return score
  if (state.history.length + 1 == state.num)
    return score + getDistance(config.pos[state.start], config.pos[state.pos])

  let maxDistance = 0
  let minDistanceFromStart = Infinity
  let minDistanceFromPos = Infinity

  for (let i = 0; i < config.num; i++) {
    if (state.visited[i] || i == state.start) continue

    minDistanceFromStart = Math.min(minDistanceFromStart, getDistance(config.pos[i], config.pos[state.start]))
    minDistanceFromPos = Math.min(minDistanceFromPos, getDistance(config.pos[i], config.pos[state.pos]))

    for (let j = i + 1; j < config.num; j++) {
      if (state.visited[j] || j == state.start) continue
      maxDistance = Math.max(maxDistance, getDistance(config.pos[i], config.pos[j]))
    }
  }

  return score + maxDistance + minDistanceFromStart + minDistanceFromPos
}

const startAStar = function*(config, scoreType = 1) {
  const initState = getInitState(config || {})
  initState.score = calcScore(config, initState)

  const compareState = (a, b) => { return a.score - b.score; };
  const pqueue = new PriorityQueue({ comparator: compareState });

  pqueue.queue(initState)

  while(pqueue.length) {
    const curState = pqueue.dequeue()
    if (curState.history.length != 0 && curState.pos == curState.start) {
      if (curState.history.length == curState.num) {
        yield curState
        return
      } else {
        continue
      }
    }

    yield curState

    for (let i = 0; i < curState.num; i++) {
      if (!curState.visited[i]) {
        const nextState = copyState(curState)
        nextState.pos = i
        nextState.history.push(curState.pos)
        nextState.visited[i] = true
        nextState.distance += getDistance(config.pos[curState.pos], config.pos[i])
        nextState.score = calcScore(config, nextState, scoreType)
        pqueue.queue(nextState)
      }
    }
  }
}

export default startAStar

/*
state = {
start = 0, //初期値
pos = 1,   //現在地
history = [0, 3], //訪問履歴(現在地を除く)
visited = [false, true, false, true, false], //訪問フラグ(現在地含む)
score = 0, //スコア
distance = 0.0, //現在距離
}
*/
