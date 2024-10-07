import { useState } from 'react';

type uploadImageHook = {
  imagePreview: string | null;
  imageSize: boolean;
  imageFileName: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, setFieldValue: any) => Promise<void>;
};

const useUploadImage = (getPreSignedUrl: any): uploadImageHook => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<boolean>(false);
  const [imageFileName, setImageFileName] = useState<string | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, setFieldValue: any): Promise<void> => {
    const file = e.target.files?.[0];

    // Check if image size exceeds 200KB
    if (file && file.size > 200000) {
      setImageSize(true);
      return;
    }

    setImageSize(false);

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);

      try {
        // Fetch the pre-signed URL from your server
        const preSignedUrlResponse = await getPreSignedUrl({
          variables: {
            input: {
              contentType: file.type,
              method: 'PUT',
              path: file.name
            }
          }
        });

        const { url } = preSignedUrlResponse.data.getPreSignedUrl;

        // Upload image to the pre-signed URL using PUT request
        const uploadResponse = await fetch(url, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type
          }
        });

        if (uploadResponse.ok) {
          setFieldValue(fieldName, `temp/${file.name}`);
          setImageFileName(file.name);
        } else {
          throw new Error('Failed to upload image');
        }
      } catch (error) {
        console.error('Failed to upload image', error);
      }
    }
  };

  return {
    imagePreview,
    imageSize,
    imageFileName,
    handleImageChange
  };
};

export default useUploadImage;
