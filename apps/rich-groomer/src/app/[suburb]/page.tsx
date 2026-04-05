import { getAllSuburbSlugs, getSuburbBySlug } from '@/lib/payload'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return await getAllSuburbSlugs()
}

export async function generateMetadata({ params }: { params: { suburb: string } }) {
  const doc = await getSuburbBySlug(params.suburb)
  if (!doc) return {}
  return {
    title: doc.metaTitle,
    description: doc.metaDescription,
  }
}

export default async function SuburbPage({ params }: { params: { suburb: string } }) {
  const doc = await getSuburbBySlug(params.suburb)
  if (!doc) notFound()

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{doc.title}</h1>
      <p className="text-lg mb-8">{doc.intro}</p>
      <div className="prose max-w-none mb-8 whitespace-pre-wrap">{doc.bodyContent}</div>
      {doc.faqItems?.length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          {doc.faqItems.map((faq: any, i: number) => (
            <div key={i} className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </section>
      )}
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
