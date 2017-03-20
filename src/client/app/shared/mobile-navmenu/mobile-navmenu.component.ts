import { Component, OnInit } from '@angular/core';

import { ModalService } from '../../services/modal.service';

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

  constructor(private modalService: ModalService) {}

  private menuButton: HTMLElement = null;
  private menuContent: HTMLElement = null;

  // TODO : implement AccountService
  // public loggedIn: boolean = AccountService.isLoggedIn();
  public loggedIn: boolean = false;

  /**
   * Resize the menu to fit screen OnInit
   */
  ngOnInit() {
    window.onresize = () => { this.resizeMenu() };
    this.resizeMenu();
    this.menuButton = document.getElementById('menu-button');
    this.menuContent = document.getElementById('menu-content');
  }

  // TODO
  // $rootScope.$on('loggedInStatus', function(event, loggedIn) {
  //   $scope.loggedIn = loggedIn;
  // });

  public signUp = function() {
    this.toggleMenu();
    this.modalService.show('SignUp');
  }

  public signIn = function() {
    this.toggleMenu();
    this.modalService.show('SignIn');
  }

  public toggleMenu = function() {
    this.menuButton.classList.toggle('menu-open');
    this.menuContent.classList.toggle('active');
  }

  private resizeMenu() {
    // TODO - Implement SettingsService
    //SettingsService.syncBrowserDetails();
    //var screen = SettingsService.getBrowserDetails().screen;

    // this.menuContent.style.width = parseInt(screen.width * 0.75) + 'px';
    // this.menuContent.style.height = screen.height + 'px';
    // this.menuContent.style.marginLeft = '-' + (screen.width * 0.75) + 'px';
  }

};
