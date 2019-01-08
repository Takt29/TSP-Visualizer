import { getInitState, copyState, getDistance, getDistanceFromArray, reverse } from './tools.js'

const Temperture = (t, n) => {
  const alpha = 0.9
  return Math.pow(alpha, t / (n * n))
}

const startSA = function*(config) {
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

  yield curState

  for (let i = 0; Temperture(i, curState.num) > 1e-7; i++) {

    let minNextState = null
    let minNextStateDistance = curState.distance

    // 2-opt
    const a = Math.floor( Math.random() * (curState.num - 2) )
    const b = Math.floor( Math.random() * (curState.num - (a + 2))) + (a + 2)

    const getDistanceFromIndex = (indexA, indexB) => getDistance(posXY[curState.history[indexA]], posXY[curState.history[indexB]])

    const curTargetDist = getDistanceFromIndex(a, a+1) + getDistanceFromIndex(b, (b+1)%curState.num)
    const newTargetDist = getDistanceFromIndex(a, b) + getDistanceFromIndex(a+1, (b+1)%curState.num)

    const deltaDistance = newTargetDist - curTargetDist

    if (deltaDistance < 0 || Math.exp(-deltaDistance / Temperture(i, curState.num)) > Math.random()) {
      reverse(curState.history, a+1, b+1)
      curState.distance += deltaDistance
      yield curState
    } else {
      yield null
    }
  }
}

export default startSA

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
