import React, { useEffect, useState } from "react"
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash, Edit, Plus, GripVertical } from "lucide-react"

type Task = {
    id: string
    title: string
    notes?: string
    done: boolean
    createdAt: number
}

const STORAGE_KEY = "task_manager_tasks_v1"

function uid() {
    return Math.random().toString(36).slice(2, 9)
}

function SortableTaskItem({
    task,
    index,
    onToggle,
    onEdit,
    onDelete,
}: {
    task: Task
    index: number
    onToggle: (id: string) => void
    onEdit: (t: Task) => void
    onDelete: (id: string) => void
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: task.id })

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
    }

    return (
        <li
            ref={setNodeRef}
            style={style}
            className={`flex items-start gap-3 p-3 rounded-md border bg-card`}
        >
            <div
                {...attributes}
                {...listeners}
                className="flex items-center px-1 text-muted-foreground cursor-grab"
                title="Arrastar para reordenar"
            >
                <GripVertical className="h-4 w-4" />
            </div>

            <Checkbox checked={task.done} onCheckedChange={() => onToggle(task.id)} />

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <div
                        className={`font-medium truncate ${task.done ? "line-through text-muted-foreground" : ""
                            }`}
                    >
                        {task.title}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            className="p-1 rounded hover:bg-accent/10"
                            onClick={() => onEdit(task)}
                            aria-label="Editar tarefa"
                        >
                            <Edit className="h-4 w-4" />
                        </button>
                        <button
                            className="p-1 rounded hover:bg-destructive/10"
                            onClick={() => onDelete(task.id)}
                            aria-label="Deletar tarefa"
                        >
                            <Trash className="h-4 w-4 text-destructive" />
                        </button>
                    </div>
                </div>
                {task.notes && (
                    <div className="text-sm text-muted-foreground truncate">{task.notes}</div>
                )}
            </div>
        </li>
    )
}

export function TaskManager() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [title, setTitle] = useState("")
    const [notes, setNotes] = useState("")
    const [editingId, setEditingId] = useState<string | null>(null)

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw) setTasks(JSON.parse(raw))
        } catch (e) {
            // ignore
        }
    }, [])

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    }, [tasks])

    function addOrUpdateTask() {
        const trimmed = title.trim()
        if (!trimmed) return
        if (editingId) {
            setTasks((t) =>
                t.map((task) =>
                    task.id === editingId ? { ...task, title: trimmed, notes } : task
                )
            )
            setEditingId(null)
        } else {
            const newTask: Task = {
                id: uid(),
                title: trimmed,
                notes: notes.trim() || undefined,
                done: false,
                createdAt: Date.now(),
            }
            setTasks((t) => [newTask, ...t])
        }
        setTitle("")
        setNotes("")
    }

    function removeTask(id: string) {
        setTasks((t) => t.filter((x) => x.id !== id))
    }

    function toggleDone(id: string) {
        setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)))
    }

    function startEdit(task: Task) {
        setEditingId(task.id)
        setTitle(task.title)
        setNotes(task.notes || "")
    }

    const sensors = useSensors(useSensor(PointerSensor))

    return (
        <Card className="w-[min(640px,90vw)] p-4">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Tarefas</h2>
                <div className="text-sm text-muted-foreground">
                    {tasks.filter((t) => !t.done).length} restantes
                </div>
            </div>

            <div className="grid gap-2 mb-4">
                <Input
                    placeholder="Titulo da nova tarefa"
                    value={title}
                    onChange={(e) => setTitle(e.currentTarget.value)}
                />
                <Input
                    placeholder="Notas (opcional)"
                    value={notes}
                    onChange={(e) => setNotes(e.currentTarget.value)}
                />
                <div className="flex gap-2">
                    <Button onClick={addOrUpdateTask} variant="default">
                        <Plus className="mr-2 h-4 w-4" /> {editingId ? "Salvar" : "Adicionar Tarefa"}
                    </Button>
                    {editingId && (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setEditingId(null)
                                setTitle("")
                                setNotes("")
                            }}
                        >
                            Cancelar
                        </Button>
                    )}
                </div>
            </div>

            <div>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(event) => {
                        const { active, over } = event
                        if (!over) return
                        if (active.id !== over.id) {
                            const oldIndex = tasks.findIndex((t) => t.id === active.id)
                            const newIndex = tasks.findIndex((t) => t.id === over.id)
                            setTasks((items) => arrayMove(items, oldIndex, newIndex))
                        }
                    }}
                >
                    <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                        <ul className="space-y-2">
                            {tasks.map((task, idx) => (
                                <SortableTaskItem
                                    key={task.id}
                                    task={task}
                                    index={idx}
                                    onToggle={toggleDone}
                                    onEdit={startEdit}
                                    onDelete={removeTask}
                                />
                            ))}
                        </ul>
                    </SortableContext>
                </DndContext>

                {tasks.length === 0 && (
                    <div className="text-sm text-muted-foreground mt-2">Nenhuma tarefa encontrada.</div>
                )}
            </div>
        </Card>
    )
}
