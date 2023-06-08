import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserModel } from './user-dashboard-model';
import { ApiService } from '../shared/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent {
  formValue!: FormGroup;
  users!: any;
  showAdd!: boolean;
  showUpdate!: boolean;
  userModelObj: UserModel = new UserModel();

  constructor(
    private formbuilder: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: [
        '',
        [Validators.required, Validators.pattern(/^\+\d{1,3}\d{9}$/)],
      ],
    });
    this.getAllUsers();
  }

  clickOnAdd() {
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }

  postUserDetails() {
    if (this.formValue.valid) {
      this.userModelObj.name = this.formValue.value.name;
      this.userModelObj.email = this.formValue.value.email;
      this.userModelObj.mobile = this.formValue.value.mobile;

      this.api.create(this.userModelObj).subscribe(
        (res) => {
          // console.log(res);
          let closeRef = document.getElementById('close');
          closeRef?.click();
          this.formValue.reset();
          this.getAllUsers();
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.formValue.markAllAsTouched();
    }
  }

  getAllUsers() {
    this.api.getAll().subscribe(
      (res) => {
        this.users = res;
      },
      (err) => console.log(err)
    );
  }

  deleteUser(id: any) {
    let confirm = window.confirm('Are you sure you want to delete?');
    if (confirm) this.api.delete(id).subscribe((res) => this.getAllUsers());
  }

  onEdit(user: any) {
    this.router.navigate(['/dashboard/edituser', user.id]);
    // this.showAdd = false;
    // this.showUpdate = true;
    // this.userModelObj.id = user.id;
    // this.formValue.controls['name'].setValue(user.name);
    // this.formValue.controls['email'].setValue(user.email);
    // this.formValue.controls['mobile'].setValue(user.mobile);
  }

  updateUserDetails() {
    if (this.formValue.valid) {
      this.userModelObj.name = this.formValue.value.name;
      this.userModelObj.email = this.formValue.value.email;
      this.userModelObj.mobile = this.formValue.value.mobile;

      this.api.update(this.userModelObj.id, this.userModelObj).subscribe(
        (res) => {
          // console.log(res);
          let closeRef = document.getElementById('close');
          closeRef?.click();
          this.formValue.reset();
          this.getAllUsers();
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.formValue.markAllAsTouched();
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
