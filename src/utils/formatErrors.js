/* eslint-disable no-console */
const formatValidationErrors = err => {
  const errors = [];
  Object.values(err.errors).forEach(error => {
    errors.push({
      path: error.path,
      message: error.message
    });
  });
  return { success: false, errors };
};

const formatTypeError = err => {
  const errors = [];
  errors.push({
    path: "type",
    message: err.message
  });
  return { success: false, errors };
};

export default err => {
  switch (err.name) {
    case "ValidationError":
      return formatValidationErrors(err);
    case "TypeError":
      return formatTypeError(err);
    default:
      console.log(err);
      console.log(err.name);
  }
  return { success: false };
};
