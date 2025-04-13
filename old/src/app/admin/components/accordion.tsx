"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    className?: string;
    onToggle: () => void;
}

const AccordionItem = ({ title, children, className, isOpen, onToggle }: AccordionItemProps) => {
    return (
        <div className={`flex flex-col ${isOpen ? 'flex-1' : ''} border-b border-gray-200 w-full ${className}`}>
            <button
                className="w-full px-4 py-3 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
                onClick={onToggle}
            >
                <span className="font-medium text-gray-900">{title}</span>
                <ChevronDownIcon 
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>
            <div
                className={`overflow-auto transition-[max-height,opacity] duration-300 ease-in-out ${
                    isOpen ? 'max-h-[100vh] opacity-100 flex-1' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="px-4 py-3 bg-white h-full">{children}</div>
            </div>
        </div>
    );
};

interface AccordionProps {
    items: {
        id: string;
        title: string; 
        content: React.ReactNode;
    }[];
    allowMultiple?: boolean;
}

export default function Accordion({ items, allowMultiple = false }: AccordionProps) {
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());

    useEffect(() => {
        toggleItem(items[0].id);
    }, [items]);

    const toggleItem = (id: string) => {
        setOpenItems(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                if (!allowMultiple) {
                    next.clear();
                }
                next.add(id);
            }
            return next;
        });
    };

    return (
        <div className="flex flex-col divide-y divide-gray-200 bg-white rounded-lg border h-full border-gray-200">
            {items.map((item, idx) => (
                <AccordionItem
                    key={item.id}
                    title={item.title}
                    isOpen={openItems.has(item.id)}
                    onToggle={() => toggleItem(item.id)}
                >
                    {item.content}
                </AccordionItem>
            ))}
        </div>
    );
}
