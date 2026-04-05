import { getAllSuburbSlugs, getSuburbBySlug } from '@/lib/payload'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  try {
    return await getAllSuburbSlugs()
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ suburb: string }> }) {
  const { suburb } = await params
  const doc = await getSuburbBySlug(suburb)
  if (!doc) return {}
  return {
    title: doc.metaTitle,
    description: doc.metaDescription,
  }
}

export default async function SuburbPage({ params }: { params: Promise<{ suburb: string }> }) {
  const { suburb } = await params
  const doc = await getSuburbBySlug(suburb)
  if (!doc) notFound()

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{doc.title}</h1>

      {doc.featuredImage?.url && (
        <img
          src={`http://31.97.148.228:3001${doc.featuredImage.url}`}
          alt={doc.featuredImage.alt || doc.title}
          className="w-full rounded-lg mb-8"
          width={1792}
          height={1024}
        />
      )}

      <p className="text-lg mb-8 leading-relaxed">{doc.intro}</p>

      <div className="prose max-w-none mb-8 whitespace-pre-wrap leading-relaxed">
        {doc.bodyContent}
      </div>

      {doc.faqItems?.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          {doc.faqItems.map((faq: any, i: number) => (
            <div key={i} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          ))}
        </section>
      )}

      <div className="mt-10 p-6 bg-amber-50 rounded-lg text-center">
        <h2 className="text-xl font-bold mb-2">Ready to Book?</h2>
        <p className="mb-4">Call us at <a href="tel:9166928874" className="font-bold">(916) 692-8874</a></p>
        
          href="https://therichgroomer.com/book-online/"
          className="bg-amber-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-amber-600"
        >
          Book Online
        </a>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: doc.faqItems?.map((faq: any) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer }
            }))
          })
        }}
      />
    </main>
  )
}
