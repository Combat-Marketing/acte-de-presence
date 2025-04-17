"use client";

import { Document, documentsApi } from "@/lib/api-client";
import { useAppStore } from "@/store/use-app-store";
import { toast, Toaster } from "./ui/sonner-toast";
import { useEffect } from "react";

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



    return (
        <div className="flex flex-col h-full max-h-screen overflow-hidden">
            <div className="flex-1 overflow-y-auto">
                <ul className="list-disc pl-5">
                    {documentTree.map((doc) => (
                        <li key={doc.id} className="cursor-pointer hover:bg-gray-200 p-2" onClick={() => onSelect(doc)}>
                            {doc.key}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}