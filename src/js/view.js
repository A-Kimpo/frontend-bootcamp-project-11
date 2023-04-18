import onChange from 'on-change';
import initialState from './initialState.js';

const getListFeeds = (elements) => {
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
  return list;
};

const getListPosts = (state, elements) => {
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

    if (state.seenPosts.has(element.id)) {
      elLink.classList.replace('fw-bold', 'fw-normal');
      elLink.classList.add('link-secondary');

      elButton.classList.replace('btn-outline-primary', 'btn-outline-secondary');
    }

    listEl.append(elLink);
    listEl.append(elButton);

    list.append(listEl);
  });

  return list;
};

const renderList = (list, localeData) => {
  const container = document.querySelector(`.${localeData.keyLocale}`);

  const inner = document.createElement('div');
  inner.className = 'card border-0';

  const listTitleContainer = document.createElement('div');
  listTitleContainer.className = 'card-body';

  const listTitle = document.createElement('h2');
  listTitle.className = 'card-title h4';
  listTitle.setAttribute('data-locale', localeData.keyLocale);
  listTitle.textContent = localeData.listTitleText;

  listTitleContainer.append(listTitle);

  inner.append(listTitleContainer);
  inner.append(list);

  container.textContent = '';
  container.append(inner);
};

const renderLocalization = (state, message) => {
  const feedback = message;

  const textElements = document.querySelectorAll('[data-locale]');
  textElements.forEach((textElement) => {
    const keyLocale = textElement.getAttribute('data-locale');
    const interfaceElement = textElement;
    interfaceElement.textContent = state.localization.t(`interfaceTexts.${keyLocale}`);
  });

  if (message.classList.contains('text-danger')) {
    feedback.textContent = state.localization.t(`errors.${state.error}`);
  }

  if (message.classList.contains('text-success')) {
    feedback.textContent = state.localization.t('RSSloaded');
  }
};

const renderError = (localization, value, message, form) => {
  const parent = form.parentNode;
  const errMessage = message;
  const input = document.querySelector('#url-input');

  if (value.length !== 0) {
    errMessage.classList.remove('text-success');
    errMessage.classList.add('text-danger');
    errMessage.textContent = localization.t(`errors.${value}`);

    input.classList.add('is-invalid');
    parent.append(errMessage);
  } else {
    errMessage.classList.remove('text-danger');
    errMessage.textContent = '';

    input.classList.remove('is-invalid');
  }
};

const renderStatus = (localization, status, message, form) => {
  const button = document.querySelector('[type="submit"]');
  const feedback = message;
  const parent = form.parentNode;

  switch (status) {
    case 'loading': {
      button.setAttribute('disabled', '');
      button.textContent = localization.t('status');

      const spinner = document.createElement('span');
      spinner.className = 'spinner-grow spinner-grow-sm';
      spinner.setAttribute('role', 'status');
      spinner.setAttribute('aria-hidden', 'true');

      button.prepend(spinner);
      feedback.textContent = '';
      break;
    }

    case 'loaded':
      feedback.classList.add('text-success');
      feedback.textContent = localization.t('RSSloaded');

      button.removeAttribute('disabled');
      button.textContent = localization.t('interfaceTexts.button');

      parent.append(feedback);
      break;

    case 'filling':
      button.removeAttribute('disabled');
      button.textContent = localization.t('interfaceTexts.button');
      break;

    default:
      break;
  }
};

const renderModal = (modal) => {
  const title = document.querySelector('.modal-title');
  title.textContent = modal.title;

  const description = document.querySelector('.modal-body');
  description.innerHTML = modal.description;

  const linkReadFull = document.querySelector('.full-article');
  linkReadFull.setAttribute('href', modal.link);
};

const watchedState = onChange(initialState, (path, value) => {
  const form = document.querySelector('.rss-form');
  const message = document.querySelector('.feedback');

  switch (path) {
    case 'lng': renderLocalization(watchedState, message);
      break;

    case 'error': renderError(watchedState.localization, value, message, form);
      break;

    case 'status': renderStatus(watchedState.localization, value, message, form);
      break;

    case 'feeds': {
      const localeData = {
        listTitleText: watchedState.localization.t('interfaceTexts.feeds'),
        keyLocale: 'feeds',
      };
      const listFeeds = getListFeeds(value);

      renderList(listFeeds, localeData);
      break;
    }

    case 'posts': {
      const localeData = {
        listTitleText: watchedState.localization.t('interfaceTexts.posts'),
        keyLocale: 'posts',
      };
      const listPosts = getListPosts(watchedState, value);

      renderList(listPosts, localeData);
      break;
    }

    case 'modal': renderModal(value);
      break;

    case 'seenPosts': value.forEach((id) => {
      const postLink = document.querySelector(`a[data-id="${id}"]`);
      postLink.classList.replace('fw-bold', 'fw-normal');
      postLink.classList.add('link-secondary');

      const postButton = document.querySelector(`button[data-id="${id}"]`);
      postButton.classList.replace('btn-outline-primary', 'btn-outline-secondary');
    });
      break;

    default: break;
  }
});

export default watchedState;
