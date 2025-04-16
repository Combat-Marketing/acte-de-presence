import { create } from 'zustand'
import { Document } from '@/lib/api-client'
export interface WebsiteItem {
    id: string
    name: string
    url: string
}
interface AppState {
    // Website state
    selectedWebsite: WebsiteItem | null
    setSelectedWebsite: (website: WebsiteItem | null) => void

    // Document state
    selectedDocument: Document | null
    setSelectedDocument: (document: Document | null) => void

    // UI state
    selectedAccordionItem: string | undefined
    setSelectedAccordionItem: (value: string | undefined) => void

    // Panel state
    leftPanelSize: number
    setLeftPanelSize: (size: number) => void
}

export const useAppStore = create<AppState>((set) => ({
    // Website state
    selectedWebsite: null,
    setSelectedWebsite: (website) => set({ selectedWebsite: website }),
    // Document state
    selectedDocument: null,
    setSelectedDocument: (document) => set({ selectedDocument: document }),

    // UI state
    selectedAccordionItem: "documents",
    setSelectedAccordionItem: (value) => set({ selectedAccordionItem: value }),

    // Panel state
    leftPanelSize: 20,
    setLeftPanelSize: (size) => set({ leftPanelSize: size })
}))