import controllers from './controllers.js';
import state from './view.js';

export default (i18nInstance) => {
  state.localization = i18nInstance;
  state.lng = 'ru';

  controllers();
};
