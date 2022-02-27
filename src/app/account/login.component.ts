import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AccountService} from '@app/_services';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit {
  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): any {
    this.form = this.formBuilder.group({
      username: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });
  }

  get f(): any {
    return this.form.controls;
  }

  onSubmit(): any {
    if (this.form.invalid) {
      return;
    }
    this.accountService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe({
        next: () => {
          // return url from query parameters or default use the home page
          this.snackBar.open('Logged In successfully', '', {
            duration: 1000
          });
          const returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
          this.router.navigateByUrl(returnUrl);
        },
        error: (error) => {
          const errorReceived = error;
          this.snackBar.open(errorReceived, '', {
            duration: 1000
          });
        }
      });
  }
}
