let video = document.querySelector("#video");
let clickBtn = document.querySelector(".clickBtn");
let canvas = document.querySelector("#canvas");
let myDiv = document.querySelector(".my-div");

// Start Video
function startVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((err) => {
      console.error("Error accessing webcam:", err);
      alert("Unable to access the webcam. Please check your browser settings.");
    });
}

// Load saved images on page load
window.onload = () => {
  let savedImages = JSON.parse(localStorage.getItem("images")) || [];
  savedImages.forEach((imageData) => displayImage(imageData));
};

// Capture and save image
clickBtn.addEventListener("click", () => {
  let ctx = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  // drawImage syntax: ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = canvas.toDataURL("image/png");
  let savedImages = JSON.parse(localStorage.getItem("images")) || [];
  savedImages.push(imageData);
  localStorage.setItem("images", JSON.stringify(savedImages));

  displayImage(imageData);
});

// Display Image function
function displayImage(imageData) {
  let imgContainer = document.createElement("div");
  imgContainer.classList.add("image-container");

  let img = document.createElement("img");
  img.setAttribute("src", imageData);
  img.classList.add("captured-img");

  // Full-screen image feature
  img.addEventListener("click", () => {
    let fullScreenWrapper = document.createElement("div");
    fullScreenWrapper.classList.add("full-screen-wrapper");

    let fullScreenImg = document.createElement("img");
    fullScreenImg.src = imageData;
    fullScreenImg.classList.add("fullScreenImage");

    let closeBtn = document.createElement("button");
    closeBtn.innerHTML = "❌";
    closeBtn.classList.add("full-screen-close-btn");

    closeBtn.addEventListener("click", () => {
      fullScreenWrapper.remove();
    });

    fullScreenWrapper.appendChild(fullScreenImg);
    fullScreenWrapper.appendChild(closeBtn);
    document.body.appendChild(fullScreenWrapper);
  });

  // Delete button
  let deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.addEventListener("click", () => {
    imgContainer.remove();
    removeImageFromStorage(imageData);
  });

  imgContainer.appendChild(img);
  imgContainer.appendChild(deleteBtn);
  myDiv.appendChild(imgContainer);
  //for download image
  let downloadImage = document.createElement("button");
  let anchorTag = document.createElement("a");
  anchorTag.style.textDecoration = "none";
  downloadImage.textContent = "Download";
  downloadImage.classList.add("downloadBtn");
  anchorTag.appendChild(downloadImage);
  anchorTag.setAttribute("href", imageData);
  anchorTag.setAttribute("download", "");
  imgContainer.appendChild(anchorTag);
}

// Remove image from localStorage
function removeImageFromStorage(imageData) {
  let savedImages = JSON.parse(localStorage.getItem("images")) || [];
  let index = savedImages.indexOf(imageData);
  if (index !== -1) {
    savedImages.splice(index, 1);
    localStorage.setItem("images", JSON.stringify(savedImages));
  }
}

startVideo();
