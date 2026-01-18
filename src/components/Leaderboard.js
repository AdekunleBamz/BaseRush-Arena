
// Leaderboard Component
// Displays the top players with their entries and wins. Currently uses sample data.
'use client'


// React and external hooks
import { useEffect, useState } from 'react'
import { useReadContract } from 'wagmi'

// App-specific imports
import { CONTRACTS, GAME_POOL_ABI } from '../lib/contracts'
import Loading from './Loading'
import ErrorMessage from './ErrorMessage'


// Main Leaderboard component
export default function Leaderboard() {
  // State for leaderboard data and loading
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('wins') // Default sort by wins
  const [sortDirection, setSortDirection] = useState('desc') // desc or asc

  // Simulate fetching leaderboard data (replace with contract call in production)
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Sample data for demonstration
        const sampleData = [
          { address: '0x1234...abcd', entries: 150, wins: 45 },
          { address: '0x5678...efgh', entries: 120, wins: 38 },
          { address: '0x9abc...ijkl', entries: 98, wins: 29 },
          { address: '0xdef0...mnop', entries: 85, wins: 22 },
          { address: '0xqrst...uvwx', entries: 72, wins: 18 }
        ]
        setLeaderboard(sampleData)
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [])

  // Sort leaderboard data
  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    let aVal = a[sortBy]
    let bVal = b[sortBy]
    
    if (sortBy === 'winRate') {
      aVal = a.wins / a.entries
      bVal = b.wins / b.entries
    }
    
    if (sortDirection === 'asc') {
      return aVal - bVal
    } else {
      return bVal - aVal
    }
  })

  // Handle refresh
  const handleRefresh = async () => {
    setLoading(true)
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800))
      // In production, this would refetch from contract
      const sampleData = [
        { address: '0x1234...abcd', entries: Math.floor(Math.random() * 200) + 100, wins: Math.floor(Math.random() * 50) + 20 },
        { address: '0x5678...efgh', entries: Math.floor(Math.random() * 180) + 80, wins: Math.floor(Math.random() * 40) + 15 },
        { address: '0x9abc...ijkl', entries: Math.floor(Math.random() * 150) + 60, wins: Math.floor(Math.random() * 35) + 10 },
        { address: '0xdef0...mnop', entries: Math.floor(Math.random() * 120) + 40, wins: Math.floor(Math.random() * 30) + 8 },
        { address: '0xqrst...uvwx', entries: Math.floor(Math.random() * 100) + 20, wins: Math.floor(Math.random() * 25) + 5 }
      ]
      setLeaderboard(sampleData)
    } catch (error) {
      console.error('Failed to refresh leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading message="Loading leaderboard..." />

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2>🏆 Leaderboard</h2>
        <button 
          className="btn" 
          onClick={handleRefresh}
          disabled={loading}
          style={{ fontSize: '14px', padding: '6px 12px' }}
        >
          {loading ? '⏳' : '🔄'} {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.2)' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Rank</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Player</th>
              <th 
                style={{ padding: '12px', textAlign: 'center', cursor: 'pointer' }}
                onClick={() => handleSort('entries')}
              >
                Entries {sortBy === 'entries' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                style={{ padding: '12px', textAlign: 'center', cursor: 'pointer' }}
                onClick={() => handleSort('wins')}
              >
                Wins {sortBy === 'wins' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                style={{ padding: '12px', textAlign: 'center', cursor: 'pointer' }}
                onClick={() => handleSort('winRate')}
              >
                Win Rate {sortBy === 'winRate' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedLeaderboard.map((player, index) => (
              <tr key={player.address} style={{
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                background: index === 0 ? 'rgba(255,215,0,0.1)' : 'transparent'
              }}>
                <td style={{ padding: '12px' }}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </td>
                <td style={{ padding: '12px', fontFamily: 'monospace' }}>
                  {player.address}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {player.entries}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {player.wins}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {((player.wins / player.entries) * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
