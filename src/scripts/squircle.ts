import { getSvgPath } from 'figma-squircle'

export function initSquircleCurves() {
  if (typeof window === 'undefined') return

  const getRadii = (type: 'side' | 'straight' | 'btn') => {
    const w = window.innerWidth
    const isMobile = w < 640
    const isTablet = w >= 640 && w < 960
    const isLarge = w >= 2200 && w < 3000
    const is4K = w >= 3000

    if (type === 'side') {
      const rAnchor = isMobile ? 8 : isTablet ? 10 : isLarge ? 14 : is4K ? 16 : 12
      const rScoop = isMobile ? 36 : isTablet ? 48 : isLarge ? 68 : is4K ? 80 : 56
      return {
        topLeftCornerRadius: rAnchor,
        topRightCornerRadius: rAnchor,
        bottomRightCornerRadius: rScoop,
        bottomLeftCornerRadius: rAnchor,
      }
    } else if (type === 'btn') {
      const r = isMobile ? 4 : isTablet ? 6 : isLarge ? 10 : is4K ? 12 : 8
      return {
        topLeftCornerRadius: r,
        topRightCornerRadius: r,
        bottomRightCornerRadius: r,
        bottomLeftCornerRadius: r,
      }
    } else {
      const r = isMobile ? 8 : isTablet ? 10 : isLarge ? 16 : is4K ? 20 : 12
      return {
        topLeftCornerRadius: r,
        topRightCornerRadius: r,
        bottomRightCornerRadius: r,
        bottomLeftCornerRadius: r,
      }
    }
  }

  const updateElement = (el: HTMLElement) => {
    // Use layout dimensions so 3D transformed faces (e.g. rotated -90deg) get their full dimensions
    const width = el.offsetWidth || Math.round(el.getBoundingClientRect().width)
    const height = el.offsetHeight || Math.round(el.getBoundingClientRect().height)
    if (!width || !height) return

    const type = (el.dataset.curve || (el.classList.contains('curve-side') ? 'side' : el.classList.contains('curve-btn') ? 'btn' : 'straight')) as 'side' | 'straight' | 'btn'
    const radii = getRadii(type)

    try {
      const path = getSvgPath({
        width,
        height,
        cornerSmoothing: 0.6, // Exact 60% Figma Corner Smoothing
        preserveSmoothing: true,
        ...radii,
      })
      if (path) {
        el.style.clipPath = `path('${path}')`
        ;(el.style as any).webkitClipPath = `path('${path}')`
      }
    } catch (e) {
      // Fallback relies on CSS border-radius
    }
  }

  const updateAll = () => {
    const elements = document.querySelectorAll<HTMLElement>('.curve-side, .curve-straight, .curve-btn, [data-curve]')
    elements.forEach(updateElement)
  }

  // Update on initial call
  updateAll()

  // Use ResizeObserver on elements
  const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
      updateElement(entry.target as HTMLElement)
    }
  })

  const observed = new Set<HTMLElement>()
  const registerElements = () => {
    const elements = document.querySelectorAll<HTMLElement>('.curve-side, .curve-straight, .curve-btn, [data-curve]')
    elements.forEach((el) => {
      if (!observed.has(el)) {
        observed.add(el)
        ro.observe(el)
      }
      updateElement(el)
    })
  }

  registerElements()

  // Observe DOM additions
  if (typeof MutationObserver !== 'undefined' && document.body) {
    const mo = new MutationObserver(() => {
      registerElements()
    })
    mo.observe(document.body, { childList: true, subtree: true })
  }

  window.addEventListener('resize', updateAll, { passive: true })
}
