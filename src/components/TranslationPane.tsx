import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useDocumentStore } from '@/store/useDocumentStore';
import { Download, FileText, Loader2 } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { toast } from '@/hooks/use-toast';

export const TranslationPane = () => {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());

  const exportAsTxt = () => {
    if (!activeDocument?.translatedText) return;

    const blob = new Blob([activeDocument.translatedText], { type: 'text/plain' });
    saveAs(blob, `${activeDocument.fileName}-translation.txt`);
    
    toast({
      title: 'Exported',
      description: 'Translation saved as .txt file',
    });
  };

  const exportAsDocx = async () => {
    if (!activeDocument?.translatedText) return;

    const doc = new Document({
      sections: [
        {
          children: activeDocument.translatedText.split('\n').map(
            (line) =>
              new Paragraph({
                children: [new TextRun(line)],
              })
          ),
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${activeDocument.fileName}-translation.docx`);
    
    toast({
      title: 'Exported',
      description: 'Translation saved as .docx file',
    });
  };

  return (
    <div className="h-full flex flex-col bg-card rounded-lg border border-border overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h2 className="font-semibold text-foreground">English Translation</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Automatically updated as you edit
        </p>
      </div>
      
      <div className="flex-1 overflow-hidden p-4">
        {!activeDocument ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <p>Translation will appear here</p>
          </div>
        ) : activeDocument.status === 'processing' ? (
          <div className="h-full flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Translating...</p>
          </div>
        ) : (
          <Textarea
            value={activeDocument.translatedText}
            readOnly
            placeholder="Translation will appear here..."
            className="w-full h-full resize-none font-sans text-sm"
          />
        )}
      </div>

      {activeDocument?.translatedText && (
        <div className="px-4 py-3 border-t border-border bg-muted/30 flex gap-2">
          <Button
            onClick={exportAsTxt}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <FileText className="w-4 h-4 mr-2" />
            Export .txt
          </Button>
          <Button
            onClick={exportAsDocx}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Export .docx
          </Button>
        </div>
      )}
    </div>
  );
};
