
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { fetchProjectDocuments } from "../services/studioapiservices";

export const useDocumentStore = create(
  persist(
    (set, get) => ({
      documents: {}, // { [projectId]: { files: { pdfs: [...] } } }

      fetchDocumentsForProject: async (projectId) => {
        const existing = get().documents[projectId];
        if (existing) return existing;

        try {
          const response = await fetchProjectDocuments({ project_id: projectId });

          // API might return { success, result: [...] }
          const projectDocs = Array.isArray(response.result)
            ? response.result
            : [];

          const formattedDocs = { files: { pdfs: projectDocs } };

          set((state) => ({
            documents: { ...state.documents, [projectId]: formattedDocs },
          }));

          return formattedDocs;
        } catch (error) {
          console.error(`Error fetching documents for project ${projectId}:`, error);
          const emptyDocs = { files: { pdfs: [] } };
          set((state) => ({
            documents: { ...state.documents, [projectId]: emptyDocs },
          }));
          return emptyDocs;
        }
      },

      clearDocuments: (projectId) => {
        set((state) => {
          const newDocuments = { ...state.documents };
          delete newDocuments[projectId];
          return { documents: newDocuments };
        });
      },
    }),
    {
      name: "document-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
