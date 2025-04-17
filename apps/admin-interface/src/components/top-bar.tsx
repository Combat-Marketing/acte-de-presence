import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useAppStore, WebsiteItem } from "@/store/use-app-store";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { SelectItem } from "@radix-ui/react-select";

export function TopBar({ title }: { title: string }) {
    const { selectedWebsite, setSelectedWebsite } = useAppStore((state) => ({
        selectedWebsite: state.selectedWebsite,
        setSelectedWebsite: state.setSelectedWebsite,
    }));
    const websitesMock: WebsiteItem[] = [
        {
            id: "e3b0c442-98fc-4c14-8a18-cb3df16e9fda",
            name: "combat.nl",
            url: "https://combat.nl",
        },
        {
            id: "5f8c922a-7df6-4da5-95a1-d7c142396a8f",
            name: "trace.nl",
            url: "https://trace.nl",
        },
        {
            id: "e162f74d-35fb-43d3-a175-5e8e90d9b4d0",
            name: "next-heroes.nl",
            url: "https://next-heroes.nl",
        },
        {
            id: "b39f7a76-5eb9-4c6b-8e4d-fabd93621d21",
            name: "hairextensionsbychantal.nl",
            url: "https://hairextensionsbychantal.nl",
        }
    ]

    return (
        <div className="flex items-center justify-between p-5 h-20 bg-[var(--color-bg-secondary)] shadow-md">
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <div className="flex items-center space-x-4">
                {/* Add any additional controls or buttons here */}
                <Select onValueChange={(value => {
                    setSelectedWebsite(websitesMock.find(website => website.id === value) || null);
                })}>
                    <SelectTrigger className="min-w-[200px] bg-white">
                        <SelectValue placeholder="Select Website" className="text-white">{selectedWebsite ? selectedWebsite.name : "Select Website"}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {websitesMock.map((website) => (
                            <SelectItem key={website.id} value={website.id} className="hover:cursor-pointer hover:bg-[var(--color-bg-secondary)] hover:shadow-lg hover:text-white">
                                {website.name}
                            </SelectItem>
                        ))}


                    </SelectContent>
                </Select>
                <Button variant="outline" className="text-white bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-secondary)] hover:shadow-lg hover:text-white">
                    <PlusIcon className="mr-2" />
                    Add new website
                </Button>
            </div>
        </div>
    );
}