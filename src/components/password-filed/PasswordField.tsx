import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { FormikHandlers } from 'formik';
import React, { useState } from 'react';

type PasswordFieldType = {
  name: string;
  placeholder: string;
  value: string;
  onBlur: FormikHandlers['handleBlur'];
  onChange: FormikHandlers['handleChange'];
};

export default function PasswordField({ name, placeholder, value, onBlur, onChange }: PasswordFieldType) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  return (
    <TextField
      fullWidth
      name={name}
      type={showPassword ? 'text' : 'password'}
      placeholder={placeholder}
      value={value}
      onBlur={onBlur}
      onChange={onChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              size="large"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
}
