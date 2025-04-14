"use client";
import Accordion from "./accordion";
import DocumentTree from "./document-tree";
import ResizableContainer from "./resizable-container";

export default function TreeAccorion() {
    return (
        <ResizableContainer>
            <Accordion items={[{
                id: "documents",
                title: "Documents",
                content: <DocumentTree onNodeSelect={() => { }} onNodeOpen={() => { }} />
            }, {
                id: "assets",
                title: "Assets",
                content: <div>Assets</div>
            }, {
                id: "data-objects",
                title: "Data Objects",
                content: <div>Data Objects</div>
            }]} />
        </ResizableContainer>
    );
}