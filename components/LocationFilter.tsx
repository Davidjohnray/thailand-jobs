'use client'
import { useEffect, useState } from 'react'

export const ALL_LOCATIONS = 'All Locations'
const OTHER = '__other__'

// All 77 provinces + popular areas, sorted A–Z automatically
const PROVINCES = [
  'Amnat Charoen', 'Ang Thong', 'Ayutthaya', 'Bangkok', 'Bueng Kan', 'Buriram',
  'Chachoengsao', 'Chai Nat', 'Chaiyaphum', 'Chanthaburi', 'Chiang Mai', 'Chiang Rai',
  'Chon Buri', 'Chumphon', 'Kalasin', 'Kamphaeng Phet', 'Kanchanaburi', 'Khon Kaen',
  'Krabi', 'Lampang', 'Lamphun', 'Loei', 'Lopburi', 'Mae Hong Son', 'Maha Sarakham',
  'Mukdahan', 'Nakhon Nayok', 'Nakhon Pathom', 'Nakhon Phanom', 'Nakhon Ratchasima',
  'Nakhon Sawan', 'Nakhon Si Thammarat', 'Nan', 'Narathiwat', 'Nong Bua Lamphu',
  'Nong Khai', 'Nonthaburi', 'Pathum Thani', 'Pattani', 'Phangnga', 'Phatthalung',
  'Phayao', 'Phetchabun', 'Phetchaburi', 'Phichit', 'Phitsanulok', 'Phrae', 'Phuket',
  'Prachin Buri', 'Prachuap Khiri Khan', 'Ranong', 'Ratchaburi', 'Rayong', 'Roi Et',
  'Sa Kaeo', 'Sakon Nakhon', 'Samut Prakan', 'Samut Sakhon', 'Samut Songkhram',
  'Saraburi', 'Satun', 'Si Sa Ket', 'Sing Buri', 'Songkhla', 'Sukhothai', 'Suphan Buri',
  'Surat Thani', 'Surin', 'Tak', 'Trang', 'Trat', 'Ubon Ratchathani', 'Udon Thani',
  'Uthai Thani', 'Uttaradit', 'Yala', 'Yasothon',
]
const POPULAR_AREAS = ['Hua Hin', 'Koh Samui', 'Pattaya']

export const LOCATION_OPTIONS = [...PROVINCES, ...POPULAR_AREAS].sort((a, b) => a.localeCompare(b))

// "Chon Buri", "Chonburi" and "Pattaya / Chonburi" all match each other
function norm(s?: string) {
  return (s || '').toLowerCase().replace(/[^a-z]/g, '')
}

export function matchesLocation(jobLocation: string | undefined, filter: string) {
  if (!filter || filter === ALL_LOCATIONS) return true
  const f = norm(filter)
  if (!f) return true
  return norm(jobLocation).includes(f)
}

const fieldStyle: React.CSSProperties = {
  width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd',
  fontSize: '14px', background: 'white', outline: 'none', boxSizing: 'border-box',
}

export default function LocationFilter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const isListed = value === ALL_LOCATIONS || value === 'Remote' || LOCATION_OPTIONS.includes(value)
  const [otherMode, setOtherMode] = useState(!isListed)

  // "Reset Filters" sets All Locations → close the typing box
  useEffect(() => {
    if (value === ALL_LOCATIONS) setOtherMode(false)
  }, [value])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <select
        value={otherMode ? OTHER : value}
        onChange={e => {
          const v = e.target.value
          if (v === OTHER) { setOtherMode(true); onChange('') }
          else { setOtherMode(false); onChange(v) }
        }}
        style={fieldStyle}>
        <option value={ALL_LOCATIONS}>All Locations</option>
        {LOCATION_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
        <option value="Remote">Remote</option>
        <option value={OTHER}>Other — type a city…</option>
      </select>

      {otherMode && (
        <input
          autoFocus
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Type a city or area, e.g. Hat Yai"
          style={fieldStyle}
        />
      )}
    </div>
  )
}