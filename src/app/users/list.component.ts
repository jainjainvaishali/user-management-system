import {Component, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';
import {AccountService} from '@app/_services';

@Component({
  templateUrl: 'list.component.html',
  styles: ['table { width: 100% }', 'th.mat-header-cell {color: black}']
})
export class ListComponent implements OnInit {
  public users = null;
  displayedColumns: string[] = ['firstName', 'lastName', 'username', 'action'];

  constructor(private accountService: AccountService) {
  }

  ngOnInit(): any {
    this.accountService.getAll()
      .pipe(first())
      .subscribe(users => this.users = users);
  }

  deleteUser(id: string): any {
    const user = this.users.find(x => x.id === id);
    user.isDeleting = true;
    this.accountService.delete(id)
      .pipe(first())
      .subscribe(() => this.users = this.users.filter(x => x.id !== id));
  }
}
