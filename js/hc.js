import { getInitState, copyState, getDistance, getDistanceFromArray, reverse } from './tools.js'

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

    let minNextState = null
    let minNextStateDistance = curState.distance

    // 2-opt
    for (let i = 0; i < curState.num - 2; i++) {
      for (let j = i + 2; j < curState.num; j++) {
        const nextState = copyState(curState)

        const getDistanceFromIndex = (indexA, indexB) => getDistance(posXY[curState.history[indexA]], posXY[curState.history[indexB]])

        const curTargetDist = getDistanceFromIndex(i, i+1) + getDistanceFromIndex(j, (j+1)%curState.num)
        const newTargetDist = getDistanceFromIndex(i, j) + getDistanceFromIndex(i+1, (j+1)%curState.num)

        if (curTargetDist > newTargetDist) {
          nextState.distance += newTargetDist - curTargetDist
          reverse(nextState.history, i+1, j+1)
        }

        if (minNextState) yield null

        if (minNextStateDistance > nextState.distance) {
          minNextState = nextState
          minNextStateDistance = nextState.distance
        }
      }
    }

    if (!minNextState) break
    curState = minNextState
  }
}

export default startHC

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
