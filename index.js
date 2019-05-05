let canvas;
const canvasDiv = document.querySelector('.canvasDiv');

const canvases = [...document.querySelectorAll('.photo')];
const contexts = canvases.map(canvas => canvas.getContext('2d'));

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

const rgbButtonsDiv = document.querySelector('.rgb');
const chooseAgainButton = document.querySelector('.chooseAgain');

let focusedCanvas = 'all';

function createCanvas() {
  document.createElement("CANVAS");
  canvas.classList = 'photo';
  canvasDiv.appendChild(canvas);
}

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

function paintSingleCanvas(i, width, height){

	if(focusedCanvas != 'all' && focusedCanvas != i){
		return;
	}

	contexts[i].drawImage(video, 0, 0, width, height)

	let pixels = contexts[i].getImageData(0, 0, width, height);

	if(i == 0){
		// no change in pixels
	}else if(i == 1){
		pixels = redEffect(pixels);
	}else if(i == 2){
		pixels = greenEffect(pixels);
	}else if(i == 3){
		pixels = blueEffect(pixels);
	}
  else if(i == 4){
    pixels = rgbSplit(pixels);
  }

	contexts[i].putImageData(pixels, 0, 0);
}

function removeRedFilter() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return redFilter = setInterval(() => {
    context.drawImage(video, 0, 0, width, height);
    let pixels = context.getImageData(0,0, width, height)

    pixels = redEffectReverse(pixels);
    context.putImageData(pixels, 0, 0);
  }, 24);
}

function paintToCanvas(){
	const width = video.videoWidth;
	const height = video.videoHeight;

	console.log(height, width);

	canvases.forEach((canvas, i) => {

		canvas.width = width;
		canvas.height = height;

		return setInterval(() => {
			paintSingleCanvas(i, width, height);
		}, 16);
	});
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

function focusCanvas(i){
	canvases.forEach((canvas, idx) => {
		if(idx != i){

			canvas.style.display = 'none';
		}
	});

  rgbButtonsDiv.style.display = 'none';
  chooseAgainButton.style.display = 'block';
  takePhotoButton.style.display = 'block';
	canvases[i].style.height = '30%';

	focusedCanvas = i;
}

function takePhoto() {
  snap.currentTime = 0;
  snap.play();

  canvases.forEach((canvas, idx) => {
		if(idx == focusedCanvas){
      const data = canvas.toDataURL('image/jpeg');
      const link = document.createElement('a');
      link.href = data;
      link.setAttribute('download', 'beauty');
      link.innerHTML = `<img src="${data}" alt="Beauty"/>`;
      strip.insertBefore(link, strip.firstChild);
		}
	});
}

getVideo();

takePhotoButton.addEventListener('click', takePhoto);
//
video.addEventListener('canplay', paintToCanvas);

redEffectButton.addEventListener('click', () => {
    paintToCanvas();
    focusCanvas(1);
})

greenEffectButton.addEventListener('click', () => {
  paintToCanvas();
  focusCanvas(2);
})

blueEffectButton.addEventListener('click', () => {
  paintToCanvas();
  focusCanvas(3);
})

noFilterButton.addEventListener('click', () => {
  paintToCanvas();
  focusCanvas(0);
});

rainbowEffectButton.addEventListener('click', () => {
  paintToCanvas();
  focusCanvas(4);
})

chooseAgainButton.addEventListener('click', () => {
  window.onload = function () {window.location.reload()}
  window.onload();
})
