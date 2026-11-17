// Ensure content is always 100% visible on load, navigation, and bfcache restore
function ensureVisible() {
  const elements = document.querySelectorAll<HTMLElement>(
    'main, #page-content, body > div.relative.w-full.min-h-screen',
  )
  elements.forEach((el) => {
    el.style.opacity = '1'
    el.style.visibility = 'visible'
    el.style.transform = 'none'
  })
}

window.addEventListener('pageshow', ensureVisible)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ensureVisible)
} else {
  ensureVisible()
}

// Close open menu drawers when a navigation link is clicked
document.addEventListener('click', (event) => {
  const target = event.target
  if (!(target instanceof Element)) return
  const link = target.closest<HTMLAnchorElement>('a[href]')
  if (!link) return

  const deskDrawer = document.getElementById('desk-drawer')
  const mobDrawer = document.getElementById('mob-drawer')
  const deskBackdrop = document.getElementById('desk-backdrop')
  const mobBackdrop = document.getElementById('mob-backdrop')

  if (deskDrawer) {
    deskDrawer.classList.add('opacity-0', 'pointer-events-none')
    deskDrawer.classList.remove('opacity-100', 'pointer-events-auto')
  }
  if (deskBackdrop) {
    deskBackdrop.classList.add('opacity-0', 'pointer-events-none')
    deskBackdrop.classList.remove('opacity-100', 'pointer-events-auto')
  }
  if (mobDrawer) {
    mobDrawer.classList.add('opacity-0', 'pointer-events-none')
    mobDrawer.classList.remove('opacity-100', 'pointer-events-auto')
  }
  if (mobBackdrop) {
    mobBackdrop.classList.add('opacity-0', 'pointer-events-none')
    mobBackdrop.classList.remove('opacity-100', 'pointer-events-auto')
  }
})
