'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../src/lib/supabase'

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    supabase.from('blog_posts').select('*').eq('is_published', true)
      .order('created_at', { ascending: false })
      .then(({ data }: { data: any }) => {
        setPosts(data || [])
        setLoading(false)
      })
  }, [])

  const categories = ['all', ...Array.from(new Set(posts.map((p: any) => p.category)))]
  const filtered = activeCategory === 'all' ? posts : posts.filter((p: any) => p.category === activeCategory)

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>

      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)', padding: '64px 24px', color: 'white', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✍️</div>
        <h1 style={{ fontSize: '40px', fontWeight: 'bold', margin: '0 0 12px' }}>Blog</h1>
        <p style={{ opacity: 0.8, fontSize: '18px', maxWidth: '560px', margin: '0 auto' }}>
          Tips, guides, and insights for teachers and expats in Thailand
        </p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>

        {/* CATEGORY FILTERS */}
        {categories.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{ padding: '8px 18px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', textTransform: 'capitalize', background: activeCategory === cat ? '#1a1a2e' : 'white', color: activeCategory === cat ? 'white' : '#666', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>Loading articles...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
            <p style={{ fontSize: '18px' }}>No articles yet — check back soon!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '24px' }}>
            {filtered.map((post: any) => (
              <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', display: 'flex', gap: '0', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)' }}>
                  {post.cover_image_url && (
                    <div style={{ width: '240px', flexShrink: 0 }}>
                      <img src={post.cover_image_url} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ padding: '28px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      {post.category && (
                        <span style={{ background: '#f0f4ff', color: '#2D6BE4', fontSize: '12px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '20px', textTransform: 'capitalize' }}>{post.category}</span>
                      )}
                      <span style={{ color: '#aaa', fontSize: '12px' }}>
                        {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 10px', lineHeight: '1.3' }}>{post.title}</h2>
                    {post.excerpt && <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', margin: '0 0 16px' }}>{post.excerpt}</p>}
                    <span style={{ color: '#2D6BE4', fontSize: '13px', fontWeight: 'bold' }}>Read more →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}