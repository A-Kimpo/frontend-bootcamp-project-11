import uniqueId from 'lodash/uniqueId.js';

export default (data) => {
  const parser = new DOMParser();

  const xmlDocument = parser.parseFromString(data, 'text/xml');

  const channel = xmlDocument.querySelector('channel');

  const channelTitle = channel.querySelector('title').textContent;
  const channelDescription = channel.querySelector('description').textContent;
  const channelLink = channel.querySelector('link').nextSibling.textContent.trim();

  const feedId = uniqueId();
  const feed = {
    id: feedId,
    feedTitle: channelTitle,
    feedDescription: channelDescription,
    feedLink: channelLink,
  };

  const items = channel.querySelectorAll('item');
  const posts = [];

  items.forEach((item) => {
    const postTitle = item.querySelector('title').textContent;
    const postDescription = item.querySelector('description').textContent;

    posts.push({
      postTitle,
      postDescription,
      id: uniqueId(),
      feedId,
    });
  });

  const parsedData = {
    feed,
    posts,
  };

  return parsedData;
};
