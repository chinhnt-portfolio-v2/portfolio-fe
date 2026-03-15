import { Nav } from '@/components/layout/Nav'
import { SkipLinks } from '@/components/layout/SkipLinks'
import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'
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
        <Contact />
      </main>
    </>
  )
}
