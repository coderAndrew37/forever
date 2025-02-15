import { baseUrl } from "./constants.js";
import { showToast } from "./utils/toast.js";

const modal = document.getElementById("testimonialModal");
const closeModalButton = document.getElementById("closeTestimonialModal");
const openModalButton = document.getElementById("openTestimonialModal");
const photoInput = document.getElementById("testimonialPhoto");
const videoInput = document.getElementById("testimonialVideo");
const videoPreviewContainer = document.getElementById("videoPreviewContainer");
const videoPreview = document.getElementById("videoPreview");
const removeVideoBtn = document.getElementById("removeVideo");

// ✅ Open & Close Modal
openModalButton.addEventListener("click", () => {
  modal.classList.remove("hidden");
});
closeModalButton.addEventListener("click", closeModal);

// ✅ Close on Clicking Outside or Pressing ESC
window.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

// ✅ Close Modal Function
function closeModal() {
  modal.classList.add("hidden");
  document.getElementById("testimonialForm").reset();
  removeVideoPreview();
}

// ✅ Restrict User to Either Photo or Video
photoInput.addEventListener("change", () => {
  if (photoInput.files.length > 0) {
    videoInput.value = "";
    removeVideoPreview();
  }
});
videoInput.addEventListener("change", () => {
  if (videoInput.files.length > 0) {
    photoInput.value = "";
    showVideoPreview(videoInput.files[0]);
  }
});

// ✅ Show Video Preview
function showVideoPreview(file) {
  const fileURL = URL.createObjectURL(file);
  videoPreview.src = fileURL;
  videoPreviewContainer.classList.remove("hidden");
}

// ✅ Remove Video Preview
function removeVideoPreview() {
  videoPreview.src = "";
  videoPreviewContainer.classList.add("hidden");
  videoInput.value = "";
}

// ✅ Handle Removing Video Manually
removeVideoBtn.addEventListener("click", removeVideoPreview);

// ✅ Load FFmpeg when needed (Only if video is uploaded)
async function loadFFmpeg() {
  return new Promise((resolve) => {
    if (window.FFmpeg) {
      resolve(window.FFmpeg);
    } else {
      showToast("Loading video processing library...", "info");
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/ffmpeg.js/0.10.1/ffmpeg.min.js";
      script.onload = () => resolve(window.FFmpeg);
      document.body.appendChild(script);
    }
  });
}

// ✅ Compress Video Before Upload
async function compressVideo(videoFile) {
  const ffmpeg = await loadFFmpeg();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async function (event) {
      const videoData = new Uint8Array(event.target.result);
      const result = ffmpeg({
        MEMFS: [{ name: "input.mp4", data: videoData }],
        arguments: [
          "-i",
          "input.mp4",
          "-vf",
          "scale=1280:-1",
          "-b:v",
          "1M",
          "output.mp4",
        ],
        TOTAL_MEMORY: 100000000,
      });

      const output = result.MEMFS.find((file) => file.name === "output.mp4");
      if (!output) return reject("Compression failed");

      resolve(new Blob([output.data], { type: "video/mp4" }));
    };
    reader.readAsArrayBuffer(videoFile);
  });
}

// ✅ Submit Testimonial
document
  .getElementById("submitTestimonial")
  .addEventListener("click", async (event) => {
    event.preventDefault();

    const name = document.getElementById("testimonialName").value.trim();
    const text = document.getElementById("testimonialText").value.trim();
    const rating = parseInt(
      document.getElementById("testimonialRating").value,
      10
    );
    const photoFile = photoInput.files[0];
    const videoFile = videoInput.files[0];

    // ✅ Ensure only one file type is selected
    if (photoFile && videoFile) {
      showToast("Please select either a photo or a video, not both.", "error");
      return;
    }

    if (!name || !text || isNaN(rating) || rating < 3 || rating > 5) {
      showToast(
        "Please fill all fields correctly. Only 3★ and above allowed.",
        "error"
      );
      return;
    }

    // ✅ Validate file size (Max: 5MB for photo, 50MB for video)
    if (photoFile && photoFile.size > 5 * 1024 * 1024) {
      showToast("Image file is too large. Max size: 5MB.", "error");
      return;
    }
    if (videoFile && videoFile.size > 50 * 1024 * 1024) {
      showToast("Video file is too large. Max size: 50MB.", "error");
      return;
    }

    // ✅ Compress Video if Selected
    let finalVideoFile = videoFile;
    if (videoFile) {
      showToast("Compressing video, please wait...", "info");
      try {
        finalVideoFile = await compressVideo(videoFile);
        showToast("Video compression successful!", "success");
      } catch (error) {
        showToast("Video compression failed.", "error");
        return;
      }
    }

    // ✅ Prepare Form Data
    const formData = new FormData();
    formData.append("name", name);
    formData.append("text", text);
    formData.append("rating", rating);
    if (photoFile) formData.append("photo", photoFile);
    if (finalVideoFile) formData.append("video", finalVideoFile);

    try {
      const response = await fetch(`${baseUrl}/api/testimonials`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        showToast("Thank you! Your review is pending approval.", "success");

        setTimeout(() => {
          closeModal();
        }, 2000);
      } else {
        showToast("Error: " + result.error, "error");
      }
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      showToast("Something went wrong. Please try again.", "error");
    }
  });
