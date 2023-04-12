import { string } from 'yup';

export default (url, usedUrls) => {
  const schema = string().required().matches(/\.(rss|xml)$/).notOneOf(usedUrls);
  return schema.validate(url).then(() => null).catch((err) => {
    throw err;
  });
};
