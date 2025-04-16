import { Document } from "@/lib/api-client";

export function DocumentTree({onSelect}: {onSelect: (id: Document) => void}) {
    return (
        <div className="flex flex-col h-full max-h-screen overflow-hidden">
            <h1 className="text-2xl font-bold p-4">Document Tree</h1>
            {/* Document tree will be rendered here */}
        </div>
    );
}