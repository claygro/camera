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
}

// Remove image from localStorage
function removeImageFromStorage(imageData) {
  let savedImages = JSON.parse(localStorage.getItem("images")) || [];
  savedImages = savedImages.filter((img) => img !== imageData);
  localStorage.setItem("images", JSON.stringify(savedImages));
}

startVideo();
