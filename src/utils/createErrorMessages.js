export default (path, message, errors) => {
  switch (true) {
    case errors.length > 0:
      return {
        success: false,
        errors
      };
    default:
      return {
        success: false,
        errors: [
          {
            path,
            message
          }
        ]
      };
  }
};
