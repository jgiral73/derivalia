import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { form, Field } from '@angular/forms/signals';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonItem, IonInput, IonLabel, IonButton, IonCheckbox, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eye, eyeOff, mail, lockOpen, keyOutline } from 'ionicons/icons';


// interface LoginData {
//   email: string;
//   password: string;
// }


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonGrid, IonRow, IonCol, IonItem, IonInput, IonLabel, IonButton, IonCheckbox, IonIcon, 
    // Field,
  ]
})
export class LoginPage implements OnInit {

  // private translate = inject(trans)

  // loginModel = signal<LoginData>({
  //   email: '',
  //   password: '',
  // });

  // loginForm = form(this.loginModel);

  showPassword = signal(false);

  constructor() {
    addIcons({ eye, eyeOff, mail, lockOpen, keyOutline });
  }

  ngOnInit() {
  }


  toggleShowPassword(event: Event) {
    this.showPassword.update(value => !value);
  }

}
