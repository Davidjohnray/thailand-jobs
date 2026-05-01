import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://www.jobsinthailand.net', changeFrequency: 'daily', priority: 1 },
    { url: 'https://www.jobsinthailand.net/jobs', changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://www.jobsinthailand.net/esl-resources', changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://www.jobsinthailand.net/esl-resources/under-5s', changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://www.jobsinthailand.net/esl-resources/ages-5-6', changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://www.jobsinthailand.net/esl-resources/ages-7-10', changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://www.jobsinthailand.net/esl-resources/ages-11-plus', changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://www.jobsinthailand.net/esl-games', changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://www.jobsinthailand.net/esl-games/live', changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://www.jobsinthailand.net/cv-builder', changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://www.jobsinthailand.net/teacher-profile', changeFrequency: 'weekly', priority: 0.6 },
    { url: 'https://www.jobsinthailand.net/blog', changeFrequency: 'weekly', priority: 0.6 },
  ]
}