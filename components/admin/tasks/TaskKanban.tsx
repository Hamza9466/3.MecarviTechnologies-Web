"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Task, TaskStatus } from "./types";
import TaskCard from "./TaskCard";

interface TaskKanbanProps {
  tasks: Task[];
  onTaskUpdate: (taskId: number, status: TaskStatus) => void;
  onTaskClick: (task: Task) => void;
  onTaskEdit: (task: Task) => void;
}

const columns: { id: TaskStatus; title: string; color: string }[] = [
  { id: "todo", title: "To Do", color: "bg-gray-50 border-gray-200" },
  { id: "in_progress", title: "In Progress", color: "bg-blue-50 border-blue-200" },
  { id: "review", title: "Review", color: "bg-yellow-50 border-yellow-200" },
  { id: "done", title: "Done", color: "bg-green-50 border-green-200" },
];

export default function TaskKanban({
  tasks,
  onTaskUpdate,
  onTaskClick,
  onTaskEdit,
}: TaskKanbanProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  // Sync localTasks with tasks prop when it changes
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const tasksByStatus: Record<TaskStatus, Task[]> = {
    new: localTasks.filter((t) => t.status === "new"),
    todo: localTasks.filter((t) => t.status === "todo"),
    in_progress: localTasks.filter((t) => t.status === "in_progress"),
    review: localTasks.filter((t) => t.status === "review"),
    done: localTasks.filter((t) => t.status === "done"),
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = localTasks.find((t) => t.id.toString() === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = parseInt(active.id as string);
    const newStatus = over.id as TaskStatus;

    const task = localTasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    // Update local state optimistically
    const updatedTasks = localTasks.map((t) =>
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    setLocalTasks(updatedTasks);

    // Call the update handler
    onTaskUpdate(taskId, newStatus);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`rounded-lg border-2 ${column.color} p-4 min-h-[500px]`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{column.title}</h2>
              <span className="bg-white text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                {tasksByStatus[column.id].length}
              </span>
            </div>
            <SortableContext
              items={tasksByStatus[column.id].map((t) => t.id.toString())}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {tasksByStatus[column.id].map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => onTaskClick(task)}
                    onEdit={() => onTaskEdit(task)}
                  />
                ))}
                {tasksByStatus[column.id].length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No tasks
                  </div>
                )}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="opacity-50">
            <TaskCard task={activeTask} onClick={() => { }} onEdit={() => { }} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

