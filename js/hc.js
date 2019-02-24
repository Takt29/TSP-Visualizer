//import { getInitState, copyState, getDistance, getDistanceFromArray, reverse } from './tools.js'

const startHC = function*(config) {
  const initState = getInitState(config || {})

  initState.pos = initState.start

  initState.history.push(initState.start)
  for (let i = 0; i < initState.num; i++) {
    initState.visited[i] = true

    if (i != initState.start)
      initState.history.push(i)
  }

  initState.distance = getDistanceFromArray(config.pos, initState.history.concat(initState.pos))

  let curState = copyState(initState)
  const posXY = config.pos

  while (1) {
    yield curState

    let minNextStateDeltaDistance = 0
    let minNextStateIndexA = -1
    let minNextStateIndexB = -1
    let firstState = true

    // 2-opt
    for (let i = 0; i < curState.num - 2; i++) {
      for (let j = i + 2; j < curState.num; j++) {
        const getDistanceFromIndex = (indexA, indexB) => getDistance(posXY[curState.history[indexA]], posXY[curState.history[indexB]])

        const curTargetDist = getDistanceFromIndex(i, i+1) + getDistanceFromIndex(j, (j+1)%curState.num)
        const newTargetDist = getDistanceFromIndex(i, j) + getDistanceFromIndex(i+1, (j+1)%curState.num)

        if (minNextStateDeltaDistance > newTargetDist - curTargetDist) {
          minNextStateDeltaDistance = newTargetDist - curTargetDist
          minNextStateIndexA = i
          minNextStateIndexB = j
        }

        if (firstState) {
          yield null
          firstState = true
        }
      }
    }

    if (minNextStateDeltaDistance < 0) {
      curState.distance += minNextStateDeltaDistance
      reverse(curState.history, minNextStateIndexA+1, minNextStateIndexB+1)
    } else {
      yield null
      break
    }
  }
}

Object.assign(this, {hc: startHC})

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
