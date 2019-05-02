const canvas = document.querySelector('.photo');
const context = canvas.getContext('2d');

const video = document.querySelector('.player');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

const takePhotoButton = document.querySelector('.takePhoto');


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


function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
  }, 24);
}

getVideo();

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

video.addEventListener('canplay', paintToCanvas)
