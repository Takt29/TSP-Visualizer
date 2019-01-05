const effectiveBranchingFactor = (depth, N) => {
  let L = 1.0, R = N

  while (R - L > 1e-4) {
    const mid = (L + R) / 2

    const val = (1 - Math.pow(mid, depth + 1)) / (1 - mid)

    if (N < val) {
      R = mid
    } else {
      L = mid
    }
  }

  return (R + L) / 2
}

export default effectiveBranchingFactor
