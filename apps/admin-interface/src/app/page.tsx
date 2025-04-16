"use client";

import SideMenu from "@/components/side-menu";
import { DocumentTree } from "@/components/document-tree";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Toaster } from "@/components/ui/sonner-toast";
import { Plus, FolderPlus, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Dashboard() {
  const [selectedAccordion, setSelectedAccordion] = useState<string>("documents");
  
  // Function to add a new document
  const handleAddDocument = () => {
    // This will be handled within the DocumentTree component
    // We're just showing the button in the header now
  };

  // Function to add a new asset
  const handleAddAsset = () => {
    // This will be implemented later
  };

  // Function to add a new data object
  const handleAddDataObject = () => {
    // This will be implemented later
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <SideMenu />
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15}>
          <div className="flex flex-col h-full max-h-screen">
            <Accordion 
              type="single" 
              value={selectedAccordion} 
              onValueChange={setSelectedAccordion}
              collapsible={false} // Never collapse all items
              className="w-full flex-1 overflow-hidden flex flex-col"
            >
              <AccordionItem value="documents" className="border-b">
                <div className="flex items-center justify-between">
                  <AccordionTrigger className="text-lg font-bold pl-4 py-2 flex-1">
                    Documents
                  </AccordionTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddDocument();
                    }}
                    title="Add new document"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <AccordionContent className="p-0 h-[calc(100vh-220px)] overflow-hidden" forceMount>
                  <DocumentTree />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="assets" className="border-b">
                <div className="flex items-center justify-between">
                  <AccordionTrigger className="text-lg font-bold pl-4 py-2 flex-1">
                    Assets
                  </AccordionTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddAsset();
                    }}
                    title="Add new asset"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <AccordionContent className="p-4 h-[calc(100vh-220px)] overflow-hidden" forceMount>
                  {/* <AssetTree /> will be implemented later */}
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <FolderPlus className="h-10 w-10 mb-2" />
                    <p>Asset management will be implemented soon</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="data-objects" className="border-b">
                <div className="flex items-center justify-between">
                  <AccordionTrigger className="text-lg font-bold pl-4 py-2 flex-1">
                    Data Objects
                  </AccordionTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddDataObject();
                    }}
                    title="Add new data object"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <AccordionContent className="p-4 h-[calc(100vh-220px)] overflow-hidden" forceMount>
                  {/* <DataObjectTree /> will be implemented later */}
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Database className="h-10 w-10 mb-2" />
                    <p>Data object management will be implemented soon</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={80}>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p>Select a document from the tree to view or edit.</p>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      <Toaster />
    </div>
  );
}
