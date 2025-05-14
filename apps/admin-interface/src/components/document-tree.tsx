"use client";

import { Document, documentsApi } from "@/lib/api-client";
import { useAppStore } from "@/store/use-app-store";
import { toast, Toaster } from "./ui/sonner-toast";
import { useEffect } from "react";

interface Node {
    id: string;
    key: string;
    index: number;
    children?: Node[];
}

function TreeNode({
    node,
    onSelect,
}: {
    node: Node;
    onSelect: (id: string) => void;
}) {
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className="ml-4 mr-2 my-1">
            <button
                type="button"
                className="text-left hover:underline display-block text-sm text-gray-700 w-full hover:bg-gray-100 rounded px-2 py-1"
                onClick={() => onSelect(node.id)}
            >
                {node.key}
            </button>
            {hasChildren && (
                <div className="ml-4 border-l border-gray-200 pl-2">
                    {node.children!.map((child) => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function DocumentTree({ onSelect }: { onSelect: (id: Document) => void }) {
    const { documentTree, setDocumentTree } = useAppStore((state) => ({
        documentTree: state.documentTree,
        setDocumentTree: state.setDocumentTree,
    }));

    async function fetchDocuments() {
        const response = await documentsApi.getDocumentTree();
        try {
            setDocumentTree(response.documents);
        } catch (error) {
            console.error("Failed to fetch documents");
            toast.error("Failed to fetch documents: " + (error as Error).message);
        }
    }

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleSelect = async (document: string) => {
        console.log("Selected document ID:", document);
        if (!document) {
            console.error("Document ID is null");
            toast.error("Document ID is null");
            return;
        }
        try {
            const response = await documentsApi.getDocument(document);
            onSelect(await response);
        } catch (error) {
            console.error("Failed to fetch document");
            toast.error("Failed to fetch document: " + (error as Error).message);
        }
    };

    return (
        <div className="flex flex-col w-full h-full">
            <Toaster />
            <div className="flex-1 overflow-auto">
                {documentTree.map((node) => (
                    <TreeNode
                        key={node.id}
                        node={node}
                        onSelect={handleSelect}
                    />
                ))}
            </div>
        </div>
    );
}