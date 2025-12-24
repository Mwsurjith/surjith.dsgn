'use client';

import { TasksProvider, useTasks } from '@/context/TasksContext';
import TaskItem from '@/components/microapps/micro-task/TaskItem';
import DateHeader from '@/components/microapps/micro-task/DateHeader';
import TaskInput from '@/components/microapps/micro-task/TaskInput';

function TodoApp() {
    const { groupedTasks, isLoading, toggleTask } = useTasks();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
                <div className="text-zinc-500">Loading...</div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-zinc-900 flex flex-col">
            <div className="flex-1 flex flex-col justify-end max-w-xl mx-auto w-full">
                {/* Task List - bottom aligned */}
                <div className="px-4 overflow-y-auto">
                    {groupedTasks.length === 0 ? (
                        <div className="text-zinc-500 text-center py-20">
                            No tasks yet. Add one below!
                        </div>
                    ) : (
                        groupedTasks.map((group, idx) => (
                            <div key={idx}>
                                <DateHeader label={group.label} />
                                {group.tasks.map((task) => (
                                    <TaskItem key={task.id} task={task} onToggle={toggleTask} />
                                ))}
                            </div>
                        ))
                    )}
                </div>

                {/* Sticky Input */}
                <TaskInput />
            </div>
        </main>
    );
}

export default function ToDoPage() {
    return (
        <TasksProvider>
            <TodoApp />
        </TasksProvider>
    );
}
