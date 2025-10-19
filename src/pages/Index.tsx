import { Header } from '@/components/Header';
import { DocumentQueue } from '@/components/DocumentQueue';
import { SourcePane } from '@/components/SourcePane';
import { ExtractedTextPane } from '@/components/ExtractedTextPane';
import { TranslationPane } from '@/components/TranslationPane';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <DocumentQueue />
        
        <main className="flex-1 container mx-auto p-6">
          <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-4">
            <SourcePane />
            <ExtractedTextPane />
            <TranslationPane />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
