import { string, setLocale } from 'yup';

export default (url, usedUrls) => {
  setLocale({
    mixed: {
      notOneOf: 'existingUrl',
      required: 'emptyInput',
    },
    string: {
      url: 'invalidUrl',
    },
  });

  const normilizeUrl = url.trim();

  const schema = string()
    .required()
    .url()
    .notOneOf(usedUrls);

  return schema.validate(normilizeUrl)
    .then(() => normilizeUrl)
    .catch((err) => {
      throw err;
    });
};
