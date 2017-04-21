/*
Class for users. It corresponds to userModel in service plus extra parameters.
*/
export class User {
  id:                 number;
  email:              string;
  user_type:          number;
  password:           string;
  google_user_id:     string;
  facebook_user_id:   string;
  firstname:          string;
  middlename:         string;
  lastname:           string;
  location_id:        number;
  date_joined:        any;
  last_updated:       any;
  last_login:         any;

  name:               string;
  facebookLogin:      boolean;
  googleLogin:        boolean;
  akAccessToken:      string;
}

