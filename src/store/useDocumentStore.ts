import { create } from 'zustand';

export interface DocumentItem {
  id: string;
  fileName: string;
  fileUrl: string;
  extractedText: string;
  translatedText: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
  timestamp: number;
}

interface DocumentStore {
  documents: DocumentItem[];
  activeDocumentId: string | null;
  isProcessing: boolean;
  addDocument: (file: File, fileUrl: string) => string;
  updateDocument: (id: string, updates: Partial<DocumentItem>) => void;
  setActiveDocument: (id: string) => void;
  getActiveDocument: () => DocumentItem | undefined;
  removeDocument: (id: string) => void;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: [],
  activeDocumentId: null,
  isProcessing: false,

  addDocument: (file: File, fileUrl: string) => {
    const id = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newDoc: DocumentItem = {
      id,
      fileName: file.name,
      fileUrl,
      extractedText: '',
      translatedText: '',
      status: 'pending',
      timestamp: Date.now(),
    };

    set((state) => ({
      documents: [...state.documents, newDoc],
      activeDocumentId: id,
    }));

    return id;
  },

  updateDocument: (id: string, updates: Partial<DocumentItem>) => {
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, ...updates } : doc
      ),
    }));
  },

  setActiveDocument: (id: string) => {
    set({ activeDocumentId: id });
  },

  getActiveDocument: () => {
    const state = get();
    return state.documents.find((doc) => doc.id === state.activeDocumentId);
  },

  removeDocument: (id: string) => {
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== id),
      activeDocumentId:
        state.activeDocumentId === id ? null : state.activeDocumentId,
    }));
  },
}));
