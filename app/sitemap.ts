import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  // Fetch all active jobs
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, created_at, updated_at')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1000)

  // Fetch all published blog posts
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at, created_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  // Fetch all active approved teacher profiles
  const { data: teachers } = await supabase
    .from('teachers')
    .select('slug, updated_at, created_at')
    .eq('active', true)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  const jobUrls: MetadataRoute.Sitemap = (jobs || []).map(job => ({
    url: `https://www.jobsinthailand.net/jobs/${job.id}`,
    lastModified: new Date(job.updated_at || job.created_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const blogUrls: MetadataRoute.Sitemap = (posts || []).map(post => ({
    url: `https://www.jobsinthailand.net/blog/${post.slug}`,
    lastModified: new Date(post.updated_at || post.created_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const teacherUrls: MetadataRoute.Sitemap = (teachers || []).map(teacher => ({
    url: `https://www.jobsinthailand.net/teachers/${teacher.slug}`,
    lastModified: new Date(teacher.updated_at || teacher.created_at),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [
    // Static pages
    { url: 'https://www.jobsinthailand.net', changeFrequency: 'daily', priority: 1 },
    { url: 'https://www.jobsinthailand.net/jobs', changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://www.jobsinthailand.net/teachers', changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://www.jobsinthailand.net/blog', changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://www.jobsinthailand.net/tefl', changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://www.jobsinthailand.net/esl-resources', changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://www.jobsinthailand.net/esl-resources/under-5s', changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://www.jobsinthailand.net/esl-resources/ages-5-6', changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://www.jobsinthailand.net/esl-resources/ages-7-10', changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://www.jobsinthailand.net/esl-resources/ages-11-plus', changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://www.jobsinthailand.net/esl-games', changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://www.jobsinthailand.net/esl-games/live', changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://www.jobsinthailand.net/cv-builder', changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://www.jobsinthailand.net/sponsors/duke-language', changeFrequency: 'monthly', priority: 0.6 },
    // Dynamic pages
    ...jobUrls,
    ...blogUrls,
    ...teacherUrls,
  ]
}