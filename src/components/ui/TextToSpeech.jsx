import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2, VolumeX, Settings } from 'lucide-react';

const TextToSpeech = ({ text, bookTitle, chapterTitle }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  const utteranceRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = synthRef.current.getVoices();
      setVoices(availableVoices);
      
      // Set default voice (prefer English voices)
      const englishVoice = availableVoices.find(voice => 
        voice.lang.startsWith('en') && voice.default
      ) || availableVoices.find(voice => 
        voice.lang.startsWith('en')
      ) || availableVoices[0];
      
      setSelectedVoice(englishVoice);
    };

    loadVoices();
    
    // Chrome needs this event listener
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (synthRef.current.speaking) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Clean text for speech (remove markdown formatting)
  const cleanTextForSpeech = (text) => {
    if (!text) return '';
    
    // Remove markdown formatting
    let cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/#{1,6}\s/g, '') // Remove headings
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
      .replace(/`(.*?)`/g, '$1') // Remove code
      .replace(/\n\n/g, '. ') // Replace double newlines with period
      .replace(/\n/g, ' ') // Replace single newlines with space
      .trim();
    
    return cleanText;
  };

  const speak = () => {
    if (!text) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const cleanedText = cleanTextForSpeech(text);
    
    // Create utterance
    utteranceRef.current = new SpeechSynthesisUtterance(cleanedText);
    
    // Set voice
    if (selectedVoice) {
      utteranceRef.current.voice = selectedVoice;
    }
    
    // Set speech parameters
    utteranceRef.current.rate = rate;
    utteranceRef.current.pitch = pitch;
    utteranceRef.current.volume = isMuted ? 0 : volume;

    // Event handlers
    utteranceRef.current.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utteranceRef.current.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentWordIndex(0);
    };

    utteranceRef.current.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      setIsPaused(false);
    };

    // Start speaking
    synthRef.current.speak(utteranceRef.current);
  };

  const pause = () => {
    if (synthRef.current.speaking) {
      synthRef.current.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const resume = () => {
    if (synthRef.current.paused) {
      synthRef.current.resume();
      setIsPaused(false);
      setIsPlaying(true);
    }
  };

  const stop = () => {
    synthRef.current.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentWordIndex(0);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      speak();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (utteranceRef.current) {
      utteranceRef.current.volume = isMuted ? volume : 0;
    }
  };

  const handleRateChange = (newRate) => {
    setRate(newRate);
    if (utteranceRef.current) {
      utteranceRef.current.rate = newRate;
    }
  };

  const handlePitchChange = (newPitch) => {
    setPitch(newPitch);
    if (utteranceRef.current) {
      utteranceRef.current.pitch = newPitch;
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (utteranceRef.current && !isMuted) {
      utteranceRef.current.volume = newVolume;
    }
  };

  const handleVoiceChange = (voice) => {
    setSelectedVoice(voice);
    if (utteranceRef.current) {
      utteranceRef.current.voice = voice;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="font-semibold text-sm text-gray-800">Text-to-Speech</h3>
            <p className="text-xs text-gray-500">Listen to this chapter</p>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <button
          onClick={stop}
          disabled={!isPlaying && !isPaused}
          className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Stop"
        >
          <Square className="w-5 h-5 text-gray-700" />
        </button>

        <button
          onClick={togglePlayPause}
          disabled={!text}
          className="p-4 bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={isPlaying ? 'Pause' : isPaused ? 'Resume' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white" />
          )}
        </button>

        <button
          onClick={toggleMute}
          className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-gray-700" />
          ) : (
            <Volume2 className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>

      {/* Status */}
      <div className="text-center mb-4">
        <span className={`text-sm font-medium ${isPlaying ? 'text-green-600' : isPaused ? 'text-yellow-600' : 'text-gray-500'}`}>
          {isPlaying ? 'Playing...' : isPaused ? 'Paused' : 'Ready to play'}
        </span>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-t border-gray-200 pt-4 space-y-4">
          {/* Voice Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Voice
            </label>
            <select
              value={selectedVoice?.name || ''}
              onChange={(e) => {
                const voice = voices.find(v => v.name === e.target.value);
                handleVoiceChange(voice);
              }}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>

          {/* Speed Control */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Speed: {rate}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={(e) => handleRateChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.5x</span>
              <span>1x</span>
              <span>2x</span>
            </div>
          </div>

          {/* Pitch Control */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pitch: {pitch}
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={pitch}
              onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low</span>
              <span>Normal</span>
              <span>High</span>
            </div>
          </div>

          {/* Volume Control */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Volume: {Math.round(volume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>Tip:</strong> Use the settings to adjust voice, speed, and pitch to your preference.
        </p>
      </div>
    </div>
  );
};

export default TextToSpeech;
