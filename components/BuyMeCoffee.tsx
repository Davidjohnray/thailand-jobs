'use client'
import { useState } from 'react'

export default function BuyMeCoffee() {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ textAlign: 'center' }}>
      <button onClick={() => setOpen(!open)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '30px', background: '#FFF8E1', border: '2px solid #FBBF24', fontSize: '15px', fontWeight: 'bold', color: '#92400e', cursor: 'pointer' }}>
        ☕ Buy me a coffee — 40฿
      </button>

      {open && (
        <div style={{ marginTop: '16px', background: '#FFF8E1', border: '2px solid #FBBF24', borderRadius: '12px', padding: '20px', maxWidth: '320px', margin: '16px auto 0', textAlign: 'left' }}>
          <p style={{ fontWeight: 'bold', color: '#92400e', marginBottom: '12px', fontSize: '15px' }}>☕ Thank you! Transfer 40฿ to:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: '#666' }}>Bank</span>
              <span style={{ fontWeight: 'bold', color: '#1a1a2e' }}>Kasikorn Bank (KBank)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: '#666' }}>Account Name</span>
              <span style={{ fontWeight: 'bold', color: '#1a1a2e' }}>David Ray</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: '#666' }}>Account Number</span>
              <span style={{ fontWeight: 'bold', color: '#1a1a2e' }}>662-2-03420-2</span>
            </div>
          </div>
          <p style={{ color: '#92400e', fontSize: '13px', marginTop: '12px', textAlign: 'center' }}>Every coffee keeps the site running 🙏</p>
          <button onClick={() => setOpen(false)}
            style={{ width: '100%', marginTop: '10px', background: 'none', border: '1px solid #FBBF24', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#92400e', fontSize: '13px' }}>
            Close
          </button>
        </div>
      )}
    </div>
  )
}