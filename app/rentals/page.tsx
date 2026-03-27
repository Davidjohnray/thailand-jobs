'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../src/lib/supabase'

const thaiProvinces = [
  'All Locations',
  'Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya / Chonburi', 'Koh Samui / Surat Thani',
  'Hua Hin / Prachuap', 'Krabi', 'Rayong', 'Chiang Rai',
  'Nakhon Ratchasima', 'Khon Kaen', 'Udon Thani', 'Ubon Ratchathani',
  'Nonthaburi', 'Pathum Thani', 'Samut Prakan', 'Ayutthaya',
  'Nakhon Pathom', 'Kanchanaburi', 'Lopburi', 'Saraburi',
  'Phitsanulok', 'Sukhothai', 'Lampang', 'Lamphun', 'Mae Hong Son',
  'Nan', 'Phayao', 'Phrae', 'Uttaradit', 'Tak',
  'Mukdahan', 'Nakhon Phanom', 'Sakon Nakhon', 'Nong Khai',
  'Loei', 'Chaiyaphum', 'Buriram', 'Surin', 'Si Sa Ket',
  'Yasothon', 'Amnat Charoen', 'Roi Et', 'Maha Sarakham',
  'Kalasin', 'Nong Bua Lamphu', 'Songkhla', 'Trang', 'Phatthalung',
  'Satun', 'Yala', 'Narathiwat', 'Nakhon Si Thammarat', 'Phangnga',
  'Ranong', 'Chumphon', 'Prachuap Khiri Khan', 'Samut Sakhon',
  'Samut Songkhram', 'Ratchaburi', 'Phetchaburi', 'Suphan Buri',
  'Sing Buri', 'Ang Thong', 'Chai Nat', 'Nakhon Nayok',
  'Prachin Buri', 'Sa Kaeo', 'Chanthaburi', 'Trat',
  'Chachoengsao', 'Nakhon Sawan', 'Uthai Thani', 'Kamphaeng Phet',
  'Phichit', 'Phetchabun', 'Remote', 'Other'
]

const propertyTypes = ['All Types', 'Condo', 'House', 'Apartment', 'Villa', 'Townhouse', 'Studio', 'Other']
const bedroomOptions = ['Any', '0', '1', '2', '3', '4+']

export default function RentalsPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('All Locations')
  const [propertyType, setPropertyType] = useState('All Types')
  const [bedrooms, setBedrooms] = useState('Any')
  const [maxPrice, setMaxPrice] = useState('')

  useEffect(() => {
    const fetchProperties = async () => {
      const { data } = await supabase
        .from('properties')
        .select('*, property_images(url)')
        .eq('status', 'active')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
      setProperties(data || [])
      setFiltered(data || [])
      setLoading(false)
    }
    fetchProperties()
  }, [])

  useEffect(() => {
    let result = [...properties]
    if (search) result = result.filter(p =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.location?.toLowerCase().includes(search.toLowerCase()) ||
      p.area?.toLowerCase().includes(search.toLowerCase())
    )
    if (location !== 'All Locations') result = result.filter(p => p.location === location)
    if (propertyType !== 'All Types') result = result.filter(p => p.property_type === propertyType)
    if (bedrooms !== 'Any') {
      if (bedrooms === '4+') result = result.filter(p => p.bedrooms >= 4)
      else result = result.filter(p => p.bedrooms === parseInt(bedrooms))
    }
    if (maxPrice) result = result.filter(p => p.price <= parseInt(maxPrice))
    setFiltered(result)
  }, [search, location, propertyType, bedrooms, maxPrice, properties])

  const resetFilters = () => {
    setSearch('')
    setLocation('All Locations')
    setPropertyType('All Types')
    setBedrooms('Any')
    setMaxPrice('')
  }

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ background: '#1a1a2e', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '8px' }}>🏠</div>
        <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>
          Rentals in Thailand
        </h1>
        <p style={{ color: '#ccc', fontSize: '16px', marginBottom: '24px' }}>
          Find your perfect home in Thailand — condos, houses, villas & more
        </p>
        <div style={{ display: 'flex', gap: '0', maxWidth: '500px', margin: '0 auto' }}>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by title or area..."
            style={{ flex: 1, padding: '14px 16px', fontSize: '15px', border: 'none', borderRadius: '8px 0 0 8px', outline: 'none' }} />
          <button style={{ background: '#E85D26', color: 'white', padding: '14px 24px', border: 'none', borderRadius: '0 8px 8px 0', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
            Search
          </button>
        </div>
      </section>

      {/* RENTAL MEMBER CTA */}
      <div style={{ background: '#fff3ed', borderBottom: '2px solid #E85D26', padding: '12px 24px', textAlign: 'center' }}>
        <span style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '14px' }}>🏠 Have a property to rent? </span>
        <Link href="/contact" style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '14px', textDecoration: 'underline' }}>
  Contact us to list your property →
</Link>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>

          {/* SIDEBAR FILTERS */}
          <div style={{ width: '240px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '12px' }}>Location</h3>
              <select value={location} onChange={e => setLocation(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', background: 'white', outline: 'none' }}>
                {thaiProvinces.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '12px' }}>Property Type</h3>
              <select value={propertyType} onChange={e => setPropertyType(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', background: 'white', outline: 'none' }}>
                {propertyTypes.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '12px' }}>Bedrooms</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {bedroomOptions.map(opt => (
                  <button key={opt} onClick={() => setBedrooms(opt)}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid', borderColor: bedrooms === opt ? '#E85D26' : '#ddd', background: bedrooms === opt ? '#fff3ed' : 'white', color: bedrooms === opt ? '#E85D26' : '#555', cursor: 'pointer', fontSize: '13px', fontWeight: bedrooms === opt ? 'bold' : 'normal' }}>
                    {opt === '0' ? 'Studio' : opt}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '12px' }}>Max Price (THB/month)</h3>
              <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                placeholder="e.g. 20000"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <button onClick={resetFilters}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontSize: '14px', color: '#666' }}>
              Reset Filters
            </button>
          </div>

          {/* LISTINGS */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>{filtered.length} properties available</p>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>Loading properties...</div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', color: '#666' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
                <p style={{ marginBottom: '12px' }}>No properties match your filters</p>
                <button onClick={resetFilters} style={{ color: '#E85D26', background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
                  Clear filters →
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {filtered.map((property: any) => {
                  const firstImage = property.property_images?.[0]?.url
                  return (
                    <Link href={`/rentals/${property.id}`} key={property.id} style={{ textDecoration: 'none' }}>
                      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: property.featured ? '2px solid #E85D26' : '1px solid #eee', cursor: 'pointer', height: '100%' }}>
                        {/* IMAGE */}
                        <div style={{ height: '180px', background: firstImage ? 'transparent' : '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                          {firstImage ? (
                            <img src={firstImage} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ fontSize: '48px' }}>🏠</div>
                          )}
                          {property.featured && (
                            <div style={{ position: 'absolute', top: '8px', left: '8px', background: '#E85D26', color: 'white', fontSize: '11px', padding: '3px 8px', borderRadius: '20px', fontWeight: 'bold' }}>
                              ⭐ Featured
                            </div>
                          )}
                          <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '12px', padding: '3px 8px', borderRadius: '6px' }}>
                            {property.property_type}
                          </div>
                        </div>

                        {/* DETAILS */}
                        <div style={{ padding: '16px' }}>
                          <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '4px', lineHeight: '1.3' }}>{property.title}</h3>
                          <p style={{ color: '#666', fontSize: '13px', marginBottom: '10px' }}>📍 {property.area ? `${property.area}, ` : ''}{property.location}</p>
                          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', fontSize: '13px', color: '#555' }}>
                            {property.bedrooms > 0 && <span>🛏 {property.bedrooms} bed</span>}
                            {property.bedrooms === 0 && <span>🛏 Studio</span>}
                            <span>🚿 {property.bathrooms} bath</span>
                            {property.size_sqm && <span>📐 {property.size_sqm}m²</span>}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ color: '#E85D26', fontWeight: 'bold', fontSize: '17px' }}>
                              ฿{property.price.toLocaleString()}<span style={{ fontSize: '12px', color: '#999', fontWeight: 'normal' }}>/mo</span>
                            </div>
                            <span style={{ background: '#f0f0f0', color: '#555', fontSize: '11px', padding: '3px 8px', borderRadius: '20px' }}>
                              {property.furnished}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}