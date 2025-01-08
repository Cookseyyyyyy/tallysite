import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Customizable text and styles for each status
  const statusConfig = {
    RECORDING: {
      displayText: 'Andy is a benny',  // Customize this text
      backgroundColor: '#ff0000',
      textColor: 'white',
      fontSize: '10vw'
    },
    STANDBY: {
      displayText: 'READY',      // Customize this text
      backgroundColor: '#00ff00',
      textColor: 'white',
      fontSize: '10vw'
    }
  };

  const [recordingStatus, setRecordingStatus] = useState('STANDBY');

  useEffect(() => {
    const ws = new WebSocket('ws://172.31.160.1:8080');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
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