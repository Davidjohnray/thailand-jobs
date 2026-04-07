'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { supabase } from '../../../src/lib/supabase'

export default function BlogPostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('blog_posts').select('*').eq('slug', slug).eq('is_published', true).single()
      .then(({ data }: { data: any }) => {
        setPost(data)
        setLoading(false)
      })
  }, [slug])

  if (loading) return <div style={{ fontFamily: 'sans-serif', padding: '80px', textAlign: 'center', color: '#888' }}>Loading...</div>
  if (!post) return (
    <div style={{ fontFamily: 'sans-serif', padding: '80px', textAlign: 'center' }}>
      <h2>Article not found</h2>
      <Link href="/blog" style={{ color: '#2D6BE4' }}>← Back to Blog</Link>
    </div>
  )

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>

      {post.cover_image_url && (
        <div style={{ width: '100%', height: '400px', overflow: 'hidden' }}>
          <img src={post.cover_image_url} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px' }}>

        <Link href="/blog" style={{ color: '#2D6BE4', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>← Back to Blog</Link>

        <div style={{ marginTop: '24px', marginBottom: '8px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          {post.category && (
            <span style={{ background: '#f0f4ff', color: '#2D6BE4', fontSize: '12px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '20px', textTransform: 'capitalize' }}>{post.category}</span>
          )}
          <span style={{ color: '#aaa', fontSize: '13px' }}>
            {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>

        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1a1a2e', margin: '12px 0 8px', lineHeight: '1.2' }}>{post.title}</h1>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '36px' }}>By {post.author}</p>

        <div style={{ background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', lineHeight: '1.8', fontSize: '16px', color: '#333' }}>
          {post.content?.split('\n').map((para: string, i: number) => (
            para.trim() ? <p key={i} style={{ marginBottom: '16px' }}>{para}</p> : <br key={i} />
          ))}
        </div>

        <div style={{ marginTop: '40px', padding: '24px', background: 'white', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <p style={{ color: '#666', marginBottom: '12px', fontSize: '15px' }}>Looking for teaching jobs or ESL resources in Thailand?</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/jobs" style={{ background: '#1a1a2e', color: 'white', padding: '10px 22px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Browse Jobs</Link>
            <Link href="/esl-resources" style={{ background: '#2D6BE4', color: 'white', padding: '10px 22px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>ESL Resources</Link>
          </div>
        </div>
      </div>
    </main>
  )
}