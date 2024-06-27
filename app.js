if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').then(function (registration) {
    console.log('Service Worker registered with scope:', registration.scope);
  }).catch(function (error) {
    console.log('Service Worker registration failed:', error);
  });
}

document.getElementById('startButton').addEventListener('click', () => {
  const video = document.getElementById('video');
  const barcodeResult = document.getElementById('barcodeResult');

  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(stream => {
    video.srcObject = stream;
  }).catch(err => {
    console.error(err);
  });

  video.addEventListener('play', () => {
    const barcodeCanvas = document.createElement('canvas');
    const barcodeContext = barcodeCanvas.getContext('2d');

    setInterval(() => {
      barcodeCanvas.width = video.videoWidth;
      barcodeCanvas.height = video.videoHeight;
      barcodeContext.drawImage(video, 0, 0, barcodeCanvas.width, barcodeCanvas.height);

      const imageData = barcodeContext.getImageData(0, 0, barcodeCanvas.width, barcodeCanvas.height);

      // Use a barcode library like QuaggaJS to detect the barcode
      Quagga.decodeSingle({
        src: imageData,
        numOfWorkers: 0,  // Needs to be 0 when used within a browser
        inputStream: {
          size: 800  // restrict input-size to be 800px in width (long-side)
        },
        decoder: {
          readers: ["code_128_reader"]  // List of active readers
        }
      }, function (result) {
        if (result && result.codeResult) {
          barcodeResult.textContent = result.codeResult.code;
        }
      });
    }, 1000);
  });
});
