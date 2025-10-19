import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileImage } from 'lucide-react';
import { useDocumentStore } from '@/store/useDocumentStore';
import { toast } from '@/hooks/use-toast';

export const FileUploadZone = () => {
  const addDocument = useDocumentStore((state) => state.addDocument);
  const updateDocument = useDocumentStore((state) => state.updateDocument);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: 'File too large',
            description: 'Please upload files smaller than 10MB',
            variant: 'destructive',
          });
          continue;
        }

        const fileUrl = URL.createObjectURL(file);
        const docId = addDocument(file, fileUrl);
        
        toast({
          title: 'File uploaded',
          description: `${file.name} added to queue`,
        });

        // Start OCR processing
        updateDocument(docId, { status: 'processing' });

        try {
          // Convert file to base64 data URL
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve, reject) => {
            reader.onload = () => {
              resolve(reader.result as string); // Keep full data URL
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          const imageBase64 = await base64Promise;

          const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ocr-extract`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ imageBase64 }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'OCR extraction failed');
          }

          updateDocument(docId, {
            extractedText: data.extractedText,
            translatedText: data.translatedText,
            status: 'completed',
          });

          toast({
            title: 'Success',
            description: `Text extracted and translated from ${file.name}`,
          });
        } catch (error) {
          console.error('OCR error:', error);
          updateDocument(docId, {
            status: 'error',
            error: error instanceof Error ? error.message : 'Processing failed',
          });
          toast({
            title: 'Error',
            description: 'Failed to extract text from image',
            variant: 'destructive',
          });
        }
      }
    },
    [addDocument, updateDocument]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
    },
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
        transition-all duration-300
        ${
          isDragActive
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-border hover:border-primary/50 hover:bg-muted/30'
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        {isDragActive ? (
          <>
            <FileImage className="w-12 h-12 text-primary animate-bounce" />
            <p className="text-lg font-medium text-primary">Drop files here...</p>
          </>
        ) : (
          <>
            <Upload className="w-12 h-12 text-muted-foreground" />
            <div>
              <p className="text-lg font-medium text-foreground mb-2">
                Drag & drop files here
              </p>
              <p className="text-sm text-muted-foreground">
                or click to select files
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Supports JPG, PNG, PDF (max 10MB)
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
