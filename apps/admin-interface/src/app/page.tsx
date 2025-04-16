"use client";

import { DocumentTree } from "@/components/document-tree";
import SideMenu from "@/components/side-menu";
import { TopBar } from "@/components/top-bar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Toaster, toast } from "@/components/ui/sonner-toast";
import { useAppStore } from "@/store/use-app-store";
import { Database, FolderPlus } from "lucide-react";

export default function Dashboard() {
  const { 
    selectedAccordionItem,
    setSelectedAccordionItem,
    leftPanelSize,
    setLeftPanelSize,
    selectedDocument,
    setSelectedDocument
  } = useAppStore();

  return (
    <div className="flex h-screen overflow-hidden">
      <SideMenu />
      <div className="flex-1 overflow-hidden">
        <TopBar title="Dashboard" />
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel 
            defaultSize={leftPanelSize} 
            minSize={15}
            onResize={(size) => setLeftPanelSize(size)}
          >
            <Accordion
              type="single"
              collapsible
              value={selectedAccordionItem}
              onValueChange={setSelectedAccordionItem}
              className="w-full h-full"
            >
              <AccordionItem value="documents" className="border-none">
                <AccordionTrigger className="text-lg font-bold px-4 py-2">
                  Documents
                </AccordionTrigger>
                <AccordionContent className="pt-0">
                  <div className="h-[calc(100vh-220px)]">
                    <DocumentTree
                      onSelect={(doc) => {
                        setSelectedDocument(doc);
                        toast.success(`Document selected`);
                      }}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="assets" className="border-none">
                <AccordionTrigger className="text-lg font-bold px-4 py-2">
                  Assets
                </AccordionTrigger>
                <AccordionContent className="pt-0">
                  <div className="h-[calc(100vh-220px)] p-4 flex flex-col items-center justify-center text-muted-foreground">
                    <FolderPlus className="h-10 w-10 mb-2" />
                    <p>Asset management will be implemented soon</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="data-objects" className="border-none">
                <AccordionTrigger className="text-lg font-bold px-4 py-2">
                  Data Objects
                </AccordionTrigger>
                <AccordionContent className="pt-0">
                  <div className="h-[calc(100vh-220px)] p-4 flex flex-col items-center justify-center text-muted-foreground">
                    <Database className="h-10 w-10 mb-2" />
                    <p>Data object management will be implemented soon</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={100 - leftPanelSize}>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
              {selectedDocument ? (
                <div>
                  <h2 className="text-xl mb-2">{selectedDocument.key}</h2>
                  <pre className="bg-muted p-4 rounded-md">
                    {JSON.stringify(selectedDocument, null, 2)}
                  </pre>
                </div>
              ) : (
                <p className="text-muted-foreground">Select a document from the tree to view or edit.</p>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <Toaster />
    </div>
  );
}
