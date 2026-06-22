import { cookies } from 'next/headers'

export default async function GrammarDebugPage() {
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()

  return (
    <main style={{ fontFamily: 'monospace', padding: '40px', background: '#1a1a2e', minHeight: '100vh', color: 'white' }}>
      <h1 style={{ fontSize: '20px', marginBottom: '24px' }}>Cookie Debug</h1>
      <p style={{ color: '#888', marginBottom: '24px' }}>Total cookies: {allCookies.length}</p>
      {allCookies.map((c, i) => (
        <div key={i} style={{ marginBottom: '16px', background: '#2a2a3e', padding: '12px 16px', borderRadius: '8px' }}>
          <div style={{ color: '#4ade80', fontWeight: 'bold', marginBottom: '4px' }}>{c.name}</div>
          <div style={{ color: '#aaa', fontSize: '12px', wordBreak: 'break-all' }}>{c.value.substring(0, 200)}{c.value.length > 200 ? '...' : ''}</div>
        </div>
      ))}
    </main>
  )
}
