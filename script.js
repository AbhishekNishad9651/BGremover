document.addEventListener("DOMContentLoaded", () => {
    const uploadArea = document.getElementById("upload_area");
    const imageInput = document.getElementById("ImageInput");
    const removeBtn = document.getElementById("removeBgBtn");
    const resetBtn = document.getElementById("resetBtn");
    const result = document.getElementById("result");
    const galleryContent = document.getElementById("galleryContent");
    let selectedFile = null;

    // Upload the file from user
    uploadArea.addEventListener("click", () => {
        imageInput.click();
    });

    // Drag and drop features
    uploadArea.addEventListener("dragover", (event) => {
        event.preventDefault();
        uploadArea.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
    });

    uploadArea.addEventListener("dragleave", () => {
        uploadArea.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    });

    uploadArea.addEventListener("drop", (event) => {
        event.preventDefault();
        uploadArea.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
        handleFile(event.dataTransfer.files[0]);
    });

    imageInput.addEventListener("change", (event) => {
        handleFile(event.target.files[0]);
    });

    function handleFile(file) {
        if (file && file.type.startsWith("image/")) {
            selectedFile = file;
            const reader = new FileReader();
            reader.onload = () => {
                displayImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please upload a valid image format.");
        }
    }

    function displayImage(imgsrc) {
        result.innerHTML = `<img src="${imgsrc}" alt="Uploaded Image" />`;
    }

    removeBtn.addEventListener("click", async () => {
        if (selectedFile) {
            result.innerHTML = `<p>Processing...</p><div class="loader"></div>`;
            await removeBackground(selectedFile);
        } else {
            alert("Please select an image to remove the background.");
        }
    });

    async function removeBackground(file) {
        const apiKey = "hL7vb6KUHMyg7J127KwXxAsm";
        const formData = new FormData();
        formData.append("image_file", file);
        formData.append("size", "auto");

        try {
            const response = await fetch("https://api.remove.bg/v1.0/removebg", {
                method: "POST",
                headers: {
                    "X-API-Key": apiKey,
                },
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.errors?.[0]?.title || "Failed to remove background.");
            }

            const blob = await response.blob();
            const imageURL = URL.createObjectURL(blob);
            result.innerHTML = `<img src="${imageURL}" alt="Processed Image" />`;
            addDownloadButton(imageURL);
            addToGallery(imageURL);
        } catch (err) {
            result.innerHTML = `<p>Error: ${err.message}</p>`;
        }
    }

    function addDownloadButton(imageURL) {
        const downloadBtn = document.createElement("button");
        downloadBtn.innerHTML = "Download Image";
        downloadBtn.classList.add("btn");
        downloadBtn.addEventListener("click", () => {
            const link = document.createElement("a");
            link.href = imageURL;
            link.download = "background_removed.png";
            link.click();
        });
        result.appendChild(downloadBtn);
    }

    function addToGallery(imageURL) {
        const img = document.createElement("img");
        img.src = imageURL;
        img.alt = "Processed Image";
        img.addEventListener("click", () => {
            window.open(imageURL, "_blank");
        });
        galleryContent.appendChild(img);
    }

    resetBtn.addEventListener("click", () => {
        result.innerHTML = "<p>No image processed yet.</p>";
        imageInput.value = "";
        selectedFile = null;
    });
});