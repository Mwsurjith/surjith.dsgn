'use client';

import { useState, useRef, useEffect } from 'react';
import { PencilSimpleLine, TrashSimple, Check, X } from '@phosphor-icons/react';
import { useTasks } from '@/context/TasksContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TaskItem({ task, onToggle }) {
    const { deleteTask, updateTask } = useTasks();
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(task.title);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleEdit = (e) => {
        e.stopPropagation();
        setIsEditing(true);
        setEditValue(task.title);
    };

    const handleSaveEdit = (e) => {
        e?.stopPropagation();
        if (editValue.trim() && editValue !== task.title) {
            updateTask(task.id, editValue.trim());
        }
        setIsEditing(false);
    };

    const handleCancelEdit = (e) => {
        e?.stopPropagation();
        setEditValue(task.title);
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSaveEdit(e);
        } else if (e.key === 'Escape') {
            handleCancelEdit(e);
        }
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = (e) => {
        e.stopPropagation();
        deleteTask(task.id);
        setShowDeleteConfirm(false);
    };

    const handleCancelDelete = (e) => {
        e.stopPropagation();
        setShowDeleteConfirm(false);
    };

    if (isEditing) {
        return (
            <div className="p-2 flex items-center gap-2">
                <Input
                    ref={inputRef}
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 text-sm h-8 bg-transparent text-white px-0 py-1 rounded-none border-0 border-b border-zinc-700 shadow-none outline-none focus-visible:bg-transparent focus-visible:border-zinc-700 focus-visible:ring-0"
                />
                <Button
                    onClick={handleSaveEdit}
                    className="p-1 h-8 w-8 rounded-full text-green-500 hover:text-green-400 transition-colors"
                    title="Save"
                >
                    <Check size={18} weight="bold" />
                </Button>
                <Button
                    onClick={handleCancelEdit}
                    className="p-1 h-8 w-8 rounded-full text-zinc-500 hover:text-zinc-400 transition-colors"
                    title="Cancel"
                >
                    <X size={18} weight="bold" />
                </Button>
            </div>
        );
    }

    if (showDeleteConfirm) {
        return (
            <div className="p-2 flex items-center justify-between bg-zinc-800/50 rounded">
                <span className="text-zinc-400 text-sm">Delete this task?</span>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={handleConfirmDelete}
                        className="px-3 py-1 h-8 text-sm bg-red-600 hover:bg-red-500 text-white rounded transition-colors"
                    >
                        Delete
                    </Button>
                    <Button
                        onClick={handleCancelDelete}
                        className="px-3 py-1 h-8 text-sm bg-zinc-700 hover:bg-zinc-600 text-white rounded transition-colors"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`group p-2 cursor-pointer transition-all duration-300 flex items-center justify-between ${task.is_completed ? 'text-zinc-500 line-through' : 'text-zinc-200 hover:text-white'
                }`}
            onClick={() => onToggle(task.id)}
        >
            <span className="flex flex-1 items-center h-8 text-sm">{task.title}</span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button onClick={handleEdit} variant="ghost" className="h-8 w-8 rounded-full hover:bg-zinc-700 hover:text-white">
                    <PencilSimpleLine size={16} />
                </Button>
                <Button onClick={handleDeleteClick} variant="ghost" className="h-8 w-8 rounded-full hover:bg-zinc-700 hover:text-red-500">
                    <TrashSimple size={16} />
                </Button>
            </div>
        </div>
    );
}
