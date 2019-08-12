import formatErrors from "./formatErrors";

export default fn => (...args) =>
  fn(...args).catch(err => {
    // eslint-disable-next-line no-console
    console.log(err);
    return formatErrors(err);
  });
