"use client";

import { ArrowTopRightOnSquareIcon, ChevronDownIcon, ChevronRightIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";

type TreeItem<NT = unknown> = {
    id: number;
    type: NT;
    path: string;
    key: string;
    index?: number;
    createdAt: Date;
    updatedAt: Date;
    parentId: number | null;
}

/**
 * TreeNode is a generic interface that defines the structure of a tree node.
 * 
 * @param T - The type of the node data.
 */
export type TreeNode<T = unknown> = {
    id: number;
    type: T;
    path: string;
    key: string;
    index?: number;
    createdAt: Date;
    updatedAt: Date;
    parentId: number | null;
    isRoot: boolean;
    children: TreeNode<T>[];
}

/**
 * TreeProps is a generic interface that defines the structure of a tree.
 * 
 * @param NT - The type of the node data.
 */
export interface TreeProps<NT> {
    type: string;
    nodes: TreeNode<NT>[];
    selectedNodeId: string | null;
    getIcon: (type: NT) => React.ReactNode;
    contextMenuItems: {
        label: string;
        action: () => void;
    }[];
    onNodeSelect: (type: string, node: TreeNode<NT>) => void;
    onNodeReorder?: (node: TreeNode<NT>, newIndex: number) => void;
    onNodeDelete?: (node: TreeNode<NT>) => void;
    onNodeCreate?: (parent: TreeNode<NT>, type: string) => void;
    onNodeOpen?: (node: TreeNode<NT>) => void;
}

interface ContextMenuState {
    x: number;
    y: number;
    nodeId: string;
    nodeType: string;
}

export default function Tree<NT>({
    type, nodes, selectedNodeId, contextMenuItems, onNodeSelect, getIcon, onNodeReorder, onNodeDelete, onNodeCreate, onNodeOpen
}: TreeProps<NT>) {
    const treeRef = useRef<HTMLDivElement>(null);
    const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
    const [dragOverNode, setDragOverNode] = useState<string | null>(null);
    const [draggedNode, setDraggedNode] = useState<TreeNode<NT> | null>(null);

    const handleContextMenu = (e: React.MouseEvent, node: TreeNode<NT>) => {
        e.preventDefault();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            nodeId: node.id.toString(),
            nodeType: node.type as string
        });
    }

    const toggleNode = (nodeId: string) => {
        setExpandedNodes(prev => {
            const next = new Set(prev);
            if (next.has(parseInt(nodeId))) {
                next.delete(parseInt(nodeId));
            } else {
                next.add(parseInt(nodeId));
            }
            return next;
        });
    }

    const handleDragStart = (event: React.DragEvent, node: TreeNode<NT>) => {
        setDraggedNode(node);
        event.dataTransfer.setData('text/plain', node.id.toString());
    };

    const handleDragOver = (event: React.DragEvent, node: TreeNode<NT>) => {
        event.preventDefault();
        setDragOverNode(node.id.toString());
    };

    const handleDrop = (event: React.DragEvent, target: TreeNode<NT>) => {
        event.preventDefault();
        setDragOverNode(null);
        if (draggedNode && draggedNode.id !== target.id && onNodeReorder) {
            onNodeReorder(draggedNode, target.index ?? 0);
        }
    };

    const renderNode = (type: string, node: TreeNode<NT>, level: number = 0) => {
        const isExpanded = expandedNodes.has(node.id);
        const isSelected = selectedNodeId === node.id.toString();
        const hasChildren = node.children?.length > 0;
        const isDraggingOver = dragOverNode === node.id.toString();

        return (
            <div key={node.id} className="w-full">
                <div className={`
                    flex items-center gap-1 px-2 py-1 rounded w-full cursor-pointer
                    ${isSelected ? "bg-[var(--primary-color)] text-white" : ""}
                    ${isDraggingOver ? "border-2 border-dashed border-[var(--secondary-color)]" : ""}
                `}
                    style={{
                        paddingLeft: `${level * 1.5 + 0.5}rem`
                    }}
                    draggable={!!onNodeReorder}
                    onDragStart={(e) => onNodeReorder && handleDragStart(e, node)}
                    onDragOver={(e) => onNodeReorder && handleDragOver(e, node)}
                    onDrop={(e) => onNodeReorder && handleDrop(e, node)}
                    onClick={() => onNodeSelect(type, node)}
                    onContextMenu={(e) => handleContextMenu(e, node)}
                >
                    {hasChildren ? (
                        <button
                            className="text-sm text-gray-500"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleNode(node.id.toString());
                            }}
                        >
                            {isExpanded ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
                        </button>
                    ) : (
                        <div className="w-6" />
                    )}
                    <div className="flex items-center gap-1 flex-1 overflow-ellipsis">
                        {getIcon(node.type)}
                        <span className="flex-1">{node.key}</span>
                        {!!onNodeOpen && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onNodeOpen(node);
                                }}
                                className="p-1 hover:bg-[var(--color-bg-primary)] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleContextMenu(e, node);
                            }}
                            className="p-1 hover:bg-[var(--color-bg-primary)] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                            <EllipsisVerticalIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="w-full">
                    {isExpanded && node.children.map(child => renderNode(type, child, level + 1))}
                </div>
            </div>
        )
    }

    return (
        <div ref={treeRef} className="relative h-full w-full">
            <div className="h-full">
                {nodes.map(node => renderNode(type, node))}
            </div>
        </div>
    )
}
