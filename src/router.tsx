import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import NotFound from './components/NotFound'
import ErrorComponent from './components/Error'

export function getRouter() {
    const router = createTanStackRouter({
        defaultNotFoundComponent: () => <NotFound />,
        defaultErrorComponent: ({ error, reset }) => <ErrorComponent error={error} reset={reset} />,
        routeTree,
        scrollRestoration: true,
        defaultPreload: 'intent',
        defaultPreloadStaleTime: 0,
    })

    return router
}

declare module '@tanstack/react-router' {
    interface Register {
        router: ReturnType<typeof getRouter>
    }
}
