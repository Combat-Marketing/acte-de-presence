import Tree, { TreeNode } from "@admin/components/tree";
import { CodeBracketIcon, DocumentIcon, EnvelopeIcon, FolderIcon, LinkIcon } from "@heroicons/react/24/outline";

type DocumentNodeType = "folder" | "page" | "link" | "email" | "snippet";

// TODO: Maybe enclose, or not?
interface DocumentTreeProps {
    onNodeSelect: (type: string, node: TreeNode<DocumentNodeType>) => void;
    onNodeOpen: (node: TreeNode<DocumentNodeType>) => void;
}
const dummyNodes: TreeNode<DocumentNodeType>[] = [
    {
        id: 1,
        type: "page",
        path: "",
        key: "/",
        index: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        parentId: null,
        isRoot: true,
        children: [
            {
                id: 2,
                type: "page",
                path: "/",
                key: "about-us",
                index: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                parentId: null,
                isRoot: true,
                children: []
            },
            {
                id: 3,
                type: "page",
                path: "/",
                key: "contact-us",
                index: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                parentId: null,
                isRoot: true,
                children: []
            }
        ]
    },
];

function getNodeIcon(type: DocumentNodeType) {
    switch (type) {
        case "folder":
            return <FolderIcon className="w-4 h-4" />;
        case "page":
            return <DocumentIcon className="w-4 h-4" />;
        case "link":
            return <LinkIcon className="w-4 h-4" />;
        case "email":
            return <EnvelopeIcon className="w-4 h-4" />;
        case "snippet":
            return <CodeBracketIcon className="w-4 h-4" />;
    }
}

export default function DocumentTree({ onNodeSelect, onNodeOpen }: DocumentTreeProps) {
    return (
        <Tree 
            type="documents"
            nodes={dummyNodes}
            selectedNodeId={null}
            getIcon={getNodeIcon}
            onNodeSelect={onNodeSelect}
            onNodeOpen={onNodeOpen}
            contextMenuItems={[]}
        />
    )
}
