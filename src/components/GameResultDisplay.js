/**
 * GameResultDisplay Component
 * Shows the result of a completed game round
 */

'use client'

import { useState, useEffect } from 'react'

/**
 * Confetti animation for winners
 */
function Confetti({ active }) {
  if (!active) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
            backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'][
              Math.floor(Math.random() * 5)
            ],
            width: `${6 + Math.random() * 6}px`,
            height: `${6 + Math.random() * 6}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  )
}

/**
 * Format ETH value
 */
function formatETH(value) {
  if (!value) return '0'
  const num = parseFloat(value)
  if (num >= 1) return num.toFixed(4)
  if (num >= 0.01) return num.toFixed(6)
  return num.toFixed(8)
}

/**
 * Format percentage
 */
function formatPercent(value) {
  return `${(value * 100).toFixed(2)}%`
}

export default function GameResultDisplay({
  result = null,
  userPrediction = null,
  userEntry = null,
  onClaimReward,
  onViewHistory,
  isLoading = false,
  className = '',
}) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [animateNumbers, setAnimateNumbers] = useState(false)

  // Determine outcome
  const isWinner = result && userPrediction && result.outcome === userPrediction
  const hasReward = isWinner && result?.reward > 0
  const isClaimed = result?.claimed || false

  // Trigger animations
  useEffect(() => {
    if (result && !isLoading) {
      setTimeout(() => setAnimateNumbers(true), 300)
      if (isWinner) {
        setTimeout(() => setShowConfetti(true), 500)
      }
    }
  }, [result, isLoading, isWinner])

  if (isLoading) {
    return (
      <div className={`bg-gray-800/50 rounded-2xl p-8 ${className}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-700/50 animate-pulse" />
          <div className="w-48 h-6 rounded bg-gray-700/50 animate-pulse" />
          <div className="w-32 h-4 rounded bg-gray-700/50 animate-pulse" />
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className={`bg-gray-800/50 rounded-2xl p-8 text-center ${className}`}>
        <div className="text-gray-400">
          <div className="text-6xl mb-4">⏳</div>
          <h3 className="text-xl font-semibold mb-2">Round in Progress</h3>
          <p className="text-sm">Results will appear when the round ends</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative bg-gray-800/50 rounded-2xl overflow-hidden ${className}`}>
      <Confetti active={showConfetti} />

      {/* Header */}
      <div
        className={`p-6 text-center ${
          isWinner
            ? 'bg-gradient-to-r from-green-600/30 to-emerald-600/30'
            : result.outcome
            ? 'bg-gradient-to-r from-red-600/30 to-rose-600/30'
            : 'bg-gray-700/30'
        }`}
      >
        <div
          className={`text-6xl mb-4 transition-transform duration-500 ${
            animateNumbers ? 'scale-100' : 'scale-0'
          }`}
        >
          {isWinner ? '🎉' : result.outcome ? '😔' : '🤝'}
        </div>

        <h2 className="text-2xl font-bold mb-1">
          {isWinner ? 'You Won!' : result.outcome ? 'Better Luck Next Time' : 'Round Ended'}
        </h2>

        <p className="text-gray-400">
          Round #{result.roundId} • {new Date(result.endTime).toLocaleDateString()}
        </p>
      </div>

      {/* Result Details */}
      <div className="p-6 space-y-6">
        {/* Price Movement */}
        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-1">Opening Price</p>
            <p className="text-lg font-mono">${result.openPrice?.toLocaleString()}</p>
          </div>

          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                result.outcome === 'UP'
                  ? 'bg-green-500/20 text-green-500'
                  : 'bg-red-500/20 text-red-500'
              }`}
            >
              {result.outcome === 'UP' ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              )}
            </div>
            <span className={`text-sm mt-1 ${
              result.outcome === 'UP' ? 'text-green-500' : 'text-red-500'
            }`}>
              {result.outcome}
            </span>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-400 mb-1">Closing Price</p>
            <p className="text-lg font-mono">${result.closePrice?.toLocaleString()}</p>
          </div>
        </div>

        {/* Your Entry */}
        {userEntry && (
          <div className="bg-gray-900/50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Your Entry</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Prediction</p>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    userPrediction === 'UP'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {userPrediction === 'UP' ? '📈' : '📉'} {userPrediction}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Entry Amount</p>
                <p className="font-mono">{formatETH(userEntry.amount)} ETH</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Result</p>
                <span
                  className={`font-semibold ${isWinner ? 'text-green-400' : 'text-red-400'}`}
                >
                  {isWinner ? 'WIN' : 'LOSS'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Reward Section */}
        {hasReward && (
          <div
            className={`bg-gradient-to-r from-yellow-600/20 to-amber-600/20 rounded-xl p-4 border border-yellow-600/30 transition-all duration-500 ${
              animateNumbers ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-400 mb-1">Your Reward</p>
                <p className="text-2xl font-bold font-mono text-yellow-300">
                  {formatETH(result.reward)} ETH
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  +{formatPercent(result.returnRate)} return
                </p>
              </div>

              {!isClaimed ? (
                <button
                  onClick={onClaimReward}
                  className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-xl transition-all hover:scale-105 active:scale-95"
                >
                  Claim Reward
                </button>
              ) : (
                <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium">
                  ✓ Claimed
                </span>
              )}
            </div>
          </div>
        )}

        {/* Round Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Pool', value: `${formatETH(result.totalPool)} ETH` },
            { label: 'Total Players', value: result.totalPlayers?.toLocaleString() },
            { label: 'Winners', value: result.winners?.toLocaleString() },
            {
              label: 'Win Rate',
              value: result.totalPlayers
                ? formatPercent(result.winners / result.totalPlayers)
                : '0%',
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className={`bg-gray-900/50 rounded-lg p-3 text-center transition-all duration-300 ${
                animateNumbers
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className="font-mono font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onViewHistory}
            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-sm font-medium transition-colors"
          >
            View History
          </button>
          <a
            href={`https://basescan.org/tx/${result.settlementTx}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-xl text-sm font-medium transition-colors text-center"
          >
            View on BaseScan ↗
          </a>
        </div>
      </div>
    </div>
  )
}
