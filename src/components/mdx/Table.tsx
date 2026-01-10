import { useRef, useEffect, type ComponentProps } from 'react'

export function Table({ children, ...props }: ComponentProps<'table'>) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const handleScroll = () => {
      if (scroller.scrollLeft > 0) {
        scroller.classList.add('is-scrolled')
      } else {
        scroller.classList.remove('is-scrolled')
      }
    }

    scroller.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => scroller.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="mdx-table-scroller w-full max-w-full min-w-0 my-6 overflow-hidden">
      <div
        ref={scrollerRef}
        className="overflow-x-auto"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <table {...props}>
          {children}
        </table>
      </div>
    </div>
  )
}
