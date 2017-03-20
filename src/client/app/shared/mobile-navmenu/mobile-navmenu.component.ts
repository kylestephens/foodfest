import { Component, OnInit }    from '@angular/core';

import { AccountService }       from '../../services/account.service';
import { ModalService }         from '../../services/modal.service';
import { SettingsService }      from '../../services/settings.service';

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'mobile-navmenu',
  templateUrl: 'mobile-navmenu.component.html',
  styleUrls: ['mobile-navmenu.component.css'],
})

export class MobileNavmenuComponent implements OnInit {

  private menuButton: HTMLElement = null;
  private menuContent: HTMLElement = null;

  constructor(
    private accountService: AccountService,
    private modalService: ModalService,
    private settingsService: SettingsService
  ) {}

  public loggedIn: boolean = false;

  /**
   * Resize the menu to fit screen OnInit
   */
  ngOnInit() {
    this.loggedIn = this.accountService.isLoggedIn();
    this.menuButton = document.getElementById('menu-button');
    this.menuContent = document.getElementById('menu-content');
    this._resizeMenu();
    window.onresize = () => { this._resizeMenu(); };
  }

  // TODO
  // $rootScope.$on('loggedInStatus', function(event, loggedIn) {
  //   $scope.loggedIn = loggedIn;
  // });

  public signUp = function() {
    this.toggleMenu();
    this.modalService.show('SignUp');
  };

  public signIn = function() {
    this.toggleMenu();
    this.modalService.show('SignIn');
  };

  public toggleMenu = function() {
    this.menuButton.classList.toggle('menu-open');
    this.menuContent.classList.toggle('active');
  };

  private _resizeMenu() {
    this.settingsService.syncBrowserDetails();
    var screen = this.settingsService.getBrowserDetails().screen;

    this.menuContent.style.width = parseInt(screen.width * 0.75) + 'px';
    this.menuContent.style.height = screen.height + 'px';
    this.menuContent.style.marginLeft = '-' + (screen.width * 0.75) + 'px';
  };

};
