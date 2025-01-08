import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Customizable text and styles for each status
  const statusConfig = {
    RECORDING: {
      displayText: '�� ON AIR',
      backgroundColor: '#ff0000',
      textColor: 'white',
      fontSize: '10vw'
    },
    STANDBY: {
      displayText: 'READY',
      backgroundColor: '#00ff00',
      textColor: 'white',
      fontSize: '10vw'
    }
  };

  const [recordingStatus, setRecordingStatus] = useState('STANDBY');

  useEffect(() => {
    // Use environment variable or fallback to localhost
    const wsUrl = import.meta.env.VITE_WEBSOCKET_URL || 'ws://your-app-name.railway.app';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('Connected to WebSocket server at:', wsUrl);
    };

    ws.onmessage = (event) => {
      const status = event.data.toString().toUpperCase().trim();
      console.log('Received status:', status);
      setRecordingStatus(status);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  const currentConfig = statusConfig[recordingStatus] || statusConfig.STANDBY;
  
  const containerStyle = {
    backgroundColor: currentConfig.backgroundColor,
    width: '100vw',
    height: '100vh',
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const textStyle = {
    color: currentConfig.textColor,
    fontSize: currentConfig.fontSize,
    fontWeight: 'bold',
  };

  return (
    <div style={containerStyle}>
      <div style={textStyle}>{currentConfig.displayText}</div>
    </div>
  );
}

export default App;