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
import { useDroppable } from "@dnd-kit/core";
import { Task, TaskStatus } from "./types";
import TaskKanbanCard from "./TaskKanbanCard";

interface TaskKanbanBoardProps {
  tasks: Task[];
  onTaskUpdate: (taskId: number, status: TaskStatus) => void;
  onTaskClick: (task: Task) => void;
  onTaskEdit: (task: Task) => void;
}

const columns: Array<{
  id: TaskStatus;
  title: string;
  dotColor: string;
  textColor: string;
  buttonColor: string;
  headerColor: string;
  headerBgColor: string;
  buttonBorderColor: string;
}> = [
  {
    id: "new",
    title: "NEW",
    dotColor: "bg-purple-500",
    textColor: "text-purple-600",
    buttonColor: "bg-purple-500 hover:bg-purple-600",
    headerColor: "text-purple-600",
    headerBgColor: "bg-purple-50",
    buttonBorderColor: "border-purple-500",
  },
  {
    id: "todo",
    title: "TODO",
    dotColor: "bg-orange-500",
    textColor: "text-orange-600",
    buttonColor: "bg-orange-500 hover:bg-orange-600",
    headerColor: "text-orange-600",
    headerBgColor: "bg-orange-50",
    buttonBorderColor: "border-orange-500",
  },
  {
    id: "in_progress",
    title: "ON GOING",
    dotColor: "bg-blue-500",
    textColor: "text-blue-600",
    buttonColor: "bg-blue-500 hover:bg-blue-600",
    headerColor: "text-blue-600",
    headerBgColor: "bg-blue-50",
    buttonBorderColor: "border-blue-500",
  },
  {
    id: "review",
    title: "IN REVIEW",
    dotColor: "bg-yellow-500",
    textColor: "text-yellow-600",
    buttonColor: "bg-yellow-500 hover:bg-yellow-600",
    headerColor: "text-yellow-600",
    headerBgColor: "bg-yellow-50",
    buttonBorderColor: "border-yellow-500",
  },
  {
    id: "done",
    title: "COMPLETED",
    dotColor: "bg-green-500",
    textColor: "text-green-600",
    buttonColor: "bg-green-500 hover:bg-green-600",
    headerColor: "text-green-600",
    headerBgColor: "bg-green-50",
    buttonBorderColor: "border-green-500",
  },
];

export default function TaskKanbanBoard({
  tasks,
  onTaskUpdate,
  onTaskClick,
  onTaskEdit,
}: TaskKanbanBoardProps) {
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

  const tasksByStatus = {
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

  const handleAddTask = (status: TaskStatus) => {
    // Navigate to create task page with pre-selected status
    window.location.href = `/admin/tasks/create?status=${status}`;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .kanban-horizontal-scroll::-webkit-scrollbar {
            height: 8px;
          }
          .kanban-horizontal-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .kanban-horizontal-scroll::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
          }
          .kanban-horizontal-scroll::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
          .kanban-horizontal-scroll {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 transparent;
          }
          .kanban-vertical-scroll::-webkit-scrollbar {
            width: 8px;
          }
          .kanban-vertical-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .kanban-vertical-scroll::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
          }
          .kanban-vertical-scroll::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
          .kanban-vertical-scroll {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 transparent;
          }
        `
      }} />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-x-auto kanban-horizontal-scroll min-h-0">
          <div className="inline-flex gap-6 h-full min-w-max px-6 pb-12">
            {columns.map((column) => {
              const columnTasks = tasksByStatus[column.id];
              const { setNodeRef: setDroppableRef } = useDroppable({
                id: column.id,
              });
              
              return (
                <div key={column.id} className="flex flex-col h-full min-h-0 w-80 flex-shrink-0">
                  {/* Column Header */}
                  <div className={`${column.headerBgColor} px-4 py-3 rounded-t-lg flex items-center justify-between border-l border-r border-t border-gray-200 flex-shrink-0`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${column.dotColor}`}></div>
                      <h2 className="text-sm font-semibold text-gray-900">
                        {column.title} - {columnTasks.length.toString().padStart(2, "0")}
                      </h2>
                    </div>
                    <button
                      onClick={() => handleAddTask(column.id)}
                      className={`bg-white ${column.buttonBorderColor} border px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-gray-900 hover:bg-gray-50 transition-colors text-xs font-medium`}
                      title="Add new task"
                    >
                      <span className="text-sm">+</span>
                      <span>Add Task</span>
                    </button>
                  </div>

                  {/* Column Content - Scrollable */}
                  <div
                    ref={setDroppableRef}
                    className="bg-slate-50 border-l border-r border-b border-gray-200 rounded-b-lg flex-1 flex flex-col overflow-hidden min-h-0"
                  >
                    <SortableContext
                      items={columnTasks.map((t) => t.id.toString())}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="flex-1 overflow-y-auto p-4 min-h-0 kanban-vertical-scroll">
                        <div className="space-y-3">
                          {columnTasks.length > 0 ? (
                            columnTasks.map((task, index) => (
                              <TaskKanbanCard
                                key={task.id}
                                task={task}
                                columnColor={column.headerColor}
                                columnId={column.id}
                                columnBgColor={column.headerBgColor}
                                showImage={index % 3 === 1} // Show image on every 3rd card (starting from 2nd)
                                onClick={() => onTaskClick(task)}
                                onOptionsClick={() => onTaskEdit(task)}
                              />
                            ))
                          ) : (
                            <div className="text-center py-8 text-gray-500 text-sm">
                              No tasks
                            </div>
                          )}
                        </div>
                      </div>
                    </SortableContext>
                    {columnTasks.length > 0 && (
                      <div className="p-4 pt-0 flex-shrink-0">
                        <button
                          className={`w-full py-2 rounded-full font-medium text-sm transition-colors ${
                            column.id === "new" ? "bg-purple-100 text-purple-700 hover:bg-purple-200" :
                            column.id === "todo" ? "bg-orange-100 text-orange-700 hover:bg-orange-200" :
                            column.id === "in_progress" ? "bg-blue-100 text-blue-700 hover:bg-blue-200" :
                            column.id === "review" ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" :
                            "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          View More
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <DragOverlay>
          {activeTask ? (
            <div className="opacity-50">
              <TaskKanbanCard task={activeTask} onClick={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}

