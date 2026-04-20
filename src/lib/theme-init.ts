export function initTheme() {
    if (typeof window === 'undefined') {
        return
    }

    const stored = localStorage.getItem('theme')
    const mode =
        stored === 'light' || stored === 'dark' || stored === 'auto'
            ? stored
            : 'auto'

    const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
    ).matches
    const resolved = mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode

    document.documentElement.classList.add(resolved)
    document.documentElement.style.colorScheme = resolved

    if (mode !== 'auto') {
        document.documentElement.setAttribute('data-theme', mode)
    }
}

initTheme()
