
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

  if (loading) return <Loading message="Loading leaderboard..." />

  return (
    <div className="card">
      <h2>🏆 Leaderboard</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.2)' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Rank</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Player</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Entries</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Wins</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Win Rate</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((player, index) => (
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
