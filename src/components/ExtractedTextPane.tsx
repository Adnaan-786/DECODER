import { useEffect, useState, useCallback, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useDocumentStore } from '@/store/useDocumentStore';
import { Loader2 } from 'lucide-react';

export const ExtractedTextPane = () => {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());
  const updateDocument = useDocumentStore((state) => state.updateDocument);
  const [localText, setLocalText] = useState('');
  const translationTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (activeDocument) {
      setLocalText(activeDocument.extractedText);
    }
  }, [activeDocument?.id, activeDocument?.extractedText]);

  const triggerTranslation = useCallback(async (text: string, docId: string) => {
    if (!text.trim()) {
      updateDocument(docId, { translatedText: '' });
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ocr-extract`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            imageBase64: 'data:text/plain;base64,' + btoa(text),
            textOnly: true 
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.translatedText) {
        updateDocument(docId, { translatedText: data.translatedText });
      }
    } catch (error) {
      console.error('Translation error:', error);
    }
  }, [updateDocument]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setLocalText(newText);
    
    if (activeDocument) {
      updateDocument(activeDocument.id, { extractedText: newText });
      
      // Debounce translation
      if (translationTimeoutRef.current) {
        clearTimeout(translationTimeoutRef.current);
      }
      
      translationTimeoutRef.current = setTimeout(() => {
        triggerTranslation(newText, activeDocument.id);
      }, 1000);
    }
  };

  return (
    <div className="h-full flex flex-col bg-card rounded-lg border border-border overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h2 className="font-semibold text-foreground">Extracted Text</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Edit the text to refine translation
        </p>
      </div>
      
      <div className="flex-1 overflow-hidden p-4">
        {!activeDocument ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <p>Upload a document to begin</p>
          </div>
        ) : activeDocument.status === 'processing' ? (
          <div className="h-full flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Extracting text...</p>
          </div>
        ) : (
          <Textarea
            value={localText}
            onChange={handleTextChange}
            placeholder="Extracted text will appear here..."
            className="w-full h-full resize-none font-mono text-sm"
          />
        )}
      </div>
    </div>
  );
};
