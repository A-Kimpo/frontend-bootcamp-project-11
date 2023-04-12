import state from './view.js';
import validate from './validate.js';

export default () => {
  const form = document.querySelector('.rss-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    validate(url, state.usedUrls)
      .then(() => {
        state.usedUrls.push(url);
        state.errors = [];
      })
      .catch((err) => {
        state.errors = err.message;
      });

    form.reset();
    form.focus();
  });
};
