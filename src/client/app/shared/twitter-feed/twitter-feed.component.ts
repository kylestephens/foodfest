import {
  Component,
  ElementRef,
  Input,
  OnInit
}                                  from '@angular/core';
import { SettingsService }         from '../../services/settings.service';
import { RestService }             from '../../services/rest.service';

@Component({
  moduleId: module.id,
  selector: 'ak-twitter-feed',
  templateUrl: 'twitter-feed.component.html',
  styleUrls: ['twitter-feed.component.css']
})

export class TwitterFeedComponent implements OnInit {

  /**
   * @Input
   * A string representing the full address of user
   * e.g., http://www.twitter.com/ky1e_s
   */
  @Input()
  twitterUrl: string;

  public tweets: any = [];

  constructor(
    private restService: RestService,
    private settingsService: SettingsService
  ) {};

  ngOnInit() {
    let urlSplit = this.twitterUrl.split('/');
    let screenName = urlSplit[urlSplit.length - 1];
    this.restService.get(this.settingsService.getServerBaseUrl() + '/twitter/' + screenName)
      .then((tweets: any) => {
        this.tweets = tweets.json();
      })
      .catch((err: any) => {
        console.dir(err);
      });
  };
};
