/**
 * PriceChart Component  
 * ETH price chart with multiple timeframes
 */

'use client'

import { useState, useMemo } from 'react'

/**
 * Simple sparkline SVG
 */
function Sparkline({ data, width = 200, height = 60, color = '#3b82f6', fill = true }) {
  if (!data || data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((value - min) / range) * height
    return `${x},${y}`
  })

  const pathD = `M ${points.join(' L ')}`
  const fillD = `${pathD} L ${width},${height} L 0,${height} Z`

  return (
    <svg width={width} height={height} className="overflow-visible">
      {fill && (
        <path
          d={fillD}
          fill={`url(#gradient-${color})`}
          className="opacity-20"
        />
      )}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/**
 * Format price
 */
function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

/**
 * Format percentage
 */
function formatPercent(value) {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

/**
 * Timeframe options
 */
const timeframes = [
  { key: '1h', label: '1H' },
  { key: '24h', label: '24H' },
  { key: '7d', label: '7D' },
  { key: '30d', label: '30D' },
]

export default function PriceChart({
  currentPrice = 0,
  priceChange = 0,
  priceData = {},
  isLoading = false,
  onTimeframeChange,
  className = '',
}) {
  const [activeTimeframe, setActiveTimeframe] = useState('24h')

  const isPositive = priceChange >= 0
  const chartColor = isPositive ? '#22c55e' : '#ef4444'

  const chartData = useMemo(() => {
    return priceData[activeTimeframe] || []
  }, [priceData, activeTimeframe])

  const handleTimeframeChange = (timeframe) => {
    setActiveTimeframe(timeframe)
    onTimeframeChange?.(timeframe)
  }

  if (isLoading) {
    return (
      <div className={`bg-gray-800/50 rounded-2xl p-6 ${className}`}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="h-4 w-20 bg-gray-700/50 rounded animate-pulse mb-2" />
            <div className="h-8 w-32 bg-gray-700/50 rounded animate-pulse mb-1" />
            <div className="h-4 w-16 bg-gray-700/50 rounded animate-pulse" />
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 w-12 bg-gray-700/50 rounded animate-pulse" />
            ))}
          </div>
        </div>
        <div className="h-40 bg-gray-700/50 rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className={`bg-gray-800/50 rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-400 mb-1">ETH/USD</p>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold font-mono">
              {formatPrice(currentPrice)}
            </span>
            <span
              className={`text-lg font-medium ${
                isPositive ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {formatPercent(priceChange)}
            </span>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex gap-1 bg-gray-900/50 rounded-lg p-1">
          {timeframes.map((tf) => (
            <button
              key={tf.key}
              onClick={() => handleTimeframeChange(tf.key)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                activeTimeframe === tf.key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-40">
        {chartData.length > 0 ? (
          <div className="w-full h-full">
            <Sparkline
              data={chartData.map((d) => d.price)}
              width={500}
              height={160}
              color={chartColor}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No data available for this timeframe
          </div>
        )}

        {/* Price markers */}
        {chartData.length > 0 && (
          <div className="absolute inset-y-0 right-0 flex flex-col justify-between text-xs text-gray-500 font-mono">
            <span>{formatPrice(Math.max(...chartData.map((d) => d.price)))}</span>
            <span>{formatPrice(Math.min(...chartData.map((d) => d.price)))}</span>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-700">
        <div>
          <p className="text-xs text-gray-500 mb-1">24h High</p>
          <p className="font-mono text-green-400">
            {formatPrice(priceData.high24h || currentPrice * 1.02)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">24h Low</p>
          <p className="font-mono text-red-400">
            {formatPrice(priceData.low24h || currentPrice * 0.98)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">24h Volume</p>
          <p className="font-mono">
            ${((priceData.volume24h || 1234567890) / 1e9).toFixed(2)}B
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Market Cap</p>
          <p className="font-mono">
            ${((priceData.marketCap || 300000000000) / 1e9).toFixed(0)}B
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Mini price display for headers/nav
 */
export function MiniPriceDisplay({ price, change }) {
  const isPositive = change >= 0

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-400">ETH</span>
      <span className="font-mono font-medium">{formatPrice(price)}</span>
      <span
        className={`font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}
      >
        {formatPercent(change)}
      </span>
    </div>
  )
}
