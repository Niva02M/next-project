import { isArray, isString } from 'lodash';
import useSuccErrSnack from './useSuccErrSnack';
import { ApolloError } from '@apollo/client';

/**
 * This function is used to format the error message that comes from the backend
 * @param error - The error message that comes from the backend
 * @returns - The formatted error message
 * @example
 * const error = 'availability.1.consultation fee must be atleast 50';
 * const formattedError = formatErrWithArrayIndex(error);
 * console.log(formattedError); // Output: consultation fee must be atleast 50
 */
const formatErrWithArrayIndex = (error: string) => {
  if (error.includes('.')) {
    let parts = error.split('.'); // Split the string by ':'
    let lastElement = parts[parts.length - 1]; // Access the last element

    return lastElement;
  }
  return error;
};

const useListBackendErrors = () => {
  const { errorSnack } = useSuccErrSnack();
  const handleError = (err: any, defaultMessage = 'Something went wrong') => {
    if (err instanceof ApolloError) {
      const { graphQLErrors } = err;
      if (graphQLErrors) {
        const error = graphQLErrors?.[0];
        const errorProperty = (error?.extensions as any)?.response?.message;
        if (errorProperty) {
          if (isArray(errorProperty)) {
            for (const error of errorProperty) {
              errorSnack(formatErrWithArrayIndex(error));
              return;
            }
          }
          if (isString(errorProperty)) {
            errorSnack(formatErrWithArrayIndex(errorProperty));
            return;
          }
        }
      }
    }
    const message = err.message || defaultMessage;
    errorSnack(message);
    return;
  };

  const formatNextAuthError = (res: any, fallbackMessage = 'Something went wrong') => {
    try {
      const errorMessage = res?.error?.split(':');
      if (errorMessage.length > 1) {
        return errorMessage[errorMessage.length - 1];
      }
      return fallbackMessage;
    } catch (error) {
      return fallbackMessage;
    }
  };

  return { handleError, formatNextAuthError };
};

export default useListBackendErrors;
