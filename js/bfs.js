import { getInitState, copyState, getDistance } from './tools.js'

const startBFS = function*(config) {
  const initState = getInitState(config || {})

  let minimumDistanceState = copyState(initState)
  let minimumDistance = Infinity

  let currentQueue = [], nextQueue = []

  currentQueue.push(initState)

  for (let i = 0; i < config.num; i++) {
    for (const curState of currentQueue) {
      if (i != 0 && curState.pos == curState.start) continue

      yield curState

      for (let i = 0; i < curState.num; i++) {
        if (!curState.visited[i]) {
          const nextState = copyState(curState)
          nextState.pos = i
          nextState.history.push(curState.pos)
          nextState.visited[i] = true
          nextState.distance += getDistance(config.pos[curState.pos], config.pos[i])
          nextQueue.push(nextState)
        }
      }
    }

    currentQueue = nextQueue
    nextQueue = []
  }

  for (const curState of currentQueue) {
    if (curState.pos == curState.start) {
      if (minimumDistance > curState.distance) {
        minimumDistanceState = copyState(curState)
        minimumDistance = curState.distance
      }
      yield curState
    }
  }

  if (minimumDistance !== Infinity)
    yield minimumDistanceState
}

export default startBFS

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
