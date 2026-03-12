import { Nav } from '@/components/layout/Nav'
import { SkipLinks } from '@/components/layout/SkipLinks'
import { About } from '@/components/sections/About'
import { Hero } from '@/components/sections/Hero'
import { Projects } from '@/components/sections/Projects'

export default function HomePage() {
  return (
    <>
      <SkipLinks />
      <Nav />
      <main id="main-content">
        <Hero />
        <Projects />
        <About />
        {/* Contact section — Story 4.1 */}
        <section id="contact" aria-label="Contact" className="section-container py-24">
          <p className="text-muted-foreground">Contact section (Story 4.1)</p>
        </section>
      </main>
    </>
  )
}
