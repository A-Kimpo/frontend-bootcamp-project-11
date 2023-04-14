import axios from 'axios';

import state from './view.js';
import validate from './validate.js';
import parser from './parser.js';

const getLoadData = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .then((response) => {
    if (response.status === 200 && response.data.contents !== null) {
      return response;
    } throw new Error('RSS not found');
  });

export default () => {
  const form = document.querySelector('.rss-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');

    validate(url, state.usedUrls, state.localization)
      .then((validatedUrl) => {
        state.usedUrls.push(validatedUrl);
        state.error = '';
        return validatedUrl;
      })
      .then((resultUrl) => getLoadData(resultUrl))
      .then((response) => parser(response.data.contents))
      .then((data) => {
        state.feeds.push(data.feed);
        state.posts = [...state.posts, ...data.posts];
        state.status = 'loaded';
      })
      .catch((err) => {
        state.error = err.message;
      });

    form.reset();
    form.focus();
  });

  const changeLanguageButton = document.querySelector('#changeLng');
  changeLanguageButton.addEventListener('click', () => {
    const lng = state.lng === 'ru' ? 'en' : 'ru';
    state.localization.changeLanguage(lng);
    state.lng = lng;
  });
};
