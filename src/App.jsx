import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';

const PomodoroTimer = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [focusLength, setFocusLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [timerLabel, setTimerLabel] = useState('Focus');
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const handleBreakChange = (amount) => {
    if (!isRunning) {
      const newLength = breakLength + amount;
      if (newLength > 0 && newLength <= 60) {
        setBreakLength(newLength);
      }
    }
  };

  const handleFocusChange = (amount) => {
    if (!isRunning) {
      const newLength = focusLength + amount;
      if (newLength > 0 && newLength <= 60) {
        setFocusLength(newLength);
        if (timerLabel === 'Focus') {
          setTimeLeft(newLength * 60);
        }
      }
    }
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setBreakLength(5);
    setFocusLength(25);
    setIsRunning(false);
    setTimeLeft(25 * 60);
    setTimerLabel('Focus');

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 0) {
            audioRef.current.play();

            if (timerLabel === 'Focus') {
              setTimerLabel('Break');
              return breakLength * 60;
            } else {
              setTimerLabel('Focus');
              return focusLength * 60;
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timerLabel, breakLength, focusLength]);

  const r = 120;

  const circumference = 2 * Math.PI * 120; // 120 adalah radius lingkaran
  let offset;
  if (timerLabel === 'Focus') {
    offset = circumference - (timeLeft / (focusLength * 60)) * circumference;
  } else {
    offset = circumference - (timeLeft / (breakLength * 60)) * circumference;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8">Pomodoro Clock</h1>

        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Break Length Controls */}
          <div className="text-center">
            <h2
              id="break-label"
              className="text-l md:text-xl font-semibold mb-4"
            >
              Break Time
            </h2>
            <div className="flex items-center justify-center gap-4">
              <button
                id="break-decrement"
                onClick={() => handleBreakChange(-1)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Minus size={24} />
              </button>
              <span id="break-length" className="text-2xl font-bold">
                {breakLength}
              </span>
              <button
                id="break-increment"
                onClick={() => handleBreakChange(1)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Plus size={24} />
              </button>
            </div>
          </div>

          {/* Focus Length Controls */}
          <div className="text-center">
            <h2
              id="Focus-label"
              className="text-l md:text-xl font-semibold mb-4"
            >
              Focus Time
            </h2>
            <div className="flex items-center justify-center gap-4">
              <button
                id="Focus-decrement"
                onClick={() => handleFocusChange(-1)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Minus size={24} />
              </button>
              <span id="Focus-length" className="text-2xl font-bold">
                {focusLength}
              </span>
              <button
                id="Focus-increment"
                onClick={() => handleFocusChange(1)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Plus size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Timer Display */}
        <div className="relative text-center mb-8 h-72 w-72 mx-auto">
          <svg className="absolute w-full h-full -rotate-90">
            <circle
              cx="140"
              cy="145"
              r={r}
              className="fill-none stroke-gray-200"
              strokeWidth={10}
            ></circle>
            <circle
              cx="140"
              cy="145"
              r={r}
              className="fill-none stroke-green-500 transition-all duration-1000 ease-linear"
              strokeWidth={10}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            ></circle>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h2 id="timer-label" className="text-2xl font-bold mb-4">
              {timerLabel}
            </h2>
            <div id="time-left" className="text-6xl font-bold mb-6">
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            id="start_stop"
            onClick={handleStartStop}
            className="p-4 rounded-full bg-green-500 text-white hover:bg-green-600"
          >
            {isRunning ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button
            id="reset"
            onClick={handleReset}
            className="p-4 rounded-full bg-gray-500 text-white hover:bg-gray-600"
          >
            <RotateCcw size={24} />
          </button>
        </div>

        <audio
          id="beep"
          ref={audioRef}
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
          preload="auto"
        />
      </div>
    </div>
  );
};

export default PomodoroTimer;
