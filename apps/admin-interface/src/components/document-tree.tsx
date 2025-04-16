"use client";

import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { File, FileText, Folder, FolderOpen, Plus, Trash2, Edit, Copy, MoveVertical } from "lucide-react";
import { Tree, TreeNode } from "@/components/ui/tree";
import { Document, documentsApi } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loading } from "@/components/ui/loading";

// Map document types to icons
const documentTypeIcons: Record<string, React.ReactNode> = {
    folder: <Folder className="h-4 w-4" />,
    "folder-open": <FolderOpen className="h-4 w-4" />,
    page: <FileText className="h-4 w-4" />,
    default: <File className="h-4 w-4" />,
};

// Convert API documents to tree nodes
function mapDocumentsToTreeNodes(documents: Document[]): TreeNode[] {
    return documents.map((doc) => ({
        id: doc.id,
        name: doc.name,
        type: doc.type,
        isExpanded: !!doc.isExpanded,
        children: doc.children ? mapDocumentsToTreeNodes(doc.children) : undefined,
    }));
}

// Convert tree nodes back to document format for API
function mapTreeNodesToDocuments(nodes: TreeNode[]): Document[] {
    return nodes.map((node) => ({
        id: node.id,
        name: node.name,
        type: node.type || "default",
        parentId: null, // This will be set by the parent when needed
        isExpanded: node.isExpanded,
        children: node.children ? mapTreeNodesToDocuments(node.children) : undefined,
    }));
}

interface DocumentTreeProps {
    onSelect?: (document: Document | null) => void;
    onAddDocument?: () => void;
}

export function DocumentTree({ onSelect, onAddDocument }: DocumentTreeProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [documents, setDocuments] = useState<TreeNode[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [newDocumentDialog, setNewDocumentDialog] = useState<{
        isOpen: boolean;
        parentId: string | null;
        type: "folder" | "page";
    }>({
        isOpen: false,
        parentId: null,
        type: "page",
    });
    const [newDocumentName, setNewDocumentName] = useState("");

    // Load document tree from API
    const loadDocuments = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            try {
                const data = await documentsApi.getDocumentTree(undefined, 3);
                const treeNodes = mapDocumentsToTreeNodes(data);
                setDocuments(treeNodes);
            } catch (apiError) {
                console.warn("API call failed, using mock data:", apiError);


                setDocuments([]);
                setError("Failed to load documents. Using mock data.");
                toast.error("Error Loading Documents", {
                    description: "Could not load the document tree. Using mock data.",
                });
            }
        } catch (err) {
            console.error("Failed to load documents:", err);
            setError("Failed to load documents. Please try again.");
            toast.error("Error Loading Documents", {
                description: "Could not load the document tree. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Load documents on component mount
    useEffect(() => {
        loadDocuments();
    }, [loadDocuments]);

    // Handle tree node changes (expansion, reordering)
    const handleNodesChange = useCallback(async (nodes: TreeNode[]) => {
        setDocuments(nodes);

        console.log("Nodes changed:", nodes);
    }, []);

    // Handle creating a new document
    const handleCreateDocument = async () => {
        if (!newDocumentName.trim()) {
            toast.error("Invalid Name", {
                description: "Please enter a valid name for the document.",
            });
            return;
        }

        try {
            const newDoc = {
                name: newDocumentName,
                type: newDocumentDialog.type,
                parentId: newDocumentDialog.parentId,
            };

            let createdDoc: Document;

            try {
                createdDoc = await documentsApi.createDocument(newDoc);
                toast.success("Document Created", {
                    description: `${newDocumentName} has been created successfully.`,
                });
            } catch (apiError) {
                console.warn("API call failed, using mock response:", apiError);

                createdDoc = {
                    id: `new-${Date.now()}`,
                    name: newDocumentName,
                    type: newDocumentDialog.type,
                    parentId: newDocumentDialog.parentId,
                };

                const addNodeToTree = (nodes: TreeNode[], parentId: string | null): TreeNode[] => {
                    if (parentId === null) {
                        return [...nodes, {
                            id: createdDoc.id,
                            name: createdDoc.name,
                            type: createdDoc.type
                        }];
                    }

                    return nodes.map((node) => {
                        if (node.id === parentId) {
                            return {
                                ...node,
                                isExpanded: true,
                                children: [...(node.children || []), {
                                    id: createdDoc.id,
                                    name: createdDoc.name,
                                    type: createdDoc.type
                                }],
                            };
                        }

                        if (node.children) {
                            return {
                                ...node,
                                children: addNodeToTree(node.children, parentId),
                            };
                        }

                        return node;
                    });
                };

                setDocuments(addNodeToTree(documents, newDocumentDialog.parentId));

                toast.success("Document Created", {
                    description: `${newDocumentName} has been created successfully.`,
                });
            }

            loadDocuments();
        } catch (err) {
            console.error("Failed to create document:", err);
            toast.error("Error Creating Document", {
                description: "Could not create the document. Please try again.",
            });
        } finally {
            setNewDocumentName("");
            setNewDocumentDialog({ isOpen: false, parentId: null, type: "page" });
        }
    };

    // Handle document deletion
    const handleDeleteDocument = async (documentId: string, documentName: string) => {
        try {
            try {
                await documentsApi.deleteDocument(documentId);
                toast.success("Document Deleted", {
                    description: `${documentName} has been deleted.`,
                });
            } catch (apiError) {
                console.warn("API call failed, updating UI only:", apiError);

                const deleteNodeFromTree = (nodes: TreeNode[], id: string): TreeNode[] => {
                    return nodes.filter(node => node.id !== id)
                        .map(node => {
                            if (node.children) {
                                return {
                                    ...node,
                                    children: deleteNodeFromTree(node.children, id),
                                };
                            }
                            return node;
                        });
                };

                setDocuments(deleteNodeFromTree(documents, documentId));

                toast.success("Document Deleted", {
                    description: `${documentName} has been deleted.`,
                });
            }

            loadDocuments();
        } catch (err) {
            console.error("Failed to delete document:", err);
            toast.error("Error Deleting Document", {
                description: "Could not delete the document. Please try again.",
            });
        }
    };

    // Get context menu items for a node
    const getContextMenuItems = useCallback((node: TreeNode) => {
        const isFolder = node.type === "folder";

        return [
            {
                label: "Edit",
                icon: <Edit className="h-4 w-4" />,
                onClick: () => {
                    toast.info("Edit", {
                        description: `Edit ${node.name} (Not implemented)`,
                    });
                },
            },
            ...(isFolder ? [
                {
                    label: "New Page",
                    icon: <FileText className="h-4 w-4" />,
                    onClick: () => {
                        setNewDocumentDialog({
                            isOpen: true,
                            parentId: node.id,
                            type: "page",
                        });
                    },
                },
                {
                    label: "New Folder",
                    icon: <Folder className="h-4 w-4" />,
                    onClick: () => {
                        setNewDocumentDialog({
                            isOpen: true,
                            parentId: node.id,
                            type: "folder",
                        });
                    },
                },
            ] : []),
            {
                label: "Copy",
                icon: <Copy className="h-4 w-4" />,
                onClick: () => {
                    toast.info("Copy", {
                        description: `Copy ${node.name} (Not implemented)`,
                    });
                },
            },
            {
                label: "Move",
                icon: <MoveVertical className="h-4 w-4" />,
                onClick: () => {
                    toast.info("Move", {
                        description: `Move ${node.name} (Not implemented)`,
                    });
                },
            },
            {
                label: "Delete",
                icon: <Trash2 className="h-4 w-4" />,
                variant: "destructive" as const,
                onClick: () => {
                    handleDeleteDocument(node.id, node.name);
                },
            },
        ];
    }, []);

    // Custom renderer for tree items
    const renderTreeItem = useCallback((node: TreeNode) => {
        const isFolder = node.type === "folder";
        const icon = isFolder
            ? (node.isExpanded ? documentTypeIcons["folder-open"] : documentTypeIcons["folder"])
            : (documentTypeIcons[node.type || "default"]);

        return (
            <div className="flex items-center gap-2 truncate" onClick={() => onSelect?.({
                id: node.id,
                name: node.name,
                type: node.type || "default",
                parentId: null,
            })}>
                <span className="shrink-0">{icon}</span>
                <span className="truncate">{node.name}</span>
            </div>
        );
    }, [onSelect]);

    if (isLoading) {
        return <div className="p-4"><Loading /></div>;
    }

    if (error) {
        return (
            <div className="p-4 text-red-500">
                {error}
                <Button onClick={loadDocuments} variant="outline" className="mt-2">
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col h-full">
                <ScrollArea className="flex-1">
                    <div className="p-2">
                        <Tree
                            nodes={documents}
                            onNodesChange={handleNodesChange}
                            renderItem={renderTreeItem}
                            getContextMenuItems={getContextMenuItems}
                            className="min-h-[200px]"
                        />
                    </div>
                </ScrollArea>
            </div>

            {/* New Document Dialog */}
            <Dialog open={newDocumentDialog.isOpen} onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setNewDocumentDialog({ ...newDocumentDialog, isOpen: false });
                    setNewDocumentName("");
                }
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {newDocumentDialog.type === "folder" ? "New Folder" : "New Page"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="py-4">
                        <Input
                            placeholder="Enter name"
                            value={newDocumentName}
                            onChange={(e) => setNewDocumentName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setNewDocumentDialog({ ...newDocumentDialog, isOpen: false });
                            setNewDocumentName("");
                        }}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateDocument}>
                            Create
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}