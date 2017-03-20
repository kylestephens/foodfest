export class CONSTANT {

  /**
   * Event message definitions
   * Publish messages based on these enums
   * instead of passing around strings
   */
  static readonly EVENT = {

    // Event messages coming from AccountService
    SESSION: {
      LOGGED_IN:            'loggedInStatus'
    },

    // Event messages coming from MessagingService
    MESSAGING: {
      SHOW_MESSAGE:         'showMessage',
      HIDE_ALL_MESSAGES:    'hideMessageAll',
      HIDE_MESSAGE_BY_REF:  'hideMessageByRef'
    },

    // ModalService event constants
    MODAL: {
      SHOW_MODAL:           'showModal',
      HIDE_MODAL:           'hideModal'
    }

  };

  /**
   * Modal configuration
   * Settings, types, etc.
   */
  static readonly MODAL = {

    SIGN_IN:                'signIn',
    SIGN_UP:                'signUp',
    MIN_HEIGHT:             400

  };

  /**
   * Admin section route paths
   */
  static readonly ADMIN = {

    DASHBOARD:              'dashboard',
    PROFILE:                'profile',
    MY_ADS:                 'my-ads',
    MESSAGES:               'messages',
    SAVED_ADS:              'saved-ads',
    SAVED_SEARCHES:         'saved-searches'

  };

  /**
   * Messages types
   * Used by MessagingService and messages directive
   */
  static readonly MESSAGING = {

    INFO:                   'info',
    WARNING:                'warning',
    SUCCESS:                'success',
    ERROR:                  'error',
    DEFAULT_DURATION:       6000

  };

  /**
   * Local Storage variables
   */
  static readonly LOCALSTORAGE = {

    SESSION:                'session',
    TOKEN:                  'token'

  };

};
