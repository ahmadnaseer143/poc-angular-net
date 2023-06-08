import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { UserModel } from '../user-dashboard/user-dashboard-model';
@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.css'],
})
export class EdituserComponent {
  userModelObj: UserModel = new UserModel();
  editForm!: FormGroup;

  constructor(
    private formbuilder: FormBuilder,
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.editForm = this.formbuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: [
        '',
        [Validators.required, Validators.pattern(/^\+\d{1,3}\d{9}$/)],
      ],
    });

    let userId: any = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.api.get(userId).subscribe(
        (user: any) => {
          this.userModelObj.id = user.id;
          this.editForm.controls['name'].setValue(user.name);
          this.editForm.controls['email'].setValue(user.email);
          this.editForm.controls['mobile'].setValue(user.mobile);
        },
        (err) => console.log(err)
      );
    }
  }

  updateUserDetails() {
    if (this.editForm.valid) {
      this.userModelObj.name = this.editForm.value.name;
      this.userModelObj.email = this.editForm.value.email;
      this.userModelObj.mobile = this.editForm.value.mobile;

      this.api.update(this.userModelObj.id, this.userModelObj).subscribe(
        (res) => {
          // console.log(res);
          let closeRef = document.getElementById('close');
          closeRef?.click();
          this.editForm.reset();
          this.router.navigate(['dashboard']);
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.editForm.markAllAsTouched();
    }
  }
}
