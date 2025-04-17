"use client";

import { Document, documentsApi } from "@/lib/api-client";
import { useAppStore } from "@/store/use-app-store";
import { toast, Toaster } from "./ui/sonner-toast";
import { useEffect } from "react";

export function DocumentTree({onSelect}: {onSelect: (id: Document) => void}) {
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
            <h1 className="text-2xl font-bold p-4">Document Tree</h1>
            {/* Document tree will be rendered here */}
        </div>
    );
}