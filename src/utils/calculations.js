/**
 * Math/Calculation Utility Functions
 * Provides calculations for game statistics and analytics
 */

/**
 * Calculates win rate percentage
 * @param {number} wins - Number of wins
 * @param {number} total - Total games
 * @returns {number} Win rate as percentage (0-100)
 */
export function calculateWinRate(wins, total) {
  if (total === 0) return 0
  return (wins / total) * 100
}

/**
 * Calculates expected value for a bet
 * @param {number} winProbability - Probability of winning (0-1)
 * @param {number} winAmount - Amount won if successful
 * @param {number} lossAmount - Amount lost if unsuccessful
 * @returns {number} Expected value
 */
export function calculateExpectedValue(winProbability, winAmount, lossAmount) {
  return (winProbability * winAmount) - ((1 - winProbability) * lossAmount)
}

/**
 * Calculates compounded returns
 * @param {number} principal - Initial amount
 * @param {number} rate - Interest rate per period (as decimal)
 * @param {number} periods - Number of compounding periods
 * @returns {number} Final amount after compounding
 */
export function calculateCompoundedReturns(principal, rate, periods) {
  return principal * Math.pow(1 + rate, periods)
}

/**
 * Calculates APY from APR with compounding frequency
 * @param {number} apr - Annual percentage rate (as decimal)
 * @param {number} compoundingPeriods - Number of times interest is compounded per year
 * @returns {number} APY as decimal
 */
export function calculateAPY(apr, compoundingPeriods = 365) {
  return Math.pow(1 + apr / compoundingPeriods, compoundingPeriods) - 1
}

/**
 * Calculates the current streak from game history
 * @param {Array<boolean>} results - Array of game results (true = win, false = loss)
 * @returns {object} Current and longest streaks
 */
export function calculateStreaks(results) {
  if (!results || results.length === 0) {
    return { currentStreak: 0, longestStreak: 0, type: null }
  }

  let currentStreak = 0
  let longestStreak = 0
  let currentType = null
  let tempStreak = 0
  let tempType = null

  for (let i = results.length - 1; i >= 0; i--) {
    const result = results[i]
    
    if (tempType === null) {
      tempType = result
      tempStreak = 1
    } else if (result === tempType) {
      tempStreak++
    } else {
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak
      }
      tempType = result
      tempStreak = 1
    }
    
    // Track current streak (from most recent)
    if (i === results.length - 1) {
      currentType = result
      currentStreak = 1
    } else if (result === currentType && i === results.length - currentStreak - 1) {
      currentStreak++
    }
  }
  
  if (tempStreak > longestStreak) {
    longestStreak = tempStreak
  }

  return {
    currentStreak,
    longestStreak,
    type: currentType ? 'win' : 'loss',
  }
}

/**
 * Calculates profit/loss from game history
 * @param {Array<{result: string, amount: number}>} history - Game history
 * @returns {object} Profit/loss statistics
 */
export function calculateProfitLoss(history) {
  if (!history || history.length === 0) {
    return {
      totalProfit: 0,
      totalLoss: 0,
      netProfit: 0,
      avgWin: 0,
      avgLoss: 0,
      profitFactor: 0,
    }
  }

  let totalProfit = 0
  let totalLoss = 0
  let winCount = 0
  let lossCount = 0

  for (const game of history) {
    if (game.result === 'win' || game.amount > 0) {
      totalProfit += Math.abs(game.amount)
      winCount++
    } else {
      totalLoss += Math.abs(game.amount)
      lossCount++
    }
  }

  const avgWin = winCount > 0 ? totalProfit / winCount : 0
  const avgLoss = lossCount > 0 ? totalLoss / lossCount : 0
  const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Infinity : 0

  return {
    totalProfit,
    totalLoss,
    netProfit: totalProfit - totalLoss,
    avgWin,
    avgLoss,
    profitFactor,
    winCount,
    lossCount,
  }
}

/**
 * Calculates maximum drawdown from equity curve
 * @param {Array<number>} equityCurve - Array of portfolio values over time
 * @returns {object} Drawdown statistics
 */
export function calculateMaxDrawdown(equityCurve) {
  if (!equityCurve || equityCurve.length === 0) {
    return { maxDrawdown: 0, maxDrawdownPercent: 0 }
  }

  let peak = equityCurve[0]
  let maxDrawdown = 0
  let maxDrawdownPercent = 0

  for (const value of equityCurve) {
    if (value > peak) {
      peak = value
    }
    
    const drawdown = peak - value
    const drawdownPercent = peak > 0 ? (drawdown / peak) * 100 : 0
    
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown
      maxDrawdownPercent = drawdownPercent
    }
  }

  return { maxDrawdown, maxDrawdownPercent }
}

/**
 * Generates a random number within a range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number in range
 */
export function randomInRange(min, max) {
  return Math.random() * (max - min) + min
}

/**
 * Generates a random integer within a range
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @returns {number} Random integer in range
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Clamps a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Linearly interpolates between two values
 * @param {number} a - Start value
 * @param {number} b - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
export function lerp(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1)
}

/**
 * Rounds a number to specified decimal places
 * @param {number} value - Value to round
 * @param {number} decimals - Number of decimal places
 * @returns {number} Rounded value
 */
export function roundTo(value, decimals = 2) {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}
