import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AccountService} from '@app/_services';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({templateUrl: 'register.component.html'})
export class RegisterComponent implements OnInit {
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
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // convenience getter for easy access to form fields
  get f(): any {
    return this.form.controls;
  }

  onSubmit(): any {

    if (this.form.invalid) {
      return;
    }
    this.accountService.register(this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.snackBar.open('Registration successful');
          this.router.navigate(['../login'], {relativeTo: this.route});
        },
        error: error => {
          this.snackBar.open(error,'',{
            duration: 1000
          });
        }
      });
  }
}
