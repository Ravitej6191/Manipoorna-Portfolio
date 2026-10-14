import { useEffect } from 'react'

// Adds `is-in` to every `.reveal` inside the container as it scrolls into view. `scrollRoot` is the
// scrolling element for overlays; leave it null for the page itself.
export default function useReveal(containerRef, scrollRoot = null, deps = []) {
  useEffect(() => {
    const els = containerRef.current ? containerRef.current.querySelectorAll('.reveal') : []
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }),
      { root: scrollRoot && scrollRoot.current ? scrollRoot.current : null, threshold: 0.14, rootMargin: '0px 0px -6% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
