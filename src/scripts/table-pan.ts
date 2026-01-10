// Horizontal drag-to-scroll for tables on mobile
// Uses pointer events with intent detection to allow vertical page scroll

function isInteractive(el: EventTarget | null): boolean {
  if (!(el instanceof Element)) return false
  return !!el.closest?.('a, button, input, textarea, select, summary, [role="button"], [role="link"]')
}

export function enableTableHorizontalDrag() {
  const mq = window.matchMedia('(pointer: coarse) and (max-width: 768px)')
  if (!mq.matches) return

  const scrollers = document.querySelectorAll<HTMLElement>('[data-slot="table-container"]')

  scrollers.forEach((scroller) => {
    let startX = 0
    let startY = 0
    let startLeft = 0
    let locked: 'h' | 'v' | null = null
    let activePointerId: number | null = null

    scroller.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'touch') return
      if (isInteractive(e.target)) return

      activePointerId = e.pointerId
      locked = null
      startX = e.clientX
      startY = e.clientY
      startLeft = scroller.scrollLeft

      // Keep receiving events even if finger moves off element
      scroller.setPointerCapture(activePointerId)
    })

    scroller.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'touch') return
      if (activePointerId !== e.pointerId) return

      const dx = e.clientX - startX
      const dy = e.clientY - startY

      // Decide lock once movement is meaningful
      const THRESHOLD = 8

      if (!locked) {
        if (Math.abs(dx) < THRESHOLD && Math.abs(dy) < THRESHOLD) return
        locked = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v'
      }

      if (locked === 'v') {
        // Let the browser/page handle vertical scroll
        return
      }

      // Horizontal drag: prevent browser from trying to interpret gesture
      e.preventDefault()

      const maxLeft = scroller.scrollWidth - scroller.clientWidth
      const nextLeft = startLeft - dx

      // Clamp to avoid iOS rubber-banding / scroll chaining
      scroller.scrollLeft = Math.max(0, Math.min(maxLeft, nextLeft))
    }, { passive: false })

    const end = (e: PointerEvent) => {
      if (activePointerId !== e.pointerId) return
      activePointerId = null
      locked = null
      try { scroller.releasePointerCapture(e.pointerId) } catch {}
    }

    scroller.addEventListener('pointerup', end)
    scroller.addEventListener('pointercancel', end)
  })
}