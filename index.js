const canvas = document.querySelector('.photo');
const context = canvas.getContext('2d');

const video = document.querySelector('.player');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

const takePhotoButton = document.querySelector('.takePhoto');

const addGhostButton = document.querySelector('.addGhost');
const removeGhostButton = document.querySelector('.removeGhost');

const redEffectButton = document.querySelector('.red');
const blueEffectButton = document.querySelector('.blue');
const rainbowEffectButton = document.querySelector('.rainbow');
const greenEffectButton = document.querySelector('.green');
const noFilterButton = document.querySelector('.noFilter');

function getVideo() {
  navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(localMediaStream => {
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch(error => {
      console.error('Access denied to webcam', error);
    })
}

function paintToCanvasGreen() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    context.drawImage(video, 0, 0, width, height);
    let pixels = context.getImageData(0,0, width, height)

    pixels = greenEffect(pixels);
    context.putImageData(pixels, 0, 0);
  }, 16);
}

function paintToCanvasRed() {

  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    context.drawImage(video, 0, 0, width, height);
    let pixels = context.getImageData(0,0, width, height)

    pixels = redEffect(pixels);
    context.putImageData(pixels, 0, 0);
  }, 24);
}

function paintToCanvas() {
  context.resetTransform();
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    context.drawImage(video, 0, 0, width, height);
    let pixels = context.getImageData(0,0, width, height)

    context.putImageData(pixels, 0, 0);
  }, 16);
}

function paintToCanvasBlue() {

  context.resetTransform();
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    context.drawImage(video, 0, 0, width, height);
    let pixels = context.getImageData(0,0, width, height)

    pixels = blueEffect(pixels);
    context.putImageData(pixels, 0, 0);
  }, 16);
}

function paintToCanvasRainbow() {
  context.resetTransform();
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {

    context.drawImage(video, 0, 0, width, height);
    let pixels = context.getImageData(0,0, width, height)

    pixels = rgbSplit(pixels);
    context.putImageData(pixels, 0, 0);
  }, 16);
}

function redEffect(pixels) {
  for(let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 50;
    pixels.data[i + 1] = pixels.data[i + 1] - 50;
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5;
  }
  return pixels;
}

function greenEffect(pixels) {
  for(let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] - 50;
    pixels.data[i + 1] = pixels.data[i + 1] + 50;
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5;
  }
  return pixels;
}

function blueEffect(pixels) {
  for(let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] * 0.5;
    pixels.data[i + 1] = pixels.data[i + 1] - 20;
    pixels.data[i + 2] = pixels.data[i + 2] + 100;
  }
  return pixels;
}

function rgbSplit(pixels) {
  for(let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0];
    pixels.data[i + 500] = pixels.data[i + 1];
    pixels.data[i - 550] = pixels.data[i + 2];
  }
  return pixels;
}

function takePhoto() {
  snap.currentTime = 0;
  snap.play();

  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'beauty');
  link.innerHTML = `<img src="${data}" alt="Beauty"/>`;
  strip.insertBefore(link, strip.firstChild);
}

takePhotoButton.addEventListener('click', takePhoto);

addGhostButton.addEventListener('click', event => {
  addGhostStatus = true;
  context.globalAlpha = 0.4;
})

removeGhostButton.addEventListener('click', event => {
  addGhostStatus = false;
  context.globalAlpha = 0;
})

rainbowEffectButton.addEventListener('click', event => {
  redEffectStatus = false;
  greenEffectStatus = false;
  blueEffectStatus = false;
  rainbowEffectStatus = true;
  noFilterStatus = false;
})

greenEffectButton.addEventListener('click', event => {
  redEffectStatus = false;
  greenEffectStatus = true;
  blueEffectStatus = false;
  rainbowEffectStatus = false;
  noFilterStatus = false;
})

blueEffectButton.addEventListener('click', event => {
  redEffectStatus = false;
  greenEffectStatus = false;
  blueEffectStatus = true;
  rainbowEffectStatus = false;
  noFilterStatus = false;
})

getVideo();

video.addEventListener('canplay', paintToCanvas);

redEffectButton.addEventListener('click', paintToCanvasRed)

greenEffectButton.addEventListener('click', paintToCanvasGreen)

blueEffectButton.addEventListener('click', paintToCanvasBlue)

noFilterButton.addEventListener('click', paintToCanvas);

rainbowEffectButton.addEventListener('click', paintToCanvasRainbow)
