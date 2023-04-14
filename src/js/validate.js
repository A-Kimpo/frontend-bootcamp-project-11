import { string, setLocale } from 'yup';

export default (url, usedUrls) => {
  setLocale({
    mixed: {
      notOneOf: 'notOneOf',
      required: 'required',
    },
    string: {
      url: 'url',
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
