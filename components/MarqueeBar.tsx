export default function MarqueeBar() {
  return (
    <div style={{ background: '#1a1a2e', borderBottom: '2px solid #E85D26', overflow: 'hidden', padding: '10px 0', whiteSpace: 'nowrap' }}>
      <div style={{
        display: 'inline-block',
        animation: 'marquee 30s linear infinite',
      }}>
        <span style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '14px', marginRight: '60px' }}>🎮 FREE ESL Games just launched!</span>
        <span style={{ color: 'white', fontSize: '14px', marginRight: '60px' }}>Browse ready-to-play classroom games for Under 5s, Ages 5-6, and Primary →</span>
        <span style={{ color: '#FBBF24', fontWeight: 'bold', fontSize: '14px', marginRight: '60px' }}>📖 Premium lesson plans from just 10฿</span>
        <span style={{ color: 'white', fontSize: '14px', marginRight: '60px' }}>English, Math, Science & Social Studies for primary school teachers →</span>
        <span style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '14px', marginRight: '60px' }}>🎓 Find a private teacher in Thailand</span>
        <span style={{ color: 'white', fontSize: '14px', marginRight: '60px' }}>Browse verified teacher profiles and book lessons today →</span>
        <span style={{ color: '#FBBF24', fontWeight: 'bold', fontSize: '14px', marginRight: '60px' }}>💼 New teaching jobs added daily</span>
        <span style={{ color: 'white', fontSize: '14px', marginRight: '60px' }}>Register free to get early access to new jobs before anyone else →</span>
        <span style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '14px', marginRight: '60px' }}>🏠 Rentals across Thailand</span>
        <span style={{ color: 'white', fontSize: '14px', marginRight: '60px' }}>Condos, houses and villas in Bangkok, Chiang Mai, Phuket and more →</span>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  )
}