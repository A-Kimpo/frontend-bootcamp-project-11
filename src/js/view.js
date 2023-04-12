import onChange from 'on-change';
import initialState from './initialState.js';

const watchedState = onChange(initialState, (path, value) => {
  const input = document.querySelector('#url-input');
  const form = document.querySelector('.rss-form');
  const parent = form.parentNode;

  switch (path) {
    case 'errors': {
      const errorMessage = parent.querySelector('.feedback') || document.createElement('p');
      errorMessage.className = 'feedback m-0 position-absolute small text-danger';
      errorMessage.textContent = watchedState.errors;

      if (value.length !== 0) {
        input.classList.add('is-invalid');
        parent.append(errorMessage);
      } else if (parent.contains(errorMessage)) {
        parent.removeChild(errorMessage);
      }
      input.classList.remove('is-invalid');
      break;
    }

    default: break;
  }
  return null;
});

export default watchedState;
