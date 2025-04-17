"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loading } from "@/components/ui/loading";
import { Toaster, toast } from "@/components/ui/sonner-toast";
import { Archive, Bell, BarChart3, Settings } from "lucide-react";

export default function DesignShowcase() {
  return (
    <div className="container p-10 space-y-10">
      <section>
        <h2 className="text-2xl font-bold mb-4">Typography</h2>
        <div className="space-y-2">
          <p className="text-2xl">2xl - Main Headings (24px)</p>
          <p className="text-xl">xl - Section Headings (20px)</p>
          <p className="text-lg">lg - Subsection Headings (18px)</p>
          <p className="text-base">base - Regular Text (16px)</p>
          <p className="text-sm">sm - Small Text (14px)</p>
          <p className="text-xs">xs - Extra Small Text (12px)</p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-primary text-primary-foreground rounded-lg">Primary</div>
          <div className="p-4 bg-secondary text-secondary-foreground rounded-lg">Secondary</div>
          <div className="p-4 bg-accent text-accent-foreground rounded-lg">Accent</div>
          <div className="p-4 bg-muted text-muted-foreground rounded-lg">Muted</div>
          <div className="p-4 bg-destructive text-destructive-foreground rounded-lg">Destructive</div>
          <div className="p-4 bg-popover text-popover-foreground rounded-lg border">Popover</div>
          <div className="p-4 bg-card text-card-foreground rounded-lg border">Card</div>
          <div className="p-4 bg-background text-foreground rounded-lg border">Background</div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default Button</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button size="icon"><Settings /></Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Form Elements</h2>
        <div className="space-y-4 max-w-sm">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Option 1</SelectItem>
              <SelectItem value="2">Option 2</SelectItem>
              <SelectItem value="3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Cards</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>This is a sample card with a description.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card content goes here. This demonstrates the standard card layout.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Dialog</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sample Dialog</DialogTitle>
              <DialogDescription>
                This is an example of our dialog component with a description.
              </DialogDescription>
            </DialogHeader>
            <p>Dialog content goes here. You can add any content you need.</p>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button onClick={() => toast.success("Action completed!")}>Continue</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Icons</h2>
        <div className="flex gap-4">
          <Archive className="w-4 h-4" />
          <Archive className="w-5 h-5" />
          <Archive className="w-6 h-6" />
          <Bell className="w-4 h-4" />
          <Bell className="w-5 h-5" />
          <Bell className="w-6 h-6" />
          <BarChart3 className="w-4 h-4" />
          <BarChart3 className="w-5 h-5" />
          <BarChart3 className="w-6 h-6" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Loading States</h2>
        <div className="flex flex-wrap gap-4">
          <Loading size="sm" />
          <Loading size="md" />
          <Loading size="lg" />
          <Loading size="md" text="Loading..." />
        </div>
      </section>
      <Toaster />
    </div>
  );
}