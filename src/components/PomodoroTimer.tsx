'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RotateCcw, SkipForward } from 'lucide-react'
import { cn } from '@/lib/utils'

type Mode = 'foco' | 'pausa-curta' | 'pausa-longa'

const MODES: Record<Mode, { label: string; duration: number; color: string }> =
  {
    foco: { label: 'Foco', duration: 25 * 60, color: 'text-primary' },
    'pausa-curta': {
      label: 'Pausa Curta',
      duration: 5 * 60,
      color: 'text-accent',
    },
    'pausa-longa': {
      label: 'Pausa Longa',
      duration: 15 * 60,
      color: 'text-accent',
    },
  }

function TomatoIcon({
  className,
  pulsing,
}: {
  className?: string
  pulsing?: boolean
}) {
  return (
    <svg
      viewBox="0 0 120 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        'transition-transform',
        pulsing && 'animate-bounce',
        className,
      )}
      aria-hidden="true"
    >
      {/* Folhas / caule */}
      <path
        d="M60 28 C55 16, 38 12, 34 22 C30 32, 44 36, 52 32"
        stroke="#4a7c4e"
        strokeWidth="3"
        fill="#5a9e5f"
        strokeLinecap="round"
      />
      <path
        d="M60 28 C65 16, 82 12, 86 22 C90 32, 76 36, 68 32"
        stroke="#4a7c4e"
        strokeWidth="3"
        fill="#5a9e5f"
        strokeLinecap="round"
      />
      <path
        d="M60 28 C60 10, 52 4, 46 8 C40 12, 46 24, 54 26"
        stroke="#4a7c4e"
        strokeWidth="3"
        fill="#6db575"
        strokeLinecap="round"
      />
      {/* Caule */}
      <path
        d="M60 28 L60 38"
        stroke="#4a7c4e"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Corpo do tomate */}
      <ellipse cx="60" cy="80" rx="46" ry="44" fill="#c0392b" />
      {/* Highlight */}
      <ellipse
        cx="44"
        cy="62"
        rx="10"
        ry="7"
        fill="rgba(255,255,255,0.18)"
        transform="rotate(-20 44 62)"
      />
      {/* Sombra inferior */}
      <ellipse cx="60" cy="118" rx="36" ry="6" fill="rgba(0,0,0,0.08)" />
      {/* Costela do tomate */}
      <path
        d="M60 40 Q72 55 70 80 Q68 105 60 118"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M60 40 Q48 55 50 80 Q52 105 60 118"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function PomodoroTimer() {
  const [mode, setMode] = useState<Mode>('foco')
  const [timeLeft, setTimeLeft] = useState(MODES['foco'].duration)
  const [running, setRunning] = useState(false)
  const [completed, setCompleted] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const total = MODES[mode].duration
  const progress = ((total - timeLeft) / total) * 100

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const handleFinish = useCallback(() => {
    clearTimer()
    setRunning(false)
    if (mode === 'foco') {
      setCompleted((c) => c + 1)
    }
  }, [clearTimer, mode])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            handleFinish()
            return 0
          }
          return t - 1
        })
      }, 1000)
    } else {
      clearTimer()
    }
    return clearTimer
  }, [running, handleFinish, clearTimer])

  const handleModeChange = (m: Mode) => {
    clearTimer()
    setRunning(false)
    setMode(m)
    setTimeLeft(MODES[m].duration)
  }

  const handleReset = () => {
    clearTimer()
    setRunning(false)
    setTimeLeft(MODES[mode].duration)
  }

  const handleSkip = () => {
    clearTimer()
    setRunning(false)
    if (mode === 'foco') {
      setCompleted((c) => c + 1)
    }
    setTimeLeft(0)
  }

  const radius = 110
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm px-4">
      <div className="flex gap-2 bg-secondary rounded-full p-1 shadow-sm">
        {(Object.keys(MODES) as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer',
              mode === m
                ? 'bg-primary text-primary-foreground shadow'
                : 'text-muted-foreground hover:text-foreground',
            )}
            aria-pressed={mode === m}
          >
            {MODES[m].label}
          </button>
        ))}
      </div>

      {/* Timer Ring + Tomato */}
      <div className="relative flex items-center justify-center">
        {/* SVG Ring Progress */}
        <svg
          width="280"
          height="280"
          viewBox="0 0 280 280"
          className="-rotate-90"
          aria-hidden="true"
        >
          {/* Track */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="10"
          />
          {/* Progress */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>

        <div className="absolute flex flex-col items-center gap-1 select-none">
          <TomatoIcon
            className="w-20 h-20"
            pulsing={running && timeLeft <= 5 && timeLeft > 0}
          />
          <span
            className="text-5xl font-mono font-bold text-foreground tracking-tight leading-none"
            aria-live="polite"
            aria-label={`Tempo restante: ${formatTime(timeLeft)}`}
          >
            {formatTime(timeLeft)}
          </span>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-0.5">
            {MODES[mode].label}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handleReset}
          aria-label="Reiniciar timer"
          className="rounded-full border-border text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        <Button
          size="lg"
          onClick={() => setRunning((r) => !r)}
          className={cn(
            'rounded-full px-10 text-base font-semibold shadow-md transition-all',
            running
              ? 'bg-secondary text-foreground border border-border hover:bg-muted'
              : 'bg-primary text-primary-foreground hover:opacity-90',
          )}
          aria-label={running ? 'Pausar timer' : 'Iniciar timer'}
        >
          {running ? 'Pausar' : 'Iniciar'}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handleSkip}
          aria-label="Pular sessão"
          className="rounded-full border-border text-muted-foreground hover:text-foreground"
        >
          <SkipForward className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
          Pomodoros concluídos
        </p>
        <div className="flex gap-2 flex-wrap justify-center">
          {completed === 0 ? (
            <span className="text-sm text-muted-foreground italic">
              Nenhum ainda
            </span>
          ) : (
            Array.from({ length: completed }).map((_, i) => (
              <Badge
                key={i}
                className="w-8 h-8 rounded-full flex items-center justify-center p-0 text-base bg-primary text-primary-foreground shadow-sm"
                aria-label={`Pomodoro ${i + 1}`}
              >
                🍅
              </Badge>
            ))
          )}
        </div>
        {completed > 0 && (
          <button
            onClick={() => setCompleted(0)}
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors mt-1 cursor-pointer"
            aria-label="Zerar contador de pomodoros"
          >
            Zerar contador
          </button>
        )}
      </div>
    </div>
  )
}
