import axios from 'axios';

import state from './view.js';
import validate from './validate.js';
import parser from './parser.js';

const getLoadData = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`, { timeout: 5000 })
  .then((response) => {
    if (response.status === 200 && response.data.contents !== null) {
      return response;
    } throw new Error('networkError');
  });

export default () => {
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
      .then((response) => parser(response.data.contents, state.feeds))
      .then((parsedData) => {
        state.feeds.unshift(parsedData.feed);
        state.posts = [...parsedData.posts, ...state.posts];
        state.status = 'loaded';
      })
      .catch((err) => {
        if (err.message === 'Network Error') {
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
      });

    form.reset();
    form.focus();

    state.status = 'filling';
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
};
