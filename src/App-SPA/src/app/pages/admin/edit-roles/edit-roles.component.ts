import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/core/admin.service';

@Component({
  selector: 'app-edit-roles',
  templateUrl: './edit-roles.component.html',
  styleUrls: ['./edit-roles.component.scss']
})
export class EditRolesComponent implements OnInit {
  selectedUser: User;
  roles = [];

  constructor(private router: Router, private adminService: AdminService) { }

  ngOnInit() {
    this.selectedUser = this.adminService.selectedUser;
    this.roles = this.getRolesArray(this.selectedUser);
  }

  onCancel() {
    this.router.navigate(['/pages/admin']);
  }

  updateRoles() {
    const rolesToUpdate = {
      roleNames: [...this.roles.filter(el => el.checked === true).map(el => el.name)]
    };
    if (rolesToUpdate) {
      this.adminService.updateUserRoles(this.selectedUser, rolesToUpdate).subscribe(() => {
        this.selectedUser.roles = [...rolesToUpdate.roleNames];
        console.log('Roles changed successfully');
        this.router.navigate(['/pages/admin']);
      }, error => {
        console.log(error);
        console.log('Failed to change Roles');
      });
    }
  }

  private getRolesArray(user) {
    const availableRoles: any[] = [
      { name: 'Admin', value: 'Admin' },
      { name: 'Manager', value: 'Manager' },
      { name: 'Member', value: 'Member' }
    ];

    for (const availableRole of availableRoles) {
      let isMatch = false;
      for (const userRole of this.selectedUser.roles) {
        if (availableRole.name === userRole) {
          isMatch = true;
          availableRole.checked = true;
          this.roles.push(availableRole);
          break;
        }
      }

      if (!isMatch) {
        availableRole.checked = false;
        this.roles.push(availableRole);
      }
    }
    return this.roles;
  }
}
