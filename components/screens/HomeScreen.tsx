import React from 'react';
import Button from '../ui/Button';

interface HomeScreenProps {
  onStartOffline: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartOffline }) => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 text-center space-y-12">
      <div className="space-y-4">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-lg">
          DODGE<br/>OR<br/>DARE
        </h1>
        <p className="text-slate-400 text-lg">
          The party game that destroys friendships.
        </p>
      </div>

      <div className="w-full max-w-xs space-y-4">
        <Button 
          variant="primary" 
          fullWidth 
          onClick={onStartOffline}
        >
          Start Offline Game
        </Button>
        
        <Button 
          variant="outline" 
          fullWidth 
          disabled
        >
          Online Mode (Coming Soon)
        </Button>
      </div>
      
      <div className="text-slate-600 text-sm">
        v1.0.0 • Offline Mode
      </div>
    </div>
  );
};

export default HomeScreen;