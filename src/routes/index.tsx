import { createFileRoute } from '@tanstack/react-router'
import { PomodoroTimer } from '@/components/PomodoroTimer'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 py-12">
      <header className="flex flex-col items-center gap-1 mb-4 text-center">
        <h1 className="text-3xl font-bold text-foreground tracking-tight text-balance">
          Pomodoro Timer
        </h1>
        <p className="text-sm text-muted-foreground text-pretty max-w-xs">
          Mantenha o foco, descanse bem e seja mais produtivo.
        </p>
      </header>

      <PomodoroTimer />
    </main>
  )
}
