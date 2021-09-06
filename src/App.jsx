import { useState, useRef, useEffect } from 'react';
import './App.css';
import QRCodeStyling from 'qr-code-styling';
import rskLogo from './rsk_logo.svg';

const MIN_QR_SIZE = 100; // px
const MAX_QR_SIZE = 1000; // px
const MIN_IMG_SIZE = 0.1;
const MAX_IMG_SIZE = 0.5;

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  title: {
    marginBottom: 0,
  },
  rskImage: {
    marginTop: '-1rem',
    width: 100,
    height: 100,
  },
  button: {
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontSize: '1.5rem',
  },
  numberInput: {
    width: '3rem',
  },
  sourceInput: {
    width: '50vw',
  },
};

function App() {
  const [qrSource, setQrSource] = useState('https://www.rsk.co/');
  const [hasLogo, setHasLogo] = useState(true);
  const [qrSize, setQrSize] = useState(200);
  const [imageSize, setImageSize] = useState(0.5);

  const [qrCode] = useState(new QRCodeStyling());
  const [errorMessage] = useState('');
  const qrRef = useRef();

  const validateInputs = () => {
    const newQrSize =
      qrSize <= MIN_QR_SIZE
        ? MIN_QR_SIZE
        : qrSize >= MAX_QR_SIZE
        ? MAX_QR_SIZE
        : qrSize;
    setQrSize(newQrSize);
    const newImageSize =
      imageSize <= MIN_IMG_SIZE
        ? MIN_IMG_SIZE
        : imageSize >= MAX_IMG_SIZE
        ? MAX_IMG_SIZE
        : imageSize;
    setImageSize(newImageSize);
    return { newQrSize, newImageSize };
  };

  const getOptions = () => {
    const { newQrSize, newImageSize } = validateInputs();
    return {
      width: newQrSize,
      height: newQrSize,
      type: 'svg',
      data: qrSource,
      image: hasLogo ? rskLogo : undefined,
      imageOptions: {
        imageSize: newImageSize,
        margin: 5,
      },
      cornersSquareOptions: {
        color: '#0b5d2e',
        type: 'extra-rounded',
      },
      cornersDotOptions: {
        color: '#16a92e',
      },
    };
  };

  const updateOptions = () => {
    qrCode?.update(getOptions());
    const targetDiv = qrRef.current;
    targetDiv.innerHTML = '';
    qrCode?.append(targetDiv);
  };

  const downloadImage = () => {
    qrCode?.download({
      extension: 'png',
    });
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      updateOptions();
    }
  };

  useEffect(() => {
    updateOptions();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Generate QR-code with RSK image</h1>
      <img style={styles.rskImage} alt="RSK logo" src={rskLogo} />
      <label htmlFor="qr-source">
        String to encode
        <input
          id="qr-source"
          type="url"
          value={qrSource}
          onChange={(e) => setQrSource(e.target.value)}
          style={styles.sourceInput}
          onKeyPress={handleEnter}
        />
      </label>
      <label htmlFor="place-logo">
        Place RSK logo
        <input
          type="checkbox"
          id="place-logo"
          checked={hasLogo}
          onChange={(e) => setHasLogo(e.target.checked)}
          onKeyPress={handleEnter}
        />
      </label>
      <label htmlFor="qr-size">
        {`QR size (${MIN_QR_SIZE}px - ${MAX_QR_SIZE}px)`}
        <input
          type="number"
          step="10"
          id="qr-size"
          value={qrSize}
          onChange={(e) => setQrSize(e.target.value)}
          style={styles.numberInput}
          onKeyPress={handleEnter}
        />
      </label>
      <label htmlFor="image-size">
        {`Image size (${MIN_IMG_SIZE} - ${MAX_IMG_SIZE})`}
        <input
          type="number"
          step="0.01"
          id="image-size"
          value={imageSize}
          onChange={(e) => setImageSize(e.target.value)}
          style={styles.numberInput}
          onKeyPress={handleEnter}
        />
      </label>
      <button
        type="button"
        onClick={updateOptions}
        style={styles.button}
        onKeyPress={handleEnter}
      >
        Generate a QR code
      </button>
      <div ref={qrRef} />
      <button type="button" onClick={downloadImage} style={styles.button}>
        Download PNG
      </button>
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
    </div>
  );
}

export default App;
