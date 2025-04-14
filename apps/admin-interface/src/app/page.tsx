import SideMenu from "@/components/side-menu";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import Image from "next/image";

export default function Dashboard() {
  return (
      <div className="flex h-screen overflow-hidden">
        <SideMenu />
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={10}>
            {/* render the accordion with the trees */}
            <Accordion type="single" collapsible className="w-full h-full">
              <AccordionItem value="documents">
                <AccordionTrigger className="text-lg font-bold pl-4">Documents</AccordionTrigger>
                <AccordionContent className="p-4">
                  {/* <DocumentTree /> */}
                  <div>Document Tree</div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="assets">
                <AccordionTrigger className="text-lg font-bold pl-4">Assets</AccordionTrigger>
                <AccordionContent className="p-4">
                  {/* <AssetTree /> */}
                  <div>Asset Tree</div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="data-objects">
                <AccordionTrigger className="text-lg font-bold pl-4">Data Objects</AccordionTrigger>
                <AccordionContent className="p-4">
                  {/* <DataObjectTree /> */}
                  <div>Data Object Tree</div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={90}>
            {/* render the dashboard */}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
  );
}
