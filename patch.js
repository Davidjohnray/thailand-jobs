const fs = require('fs');
let c = fs.readFileSync('app/admin/page.tsx', 'utf8');
c = c.replace("const [arcadeSubTab, setArcadeSubTab] = useState<'codes' | 'teachers' | 'games'>('codes')", "const [arcadeSubTab, setArcadeSubTab] = useState<'codes' | 'teachers' | 'games'>('codes')\n  const [learnThaiCodes, setLearnThaiCodes] = useState([]);\n  const [generatingLTCode, setGeneratingLTCode] = useState(false);\n  const [newLTEmail, setNewLTEmail] = useState('');");
c = c.replace("'arcade' | 'recruiter'", "'arcade' | 'learnthai' | 'recruiter'");
c = c.replace("loadArcadeCodes(); loadArcadeTeachers(); loadArcadeGames()\n      adminSupabase", "loadArcadeCodes(); loadArcadeTeachers(); loadArcadeGames(); loadLearnThaiCodes()\n      adminSupabase");
fs.writeFileSync('app/admin/page.tsx', c);
console.log('Done!');
