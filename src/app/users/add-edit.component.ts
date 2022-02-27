import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AccountService} from '@app/_services';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({templateUrl: 'add-edit.component.html'})
export class AddEditComponent implements OnInit {
  form: FormGroup;
  id: string;
  isAddMode: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): any {
    this.id = this.route.snapshot.params.id;
    this.isAddMode = !this.id;
    // password is not required in the edit mode
    const passwordValidators = [Validators.minLength(6)];
    if (this.isAddMode) {
      passwordValidators.push(Validators.required);
    }
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', passwordValidators]
    });
    if (!this.isAddMode) {
      this.accountService.getById(this.id)
        .pipe(first())
        .subscribe(x => this.form.patchValue(x));
    }
  }

  get f(): any {
    return this.form.controls;
  }

  onSubmit(): any {
    if (this.form.invalid) {
      return;
    }
    if (this.isAddMode) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  private createUser(): any {
    this.accountService.register(this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.snackBar.open('User Details added successfully','',{
            duration: 1000
          });
          this.router.navigate(['../'], {relativeTo: this.route});
        },
        error: error => {
          this.snackBar.open(error);
        }
      });
  }

  private updateUser(): any {
    this.accountService.update(this.id, this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.snackBar.open('User Details Updated successfully','',{
            duration: 1000
          });
          this.router.navigate(['../../'], {relativeTo: this.route});
        },
        error: error => {
          this.snackBar.open(error,'',{
            duration: 1000
          });
        }
      });
  }
}
