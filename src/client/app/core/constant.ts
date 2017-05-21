import { CommonConstants } from 'foodfest-common/constants';

export class CONSTANT extends CommonConstants {

  /**
   * Event message definitions
   * Publish messages based on these enums
   * instead of passing around strings
   */
  static readonly EVENT = {

    // Event messages coming from AccountService
    SESSION: {
      LOGGED_IN:            'loggedInStatus',
      USER_TYPE:            'userType'
    },

    // Event messages coming from MessagingService
    MESSAGING: {
      SHOW_MESSAGE:         'showMessage',
      HIDE_ALL_MESSAGES:    'hideMessageAll',
      HIDE_MESSAGE_BY_REF:  'hideMessageByRef'
    },

    // LoaderService event constants
    LOADER: {
      SHOW_LOADER:           'showLoader',
      HIDE_LOADER:           'hideLoader'
    },

    // ModalService event constants
    MODAL: {
      SHOW_MODAL:           'showModal',
      HIDE_MODAL:           'hideModal'
    },

    // Event messages from create listing screens
    CREATE_LISTING: {
      NEXT_STEP:            'nextStep',
      PREVIOUS_STEP:        'previousStep',
      PREVIEW_LISTING:      'previewListing'
    },

    // Event messages from create market screens
    CREATE_MARKET: {
      NEXT_STEP:            'nextStep',
      PREVIOUS_STEP:        'previousStep'
    }
  };

  /**
   * Modal configuration
   * Settings, types, etc.
   */
  static readonly MODAL = {

    SIGN_IN:                'signIn',
    SIGN_UP:                'signUp',
    CONFIRM:                'confirm',
    SEND_MSG:               'sendMsg',
    FORGOT_PASSWORD:        'forgotPassword',
    ILLUSTRATION_IMG:       'imageIllustration',
    ILLUSTRATION_COVER:     'coverIllustration',
    ILLUSTRATION_LOGO:      'logoIllustration',
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

    COOKIES:                'cookies.accepted',
    FAVOURITES:             'favourites',
    SESSION:                'session',
    TOKEN:                  'token',
    SETTINGS:               'settings',
    LISTING_EDIT:           'listing.edit',
    LISTING_STEP_ONE:       'listing.step.1',
    LISTING_STEP_TWO:       'listing.step.2',
    LISTING_STEP_THREE:     'listing.step.3',
    LISTING_STEP_FOUR:      'listing.step.4',
    LISTING_STEP_FIVE:      'listing.step.5',
    LISTING_ADDRESS:        'listing.address',
    VENDOR_ID:              'vendorId',
    VENDOR_IMAGES:          'vendorImages'

  };

  static readonly ERRORS = {
    UNEXPECTED_ERROR:  'An unexpected error has occurred, try again later'
  }

  /**
   * Search results order by options
   */
  static readonly SEARCH_RESULTS_SORT = ['name', 'newest', 'oldest', 'rating'];

  static readonly TIME_SLOTS = [
    '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
    '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM',
    '10:00 PM', '10:30 PM', '11:00 PM', '12:00 AM'
  ]

};
