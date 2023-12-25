const cloudName = 'lost-and-found-startup';
const unsignedPreset = 'mobile-uploads';

const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

// todo can i do signed upload (with credentials??)

/**
 * @returns {Promise<string?>} url of the hosted image, or null if error
 */
export default async function uploadToCloudinary(filedata) {

  return 'test--not-url'; // TODO DELETE THIS!

  const formData = new FormData();
  formData.append('file', filedata);
  formData.append('upload_preset', unsignedPreset);

  try {
    const res = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });
    const json = await res.json();
    return json.secure_url;
    // todo also get smaller version? or should we do it on the device?
    // see response structure at
    // https://cloudinary.com/documentation/image_upload_api_reference#upload_response
  } 
  catch (err) {
    return console.error('uploadToCloudinary error:', err.message), null;
  }
}
