"use client";

import * as React from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronRight, Grip, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

// Tree Node Types
export type TreeNode = {
  id: string;
  name: string;
  children?: TreeNode[];
  type?: string;
  isExpanded?: boolean;
};

// Tree Props
interface TreeProps {
  nodes: TreeNode[];
  onNodesChange?: (nodes: TreeNode[]) => void;
  renderItem?: (node: TreeNode, depth: number) => React.ReactNode;
  getContextMenuItems?: (node: TreeNode) => {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: "default" | "destructive";
  }[];
  dragDisabled?: boolean;
  className?: string;
}

// Sortable Tree Item Component
interface SortableTreeItemProps {
  node: TreeNode;
  depth: number;
  renderItem?: (node: TreeNode, depth: number) => React.ReactNode;
  getContextMenuItems?: (node: TreeNode) => {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: "default" | "destructive";
  }[];
  onToggle: (id: string) => void;
}

const SortableTreeItem = React.forwardRef<HTMLDivElement, SortableTreeItemProps>(
  ({ node, depth, renderItem, getContextMenuItems, onToggle }, ref) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: node.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    const hasChildren = node.children && node.children.length > 0;
    const paddingLeft = `${depth * 16 + 4}px`;

    // Default item renderer if not provided
    const defaultRenderItem = (node: TreeNode) => (
      <div className="flex items-center gap-2 truncate">
        {hasChildren ? (
          node.isExpanded ? (
            <ChevronDown className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0" />
          )
        ) : (
          <div className="w-4" />
        )}
        <span className="truncate">{node.name}</span>
      </div>
    );

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn(
          "relative flex items-center",
          isDragging && "z-10"
        )}
      >
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              className={cn(
                "flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:bg-accent hover:text-accent-foreground",
                isDragging && "opacity-50"
              )}
              style={{ paddingLeft }}
              onClick={() => {
                if (hasChildren) {
                  onToggle(node.id);
                }
              }}
            >
              <div className="flex-1 flex items-center">
                {renderItem ? renderItem(node, depth) : defaultRenderItem(node)}
              </div>
              <div
                className={cn(
                  "flex items-center gap-1",
                  isDragging && "invisible"
                )}
              >
                <div
                  {...listeners}
                  className="cursor-grab hover:bg-background rounded p-1"
                >
                  <Grip className="h-3 w-3 text-muted-foreground" />
                </div>
                {getContextMenuItems && (
                  <div className="hover:bg-background rounded p-1">
                    <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
          </ContextMenuTrigger>
          {getContextMenuItems && (
            <ContextMenuContent>
              {getContextMenuItems(node).map((item, idx) => (
                <ContextMenuItem
                  key={idx}
                  onClick={item.onClick}
                  variant={item.variant || "default"}
                >
                  {item.icon && (
                    <span className="mr-2">{item.icon}</span>
                  )}
                  {item.label}
                </ContextMenuItem>
              ))}
            </ContextMenuContent>
          )}
        </ContextMenu>
      </div>
    );
  }
);
SortableTreeItem.displayName = "SortableTreeItem";

// Tree Component
export function Tree({
  nodes,
  onNodesChange,
  renderItem,
  getContextMenuItems,
  dragDisabled = false,
  className,
}: TreeProps) {
  const [treeNodes, setTreeNodes] = React.useState<TreeNode[]>(nodes);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [activeNode, setActiveNode] = React.useState<TreeNode | null>(null);

  // Update internal nodes when external nodes change
  React.useEffect(() => {
    setTreeNodes(nodes);
  }, [nodes]);

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle node expansion toggle
  const handleToggle = (id: string) => {
    const updatedNodes = toggleNodeExpansion(treeNodes, id);
    setTreeNodes(updatedNodes);
    if (onNodesChange) {
      onNodesChange(updatedNodes);
    }
  };

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    // Find the active node
    const findActiveNode = (nodes: TreeNode[]): TreeNode | null => {
      for (const node of nodes) {
        if (node.id === active.id) return node;
        if (node.children) {
          const found = findActiveNode(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    const node = findActiveNode(treeNodes);
    setActiveNode(node || null);
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeId = active.id as string;
      const overId = over.id as string;

      // Find the nodes that were dragged
      const findAndRemoveNode = (nodes: TreeNode[], id: string): [TreeNode | null, TreeNode[]] => {
        let foundNode: TreeNode | null = null;
        let newNodes = [...nodes];

        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].id === id) {
            foundNode = nodes[i];
            newNodes.splice(i, 1);
            return [foundNode, newNodes];
          }

          if (nodes[i].children && nodes[i].children?.length || 0 > 0) {
            const [found, updatedChildren] = findAndRemoveNode(nodes[i].children || [], id);
            if (found) {
              newNodes[i] = {
                ...nodes[i],
                children: updatedChildren,
              };
              return [found, newNodes];
            }
          }
        }

        return [null, nodes];
      };

      // Find and insert node in its new position
      const insertNode = (nodes: TreeNode[], node: TreeNode, overId: string): TreeNode[] => {
        const newNodes = [...nodes];

        for (let i = 0; i < newNodes.length; i++) {
          if (newNodes[i].id === overId) {
            // Insert after the target node
            newNodes.splice(i + 1, 0, node);
            return newNodes;
          }

          if (newNodes[i].children && newNodes[i].children?.length || 0 > 0) {
            const updatedChildren = insertNode(newNodes[i].children || [], node, overId);
            if (updatedChildren !== newNodes[i].children) {
              newNodes[i] = {
                ...newNodes[i],
                children: updatedChildren,
              };
              return newNodes;
            }
          }
        }

        return newNodes;
      };

      const [removedNode, afterRemoveNodes] = findAndRemoveNode(treeNodes, activeId);

      if (removedNode) {
        const updatedNodes = insertNode(afterRemoveNodes, removedNode, overId);
        setTreeNodes(updatedNodes);

        if (onNodesChange) {
          onNodesChange(updatedNodes);
        }
      }
    }

    setActiveId(null);
    setActiveNode(null);
  };

  // Recursively render the tree
  const renderTree = (nodes: TreeNode[], depth: number = 0): React.ReactNode => (
    <SortableContext items={nodes.map((node) => node.id)}>
      <div className="flex flex-col gap-1">
        {nodes.map((node) => (
          <div key={node.id} className="relative">
            <SortableTreeItem
              node={node}
              depth={depth}
              renderItem={renderItem}
              getContextMenuItems={getContextMenuItems}
              onToggle={handleToggle}
            />
            {node.isExpanded && node.children && node.children.length > 0 && (
              <div className="ml-4">{renderTree(node.children, depth + 1)}</div>
            )}
          </div>
        ))}
      </div>
    </SortableContext>
  );

  return (
    <div className={cn("tree", className)}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {renderTree(treeNodes)}
        <DragOverlay>
          {activeId && activeNode && (
            <div className="p-2 bg-background border rounded-md shadow-lg">
              {renderItem ? renderItem(activeNode, 0) : activeNode.name}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

// Helper function to toggle node expansion
function toggleNodeExpansion(nodes: TreeNode[], id: string): TreeNode[] {
  return nodes.map((node) => {
    if (node.id === id) {
      return { ...node, isExpanded: !node.isExpanded };
    }

    if (node.children && node.children.length > 0) {
      return {
        ...node,
        children: toggleNodeExpansion(node.children, id),
      };
    }

    return node;
  });
}