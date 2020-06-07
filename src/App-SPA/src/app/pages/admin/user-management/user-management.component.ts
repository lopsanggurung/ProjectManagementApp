import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AdminService } from './../../../core/admin.service';
import { User } from './../../../_models/user';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: User[];

  constructor(private router: Router, private adminService: AdminService) { }

  editUserDetail(user: User): void {
    console.log('editUserDetail button clicked');
  }

  ngOnInit() {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe(
      (users: User[]) => {
        this.users = users;
      },
      error => {
        console.log(error);
      }
    );
  }
}
