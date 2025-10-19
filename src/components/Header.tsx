import { Languages } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <Languages className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">ScribeTranslate</h1>
            <p className="text-sm text-primary-foreground/80">
              Nepali & Sinhalese to English Translation
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
