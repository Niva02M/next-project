import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import useUploadImage from '../hooks/useUploadImage';
import Image from 'next/image';
import { useLazyQuery } from '@apollo/client';
import { GET_PRESIGNED_URL } from '../../graphql/queries';
import { CircularProgress, FormHelperText, Typography } from '@mui/material';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
});

export default function InputFileUpload({
  id,
  title,
  name,
  setFieldValue
}: {
  id: string;
  title: string;
  name: string;
  setFieldValue: any;
}) {
  const [getPreSignedUrl, { loading }] = useLazyQuery(GET_PRESIGNED_URL);
  const { imagePreview, imageSize, imageFileName, handleImageChange } = useUploadImage(getPreSignedUrl);
  return (
    <>
      <Button
        component="label"
        role={undefined}
        variant="outlined"
        tabIndex={-1}
        size="large"
        color="inherit"
        sx={{ borderRadius: 0, borderStyle: 'dashed', flexDirection: 'column' }}
      >
        {imagePreview && <Image src={imagePreview} alt="Image Preview" width={150} height={150} />}
        {loading && <CircularProgress />}
        {imageFileName ? <Typography>{`Uploaded file: ${imageFileName}`}</Typography> : <Typography>{title}</Typography>}
        <VisuallyHiddenInput id={id} name={name} type="file" onChange={(event) => handleImageChange(event, name, setFieldValue)} />
      </Button>
      {imageSize && <FormHelperText error>Image size exceeds 200KB!</FormHelperText>}
    </>
  );
}
