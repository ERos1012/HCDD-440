document.addEventListener("DOMContentLoaded", function () {
  const flashcardForm = document.getElementById("flashcardForm");
  const flipButton = document.getElementById("flipButton");

  flashcardForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const text = document.getElementById("text").value;
    const loading = document.getElementById("loading");
    const flashcardText = document.getElementById("flashcardText");
    const flashcardInner = document.getElementById("flashcardInner");
    const errorDiv = document.getElementById("error");
    const imagePlaceholder = document.getElementById("imagePlaceholder");
    const generatedImage = document.getElementById("generatedImage");

    // Clear previous results and errors
    errorDiv.classList.add("hidden");
    errorDiv.innerText = '';
    generatedImage.classList.add("hidden"); // Initially hide the image
    imagePlaceholder.classList.remove("hidden");
    flashcardInner.classList.remove("flipped");

    // Set the text on the front of the card
    flashcardText.innerText = text;

    // Show loading message
    loading.classList.remove("hidden");

    try {
      const prompt = encodeURIComponent(text);
      const url = `https://image.pollinations.ai/prompt/${prompt}?width=512&height=512&nologo=true`;

      // Fetching the image as a binary file
      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // Convert the response to a Blob (binary large object)
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      // Hide loading, show image on the back of the card
      loading.classList.add("hidden");
      generatedImage.src = imageUrl;
      generatedImage.classList.remove("hidden"); 
      imagePlaceholder.classList.add("hidden");

      // Prepare the image for uploading to backend (saving the file)
      const formData = new FormData();
      formData.append("image", blob, "generated-image.jpg");

      // Send the image blob to the backend for saving
      const uploadResponse = await fetch("http://localhost:3000/upload-image", {
        method: "POST",
        body: formData,
      });

      const uploadResult = await uploadResponse.json();

      if (uploadResponse.ok) {
        console.log("Image saved successfully at: ", uploadResult.imagePath);
      } else {
        throw new Error("Failed to upload image.");
      }

    } catch (error) {
      // Hide loading, show error message
      loading.classList.add("hidden");
      errorDiv.classList.remove("hidden");
      errorDiv.innerText = `Failed to generate or upload image: ${error.message}`;
    }
  });

  // Flip functionality on button click
  flipButton.addEventListener("click", function () {
    const flashcardInner = document.getElementById("flashcardInner");
    flashcardInner.classList.toggle("flipped");
  });
});
