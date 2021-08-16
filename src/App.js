import { useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import Webcam from 'react-webcam';

import './App.css';
import { drawHand } from './utilities'

function App() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)
  
  const detect = async (net) => {
    // check data is available
    if (typeof webcamRef.current !== 'undefined'
      && webcamRef.current !== null
      && webcamRef.current.video.readyState === 4
    ) {
      // get video properties
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      // set video height and width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // make detections
      const hand = await net.estimateHands(video);
      console.log(hand);
      
      // draw mesh
      const ctx = canvasRef.current.getContext('2d')
      drawHand(hand, ctx)
    }
  }

  const runHandpose = async () => {
    const net = await handpose.load()
    console.log('Handpose model loaded.')
    // Loop and detect hands
    setInterval(() => {
      detect(net)
    }, 100)
  }

  useEffect(() => {
    runHandpose()
  }, [])
  
  return (
    <div className="App">
      <header className="App-header">
        <Webcam ref={webcamRef}
          style={{
            position: 'absolute',
            margin: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 9,
            width: 640,
            height: 408
          }}
        />
        <canvas ref={canvasRef}
          style={{
            position: 'absolute',
            margin: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 9,
            width: 640,
            height: 408
          }}
        />
      </header>
    </div>
  );
}

export default App;
