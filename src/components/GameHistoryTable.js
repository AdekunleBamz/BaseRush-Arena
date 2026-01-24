/**
 * GameHistoryTable Component
 * Display table of past games with filtering and sorting
 */

'use client'

import { useState, useMemo } from 'react'

/**
 * Format ETH value
 */
function formatETH(value) {
  if (!value) return '0'
  const num = parseFloat(value)
  if (num >= 1) return num.toFixed(4)
  return num.toFixed(6)
}

/**
 * Format date
 */
function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

/**
 * Sort icon component
 */
function SortIcon({ direction }) {
  if (!direction) {
    return (
      <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    )
  }
  return (
    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={direction === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
      />
    </svg>
  )
}

export default function GameHistoryTable({
  games = [],
  isLoading = false,
  onRowClick,
  onClaimReward,
  className = '',
}) {
  const [filter, setFilter] = useState('all') // all, wins, losses, pending
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter games
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      if (filter === 'all') return true
      if (filter === 'wins') return game.won
      if (filter === 'losses') return !game.won && game.status === 'completed'
      if (filter === 'pending') return game.status === 'pending'
      return true
    })
  }, [games, filter])

  // Sort games
  const sortedGames = useMemo(() => {
    const sorted = [...filteredGames]
    sorted.sort((a, b) => {
      let aValue = a[sortConfig.key]
      let bValue = b[sortConfig.key]

      if (sortConfig.key === 'date') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1
      }
      return aValue < bValue ? 1 : -1
    })
    return sorted
  }, [filteredGames, sortConfig])

  // Paginate
  const paginatedGames = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sortedGames.slice(start, start + itemsPerPage)
  }, [sortedGames, currentPage])

  const totalPages = Math.ceil(sortedGames.length / itemsPerPage)

  // Handle sort
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }))
  }

  // Filter buttons
  const filterButtons = [
    { value: 'all', label: 'All Games', count: games.length },
    { value: 'wins', label: 'Wins', count: games.filter((g) => g.won).length },
    { value: 'losses', label: 'Losses', count: games.filter((g) => !g.won && g.status === 'completed').length },
    { value: 'pending', label: 'Pending', count: games.filter((g) => g.status === 'pending').length },
  ]

  if (isLoading) {
    return (
      <div className={`bg-gray-800/50 rounded-2xl p-6 ${className}`}>
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-24 bg-gray-700/50 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-700/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (games.length === 0) {
    return (
      <div className={`bg-gray-800/50 rounded-2xl p-12 text-center ${className}`}>
        <div className="text-6xl mb-4">🎮</div>
        <h3 className="text-xl font-semibold mb-2">No Games Yet</h3>
        <p className="text-gray-400">Start playing to see your game history here</p>
      </div>
    )
  }

  return (
    <div className={`bg-gray-800/50 rounded-2xl overflow-hidden ${className}`}>
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-4 border-b border-gray-700">
        {filterButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => {
              setFilter(btn.value)
              setCurrentPage(1)
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === btn.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            {btn.label}
            <span className="ml-2 px-2 py-0.5 rounded-full bg-black/20 text-xs">
              {btn.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-400 border-b border-gray-700">
              {[
                { key: 'roundId', label: 'Round' },
                { key: 'date', label: 'Date' },
                { key: 'prediction', label: 'Prediction' },
                { key: 'amount', label: 'Entry' },
                { key: 'outcome', label: 'Outcome' },
                { key: 'reward', label: 'Reward' },
                { key: 'status', label: 'Status' },
              ].map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-4 py-3 font-medium cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <SortIcon
                      direction={sortConfig.key === col.key ? sortConfig.direction : null}
                    />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {paginatedGames.map((game) => (
              <tr
                key={game.id}
                onClick={() => onRowClick?.(game)}
                className="hover:bg-gray-700/30 cursor-pointer transition-colors"
              >
                <td className="px-4 py-4 font-mono text-sm">#{game.roundId}</td>
                <td className="px-4 py-4 text-sm text-gray-400">{formatDate(game.date)}</td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                      game.prediction === 'UP'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {game.prediction === 'UP' ? '📈' : '📉'} {game.prediction}
                  </span>
                </td>
                <td className="px-4 py-4 font-mono text-sm">{formatETH(game.amount)} ETH</td>
                <td className="px-4 py-4">
                  {game.status === 'pending' ? (
                    <span className="text-gray-500">-</span>
                  ) : (
                    <span
                      className={`inline-flex items-center gap-1 text-sm ${
                        game.won ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {game.won ? '✓ Won' : '✗ Lost'}
                    </span>
                  )}
                </td>
                <td className="px-4 py-4">
                  {game.won && game.reward > 0 ? (
                    <span className="font-mono text-sm text-yellow-400">
                      +{formatETH(game.reward)} ETH
                    </span>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      game.status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : game.status === 'claimed'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-600/50 text-gray-400'
                    }`}
                  >
                    {game.status === 'pending' && '⏳ '}
                    {game.status === 'claimed' && '✓ '}
                    {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  {game.won && game.reward > 0 && game.status !== 'claimed' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onClaimReward?.(game)
                      }}
                      className="px-3 py-1 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-medium rounded transition-colors"
                    >
                      Claim
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700">
          <p className="text-sm text-gray-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, sortedGames.length)} of {sortedGames.length} games
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page
              if (totalPages <= 5) {
                page = i + 1
              } else if (currentPage <= 3) {
                page = i + 1
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i
              } else {
                page = currentPage - 2 + i
              }
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {page}
                </button>
              )
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
