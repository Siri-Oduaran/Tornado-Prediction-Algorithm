import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileSelectedHandler = event => {
    setSelectedFile(event.target.files[0]);
  };

  const fileUploadHandler = () => {
    const formData = new FormData();
    formData.append('image', selectedFile);

    setLoading(true);
    axios.post('YOUR_FLASK_API_URL/predict', formData)
      .then(response => {
        setPrediction(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error!', error);
        setLoading(false);
      });
  };

  return (
    <div className="App">
      <h1>Tornado Prediction System</h1>
      <input type="file" onChange={fileSelectedHandler} />
      <button onClick={fileUploadHandler}>Upload</button>
      {loading && <p>Loading...</p>}
      {prediction && (
        <div>
          <h2>Prediction: {prediction.probability}% chance of tornado</h2>
          <h3>Detected Signatures:</h3>
          <ul>
            {prediction.signatures.map((sig, index) => (
              <li key={index}>{sig}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
