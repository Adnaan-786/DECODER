import { useDocumentStore } from '@/store/useDocumentStore';
import { FileText, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export const DocumentQueue = () => {
  const documents = useDocumentStore((state) => state.documents);
  const activeDocumentId = useDocumentStore((state) => state.activeDocumentId);
  const setActiveDocument = useDocumentStore((state) => state.setActiveDocument);
  const removeDocument = useDocumentStore((state) => state.removeDocument);

  if (documents.length === 0) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h3 className="font-semibold text-sm text-foreground">Document Queue</h3>
        <p className="text-xs text-muted-foreground mt-1">{documents.length} document(s)</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setActiveDocument(doc.id)}
              className={`
                group relative p-3 rounded-lg border cursor-pointer
                transition-all duration-200
                ${
                  activeDocumentId === doc.id
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }
              `}
            >
              <div className="flex items-start gap-2">
                {getStatusIcon(doc.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {doc.fileName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 capitalize">
                    {doc.status}
                  </p>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeDocument(doc.id);
                  }}
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
