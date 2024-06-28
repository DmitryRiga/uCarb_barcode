if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').then(function (registration) {
    console.log('Service Worker registered with scope:', registration.scope);
  }).catch(function (error) {
    console.log('Service Worker registration failed:', error);
  });
}

document.getElementById('takePictureButton').addEventListener('click', takePicture);

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const img = document.getElementById('capturedImage');
const barcodeResult = document.getElementById('barcodeResult');

navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(stream => {
  video.srcObject = stream;
}).catch(err => {
  console.error(err);
});

function takePicture() {
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = canvas.toDataURL('image/png');
  img.src = imageData;
  img.style.display = 'block';

  // Decode the barcode from the captured image
  Quagga.decodeSingle({
    src: imageData,
    numOfWorkers: 0,
    inputStream: {
      size: 800 // restrict input-size to be 800px in width (long-side)
    },
    decoder: {
      readers: ["code_128_reader"] // List of active readers
    }
  }, function (result) {
    if (result && result.codeResult) {
      barcodeResult.textContent = result.codeResult.code;
    } else {
      barcodeResult.textContent = "No barcode detected.";
    }
  });
}
