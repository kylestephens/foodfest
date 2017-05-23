import { Component, OnDestroy, Input }  from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
}                                       from '@angular/forms';

import { ActivatedRoute,
         Params,
         Router }                      from '@angular/router';

import { AccountService }               from '../services/account.service';
import { MessagingService }             from '../services/messaging.service';
import { ValidationService }            from '../services/validation.service';
import { LeaveReviewService }           from './leave-review.service';

import { CONSTANT }                     from '../core/constant';

/**
 * This class represents leave review for vendor component.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-leave-review',
  templateUrl: 'leave-review.component.html',
  styleUrls: ['leave-review.component.css']
})

export class LeaveReviewComponent {
  public leaveReviewForm: FormGroup;
  public optionList = {
    ONE: 'This vendor served at my event',
    TWO: 'My event hasn\'t happened yet',
    THREE: "I didn't book this vendor"
  };
  vendorName: string;
  vendorId: number;
  reviewedBy: number;
  reviewId: number;
  isLoaded: boolean = false;
  private token: string;
  private invalidUser: boolean = false;


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private messagingService: MessagingService,
    private validationService: ValidationService,
    private leaveReviewService: LeaveReviewService,
    public router: Router
  ) {
    this.leaveReviewForm = fb.group({
      'option': [1, []],
      'review': this.fb.group(this._initLeaveReview())
    });
    this._subscribeToOptionsChange();
  }

  _initLeaveReview(): any {
    let review = {
      'stars': new FormControl(null, Validators.required),
      'reviewText': new FormControl(null, [Validators.maxLength(10000)])
    };
    return review;
  }

  _subscribeToOptionsChange() {
    let optionsControl = (<any>this.leaveReviewForm).controls.option,
        reviewControl = (<any>this.leaveReviewForm).controls.review;

    // subscribe to the stream
    optionsControl.valueChanges.subscribe((option: any) => {
      if(option === 1) {
        Object.keys(reviewControl.controls).forEach(key => {
          reviewControl.controls[key].setValidators(this._initLeaveReview()[key].validator);
          reviewControl.controls[key].updateValueAndValidity();
        });
      }
      else {
        Object.keys(reviewControl.controls).forEach(key => {
          reviewControl.controls[key].setValidators(null);
          reviewControl.controls[key].updateValueAndValidity();
        });
      }
    });
  }

  onClickStars(starsNum: number) {
    (<FormGroup> this.leaveReviewForm.controls['review']).controls['stars'].setValue(starsNum);
  }

  ngOnDestroy() {
    let optionsControl = (<any>this.leaveReviewForm).controls.option;
    optionsControl.valueChanges.unsubscribe();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(
      params => this.token = params.token
    );

    if(!this.token) {
       this.router.navigate(['']);
    }
    this._getDetailsFromEmailToken();
  }

  private _getDetailsFromEmailToken() {
    this.leaveReviewService.getDetailsFromEmailToken({reftoken: this.token}).then(
    (response: any) => {
      this.isLoaded = true;
      this.vendorName = response.review_for;
      this.vendorId = response.vendor_id;
      this.reviewedBy = response.reviewed_by;
      this.reviewId = response.id;
    },
    (reason: any) => {
      this.isLoaded = true;
      this.invalidUser = true;
      let reasonMsg: string = reason.json().msg ? reason.json().msg : null,
          messageText: string = reason.statusText ? reason.statusText : CONSTANT.ERRORS.UNEXPECTED_ERROR;

      if(reasonMsg && reasonMsg === CONSTANT.response_key.error.user.login.NOT_EXIST) messageText = 'Seams like the link is invalid. If you still used one of our vendors, give us a shout.';
      if(reasonMsg && reasonMsg === CONSTANT.response_key.error.REVIEW.WRONG_USER) messageText = 'Seams different user is logged in from the user who was asked for feedback. Please login with correct user to leave the feedback.';

      this.messagingService.show(
        'global',
        CONSTANT.MESSAGING.ERROR,
        messageText
      );
    });
  }

  public submitForm(value: any) {
    if(this.leaveReviewForm.valid) {
      if(!this.invalidUser) {
        this._leaveReview(value);
      }
      else return;
    }
    else {
      for (let i in this.leaveReviewForm.controls) {
        this.leaveReviewForm.controls[i].markAsTouched();

        let childControls = (<FormGroup>this.leaveReviewForm.controls[i]).controls;
        if(childControls) {
          for (let j in childControls) {
            childControls[j].markAsTouched();
          }
        }
      }
    }
  }

  private _leaveReview(value: any) {
    if(value.option === 1) {
      this._addReview(value);
    }
    else if(value.option === 2) {
      this._addReviewReminder(value);
    }
    else if(value.option === 3) {
       this._deleteReview(value);
    }
   }

  private _addReview(value: any) {
    let params = {
      vendorId: this.vendorId,
      starsNum: value.review.stars,
      comment: value.review.reviewText,
      reviewedBy: this.reviewedBy,
      sendReviewEmailId: this.reviewId
    }

    this.leaveReviewService.addReview(params).then(
    (response: any) => {
      this.router.navigate(['']);
      //give time for redirect to work before showing message
      setTimeout(() => {
        this.messagingService.show(
          'global',
          CONSTANT.MESSAGING.SUCCESS,
          'Thank you! You review should be visible once vendor has confirmed the attendace.',
          true
        );
      }, 300);
    },
    (reason: any) => {
      let reasonMsg: string = reason.json().msg ? reason.json().msg : null,
          messageText: string = reason.statusText ? reason.statusText : CONSTANT.ERRORS.UNEXPECTED_ERROR;

      if(reasonMsg && reasonMsg === CONSTANT.response_key.error.user.login.NOT_EXIST) messageText = 'Seams like the link is invalid. If you still used one of our vendors, give us a shout.';
      if(reasonMsg && reasonMsg === CONSTANT.response_key.error.REVIEW.WRONG_USER) messageText = 'Seams different user is logged in from the user who was asked for feedback. Please login with correct user to leave the feedback.';

      this.messagingService.show(
        'global',
        CONSTANT.MESSAGING.ERROR,
        messageText
      );
    });
  }

  private _addReviewReminder(value: any) {
    let params = {
      vendorId: this.vendorId,
      reviewedBy: this.reviewedBy,
      sendReviewEmailId: this.reviewId
    }

    this.leaveReviewService.addReviewReminder(params).then(
    (response: any) => {
      this.router.navigate(['']);
      //give time for redirect to work before showing message
      setTimeout(() => {
        this.messagingService.show(
          'global',
          CONSTANT.MESSAGING.SUCCESS,
          'Thank you! We will remind you to leave a reviewn in a month time.',
          true
        );
      }, 300);
    },
    (reason: any) => {
      this.messagingService.show(
        'global',
        CONSTANT.MESSAGING.ERROR,
        reason.statusText ? reason.statusText : CONSTANT.ERRORS.UNEXPECTED_ERROR
      );
    });
  }

  private _deleteReview(value: any) {
    let params = {
      vendorId: this.vendorId,
      reviewedBy: this.reviewedBy,
      sendReviewEmailId: this.reviewId
    }

    this.leaveReviewService.deleteReviewEmail(params).then(
    (response: any) => {
      this.router.navigate(['']);
      //give time for redirect to work before showing message
      setTimeout(() => {
        this.messagingService.show(
          'global',
          CONSTANT.MESSAGING.SUCCESS,
          'Sorry to hear that! Try checking other vendors, we have some great ones to offer.',
          true
        );
      }, 300);
    },
    (reason: any) => {
      this.messagingService.show(
        'global',
        CONSTANT.MESSAGING.ERROR,
        reason.statusText ? reason.statusText : CONSTANT.ERRORS.UNEXPECTED_ERROR
      );
    });
  }

}
