import onChange from 'on-change';
import initialState from './initialState.js';

const watchedState = onChange(initialState, (path, value) => {
  const elements = {
    title: document.querySelector('#title'),
    underTitle: document.querySelector('.lead'),
    labelForInput: document.querySelector('[for="url-input"]'),
    example: document.querySelector('[name="example"]'),
    button: document.querySelector('[type="submit"]'),
    lngButton: document.querySelector('#changeLng'),
  };

  const form = document.querySelector('.rss-form');
  const message = document.querySelector('.feedback') || document.createElement('p');
  const input = document.querySelector('#url-input');

  switch (path) {
    case 'error': {
      message.className = 'feedback m-0 position-absolute small text-danger';
      message.textContent = watchedState.localization.t(`errors.${watchedState.error}`);

      const parent = form.parentNode;

      if (value.length !== 0) {
        input.classList.add('is-invalid');
        parent.append(message);
      } else if (parent.contains(message)) {
        input.classList.remove('is-invalid');
        parent.removeChild(message);
      }

      break;
    }

    case 'lng': {
      Object.entries(elements).forEach(([key, valueEl]) => {
        const element = valueEl;
        element.textContent = watchedState.localization.t(`interfaceTexts.${key}`);
      });

      if (watchedState.error.length !== 0) {
        message.textContent = watchedState.localization.t(`errors.${watchedState.error}`);
      }
      break;
    }

    case 'status': {
      const parent = form.parentNode;
      if (watchedState.status === 'loaded') {
        message.className = 'feedback m-0 position-absolute small text-success';
        message.textContent = 'RSS loaded success';
        parent.append(message);

        const postsField = document.querySelector('.posts');
        const feedsField = document.querySelector('.feeds');

        const feedsList = document.createElement('ul');
        watchedState.feeds.forEach((feed) => {
          const feedEl = document.createElement('li');

          const feedTitle = document.createElement('h3');
          feedTitle.textContent = feed.feedTitle;

          const feedDescription = document.createElement('h3');
          feedDescription.textContent = feed.feedDescription;

          feedEl.append(feedTitle);
          feedEl.append(feedDescription);

          feedsList.append(feedEl);
        });
        feedsField.append(feedsList);

        const postsList = document.createElement('ul');
        watchedState.posts.forEach((post) => {
          const postEl = document.createElement('li');

          const postTitle = document.createElement('h3');
          postTitle.textContent = post.postTitle;

          const postDescription = document.createElement('h3');
          postDescription.textContent = post.postDescription;

          postEl.append(postTitle);
          postEl.append(postDescription);

          postsList.append(postEl);
        });
        postsField.append(postsList);
      }

      break;
    }

    default: break;
  }

  return null;
});

export default watchedState;
