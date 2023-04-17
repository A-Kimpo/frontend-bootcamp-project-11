import uniqueId from 'lodash/uniqueId.js';

export default (data, feeds = []) => {
  const parser = new DOMParser();

  const xmlDocument = parser.parseFromString(data, 'text/xml');

  const rss = xmlDocument.querySelector('rss');
  if (!rss) throw new Error('emptyRSS');

  const channel = xmlDocument.querySelector('channel');

  const feedTitle = channel.querySelector('title').textContent;
  const feedDescription = channel.querySelector('description').textContent;

  const hasFeedId = feeds.find((feed) => (feed.title === feedTitle ? feed.id : null));

  const feedId = hasFeedId || uniqueId();

  const feed = {
    id: feedId,
    title: feedTitle,
    description: feedDescription,
  };

  const items = channel.querySelectorAll('item');
  const posts = [];

  items.forEach((item) => {
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').innerHTML
      .replace('img', 'img style="width: 450px"');

    const link = item.querySelector('link').textContent;

    posts.push({
      id: uniqueId(),
      title,
      description,
      link,
      feedId,
    });
  });

  const parsedData = {
    feed,
    posts,
  };

  return parsedData;
};
