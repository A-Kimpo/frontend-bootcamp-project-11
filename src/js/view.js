import onChange from 'on-change';
import initialState from './initialState.js';

const renderFeeds = (elements) => {
  const feedsField = document.querySelector('.feeds');

  const inner = document.createElement('div');
  inner.className = 'card border-0';

  const listTitleContainer = document.createElement('div');
  listTitleContainer.className = 'card-body';

  const listTitle = document.createElement('h2');
  listTitle.className = 'card-title h4';
  listTitle.textContent = 'Фиды';

  const list = document.createElement('ul');
  list.className = 'list-group border-0 rounded-0';

  elements.forEach((element) => {
    const listEl = document.createElement('li');
    listEl.className = 'list-group-item border-0 border-end-0';

    const elTitle = document.createElement('h3');
    elTitle.className = 'h6 m-0';
    elTitle.textContent = element.title;

    const elDescription = document.createElement('p');
    elDescription.className = 'm-0 small text-black-50';
    elDescription.textContent = element.description;

    listEl.append(elTitle);
    listEl.append(elDescription);

    list.append(listEl);
  });
  listTitleContainer.append(listTitle);

  inner.append(listTitleContainer);
  inner.append(list);

  feedsField.textContent = '';
  feedsField.append(inner);
};

const renderPosts = (elements) => {
  const postsField = document.querySelector('.posts');

  const inner = document.createElement('div');
  inner.className = 'card border-0';

  const listTitleContainer = document.createElement('div');
  listTitleContainer.className = 'card-body';

  const listTitle = document.createElement('h2');
  listTitle.className = 'card-title h4';
  listTitle.textContent = 'Посты';

  const list = document.createElement('ul');
  list.className = 'list-group border-0 rounded-0';

  elements.forEach((element) => {
    const listEl = document.createElement('li');
    listEl.className = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0';

    const elLink = document.createElement('a');
    elLink.setAttribute('href', element.link);
    elLink.className = 'fw-bold';
    elLink.setAttribute('data-id', element.id);
    elLink.setAttribute('target', '_blank');
    elLink.setAttribute('rel', 'noopener noreferrer');
    elLink.textContent = element.title;

    const elButton = document.createElement('button');
    elButton.setAttribute('type', 'button');
    elButton.className = 'btn btn-outline-primary btn-sm';
    elButton.setAttribute('data-id', element.id);
    elButton.setAttribute('data-bs-toggle', 'modal');
    elButton.setAttribute('data-bs-target', '#modal');
    elButton.textContent = 'Просмотр';

    listEl.append(elLink);
    listEl.append(elButton);

    list.append(listEl);
  });
  listTitleContainer.append(listTitle);

  inner.append(listTitleContainer);
  inner.append(list);

  postsField.textContent = '';
  postsField.append(inner);
};

const watchedState = onChange(initialState, (path, value) => {
  const form = document.querySelector('.rss-form');
  const message = document.querySelector('.feedback');
  const input = document.querySelector('#url-input');
  const button = document.querySelector('[type="submit"]');

  switch (path) {
    case 'error': {
      const parent = form.parentNode;

      if (value.length !== 0) {
        message.classList.remove('text-success');
        message.classList.add('text-danger');
        message.textContent = watchedState.localization.t(`errors.${value}`);

        input.classList.add('is-invalid');
        parent.append(message);
      } else {
        message.classList.remove('text-danger');
        message.textContent = '';

        input.classList.remove('is-invalid');
      }

      break;
    }

    case 'lng': {
      const textElements = document.querySelectorAll('[data-locale]');
      textElements.forEach((textElement) => {
        const keyLocale = textElement.getAttribute('data-locale');
        const interfaceElement = textElement;
        interfaceElement.textContent = watchedState.localization.t(`interfaceTexts.${keyLocale}`);
      });

      if (message.classList.contains('text-danger')) {
        message.textContent = watchedState.localization.t(`errors.${watchedState.error}`);
      }

      if (message.classList.contains('text-success')) {
        message.textContent = watchedState.localization.t('RSSloaded');
      }

      break;
    }

    case 'status': {
      const parent = form.parentNode;

      if (value === 'loading') {
        button.setAttribute('disabled', '');
        button.textContent = watchedState.localization.t('status');

        const spinner = document.createElement('span');
        spinner.className = 'spinner-grow spinner-grow-sm';
        spinner.setAttribute('role', 'status');
        spinner.setAttribute('aria-hidden', 'true');

        button.prepend(spinner);
        message.textContent = '';
      }

      if (value === 'loaded') {
        message.classList.add('text-success');
        message.textContent = watchedState.localization.t('RSSloaded');

        button.removeAttribute('disabled');
        button.textContent = watchedState.localization.t('interfaceTexts.button');

        parent.append(message);
      }

      if (value === 'filling') {
        button.removeAttribute('disabled');
        button.textContent = watchedState.localization.t('interfaceTexts.button');
      }

      break;
    }

    case 'feeds': renderFeeds(value);
      break;

    case 'posts': renderPosts(value);
      break;

    default: break;
  }

  return null;
});

export default watchedState;
