import { useDocumentStore } from '@/store/useDocumentStore';
import { FileUploadZone } from './FileUploadZone';

export const SourcePane = () => {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());

  return (
    <div className="h-full flex flex-col bg-card rounded-lg border border-border overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h2 className="font-semibold text-foreground">Source Document</h2>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {activeDocument ? (
          <div className="h-full flex items-center justify-center">
            <img
              src={activeDocument.fileUrl}
              alt={activeDocument.fileName}
              className="max-w-full max-h-full object-contain rounded-lg shadow-md"
            />
          </div>
        ) : (
          <FileUploadZone />
        )}
      </div>
    </div>
  );
};
