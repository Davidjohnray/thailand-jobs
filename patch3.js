const fs = require('fs');
let c = fs.readFileSync('app/admin/page.tsx', 'utf8');
if (!c.includes('loadLearnThaiCodes')) {
  c = c.replace('const uploadCoverImage', const loadLearnThaiCodes = async () => { const { data } = await adminSupabase.from('learn_thai_codes').select('*').order('created_at', { ascending: false }); setLearnThaiCodes(data || []) }
  const generateLearnThaiCode = async () => { setGeneratingLTCode(true); const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; const seg = (n) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join(''); const code = 'THAI-' + seg(4) + '-' + seg(4); const expiresAt = new Date(); expiresAt.setDate(expiresAt.getDate() + 30); const { error } = await adminSupabase.from('learn_thai_codes').insert([{ code, email: newLTEmail.trim() || null, plan: 'monthly', active: true, expires_at: expiresAt.toISOString() }]); if (error) { alert('Error: ' + error.message) } else { setNewLTEmail(''); loadLearnThaiCodes(); alert('Code: ' + code) }; setGeneratingLTCode(false) }
  const revokeLearnThaiCode = async (id, active) => { if (!confirm(active ? 'Disable?' : 'Enable?')) return; await adminSupabase.from('learn_thai_codes').update({ active: !active }).eq('id', id); loadLearnThaiCodes() }
  const uploadCoverImage); console.log('functions added');
}
if (!c.includes("Learn Thai (")) {
  c = c.replace("{ id: 'recruiter',", "{ id: 'learnthai', label: \Learn Thai (\)\ },\n            { id: 'recruiter',"); console.log('tab button added');
}
if (!c.includes("activeTab === 'learnthai'")) {
  c = c.replace("{/* TEFL LEADS TAB */}", {activeTab === 'learnthai' && (<div><h2 style={{fontSize:'20px',fontWeight:'bold',marginBottom:'16px'}}>Learn Thai Subscriptions</h2><div style={{background:'white',borderRadius:'12px',padding:'24px',marginBottom:'20px',border:'2px solid #a7f3d0'}}><div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}><input value={newLTEmail} onChange={e=>setNewLTEmail(e.target.value)} placeholder="Subscriber email (optional)" style={{flex:1,minWidth:'200px',padding:'10px',borderRadius:'8px',border:'1px solid #ddd',fontSize:'14px',outline:'none'}}/><button disabled={generatingLTCode} onClick={generateLearnThaiCode} style={{background:generatingLTCode?'#ccc':'#10b981',color:'white',padding:'10px 24px',borderRadius:'8px',border:'none',fontWeight:'800',cursor:'pointer'}}>{generatingLTCode?'Generating...':'Generate Code'}</button></div></div>{learnThaiCodes.length===0?(<div style={{textAlign:'center',padding:'40px',color:'#888'}}>No codes yet.</div>):(<div style={{display:'flex',flexDirection:'column',gap:'10px'}}>{learnThaiCodes.map((lt)=>(<div key={lt.id} style={{background:'white',borderRadius:'10px',padding:'16px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}><div><div style={{fontFamily:'monospace',fontSize:'16px',color:'#10b981',fontWeight:'900'}}>{lt.code}</div><div style={{color:'#888',fontSize:'12px'}}>{lt.email||'No email'} - Expires: {lt.expires_at?new Date(lt.expires_at).toLocaleDateString('en-GB'):'—'}</div></div><div style={{display:'flex',gap:'8px'}}><button onClick={()=>navigator.clipboard.writeText(lt.code).then(()=>alert('Copied: '+lt.code))} style={{background:'#f0fdf4',color:'#15803d',border:'none',padding:'8px 14px',borderRadius:'8px',cursor:'pointer',fontWeight:'bold'}}>Copy</button><button onClick={()=>revokeLearnThaiCode(lt.id,lt.active)} style={{background:lt.active?'#ffeaea':'#e8f5e9',color:lt.active?'#c62828':'#2e7d32',border:'none',padding:'8px 14px',borderRadius:'8px',cursor:'pointer',fontWeight:'bold'}}>{lt.active?'Disable':'Enable'}</button></div></div>))}</div>)}</div>)}
        {/* TEFL LEADS TAB */}); console.log('tab content added');
}
if (!c.includes("activeTab !== 'learnthai'")) {
  c = c.replace("activeTab !== 'duke' && (", "activeTab !== 'duke' && activeTab !== 'learnthai' && ("); console.log('exclusion added');
}
if (!c.includes('loadLearnThaiCodes()')) {
  c = c.replace('loadArcadeCodes(); loadArcadeTeachers(); loadArcadeGames()', 'loadArcadeCodes(); loadArcadeTeachers(); loadArcadeGames(); loadLearnThaiCodes()'); console.log('useEffect added');
}
fs.writeFileSync('app/admin/page.tsx', c);
console.log('Done!');
