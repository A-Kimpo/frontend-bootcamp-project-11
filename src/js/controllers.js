import axios from 'axios';
import _ from 'lodash';

import state from './view.js';
import validate from './validate.js';
import parser from './parser.js';

const getLoadData = (url) => axios.get(
  `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`,
  { timeout: 5000 },
);

const handlerError = (err, url) => {
  if (err.message === 'Network Error' || err.message === 'timeout of 5000ms exceeded') {
    state.error = 'networkError';
    state.status = 'filling';
    state.usedUrls = state.usedUrls.filter((elem) => elem !== url);
    return;
  }

  if (err.message === 'emptyRSS') {
    state.error = err.message;
    state.status = 'filling';
    state.usedUrls = state.usedUrls.filter((elem) => elem !== url);
    return;
  }

  state.error = err.message;
};

const updatePosts = () => {
  const posts = state.usedUrls.map((url) => getLoadData(url)
    .then((response) => parser(response.data.contents, state.feeds))
    .then((parsedData) => {
      const newPosts = _.differenceWith(
        parsedData.posts,
        state.posts,
        (newPost, statePost) => newPost.title === statePost.title,
      );
      state.posts = [...newPosts, ...state.posts];
    })
    .catch(() => null));

  Promise.all(posts)
    .then(() => setTimeout(() => updatePosts(), 5000));
};

export default () => {
  state.status = 'filling';

  const form = document.querySelector('.rss-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');

    validate(url, state.usedUrls)
      .then((validatedUrl) => {
        state.usedUrls.push(validatedUrl);
        state.error = '';
        state.status = 'loading';
        return getLoadData(validatedUrl);
      })
      .then((response) => parser(response.data.contents))
      .then((parsedData) => {
        state.feeds.unshift(parsedData.feed);
        state.posts = [...parsedData.posts, ...state.posts];
        state.status = 'loaded';
      })
      .then(() => updatePosts())
      .catch((err) => handlerError(err, url));

    form.reset();
    form.focus();
  });

  const changeLanguageButton = document.querySelector('#changeLng');
  changeLanguageButton.addEventListener('click', ({ target }) => {
    switch (target.dataset.locale) {
      case 'ruButton': {
        state.localization.changeLanguage('ru');
        state.lng = 'ru';
        break;
      }

      case 'enButton': {
        state.localization.changeLanguage('en');
        state.lng = 'en';
        break;
      }

      default:
        break;
    }
  });

  const postsField = document.querySelector('.posts');

  postsField.addEventListener('click', ({ target }) => {
    const targetId = target.dataset.id;

    if (targetId) state.seenPosts.add(targetId);

    if (target.dataset.bsToggle === 'modal') {
      const postById = state.posts.find((post) => post.id === targetId);

      state.modal = {
        title: postById.title,
        description: postById.description,
        link: postById.link,
      };
    }
  });
};
