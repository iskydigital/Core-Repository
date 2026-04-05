const PAYLOAD_URL = 'http://31.97.148.228:3001'

export async function getAllSuburbSlugs() {
  const res = await fetch(`${PAYLOAD_URL}/api/suburb-content?limit=100&where[status][equals]=published`, {
    next: { revalidate: 3600 }
  })
  const data = await res.json()
  return data.docs.map((doc: any) => ({ suburb: doc.slug }))
}

export async function getSuburbBySlug(slug: string) {
  const res = await fetch(`${PAYLOAD_URL}/api/suburb-content?where[slug][equals]=${slug}&limit=1`, {
    next: { revalidate: 3600 }
  })
  const data = await res.json()
  return data.docs[0] || null
}

export async function getAllSuburbs() {
  const res = await fetch(`${PAYLOAD_URL}/api/suburb-content?limit=100&where[status][equals]=published`, {
    next: { revalidate: 3600 }
  })
  const data = await res.json()
  return data.docs
}
