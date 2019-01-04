import { getInitState, copyState, getDistance } from './tools.js'

const startDFS = function*(config) {

  const initState = getInitState(config || {})

  const dfs = function*(curState) {
    if (curState.pos == curState.start && curState.history.length != 0) {
      if (curState.history.length == curState.num) {
        yield curState
      }
      return
    }

    yield curState

    for (let i = 0; i < curState.num; i++) {
      if (!curState.visited[i]) {
        const nextState = copyState(curState)
        nextState.pos = i
        nextState.history.push(curState.pos)
        nextState.visited[i] = true
        nextState.distance += getDistance(config.pos[curState.pos], config.pos[i])
        yield *dfs(nextState)
      }
    }
  }

  yield *dfs(initState)
}

export default startDFS

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
