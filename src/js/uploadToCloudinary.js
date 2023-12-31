const cloudName = "lost-and-found-startup";
const unsignedPreset = "mobile-uploads";

const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

// todo can i do signed upload (with credentials??)

/**
 * @returns {Promise<string?>} url of the hosted image, or null if err.
 */
export default async function uploadToCloudinary(filedata) {
  const formData = new FormData();
  formData.append("file", filedata);
  formData.append("upload_preset", unsignedPreset);

  try {
    const res = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    const { error, secure_url } = await res.json();

    if (error) throw error;

    return secure_url;
  } 
  catch (err) {
    console.error("could not upload to cloudinary:", err.message);
    return null;
  }

  // see response structure at
  // https://cloudinary.com/documentation/image_upload_api_reference#upload_response
}
