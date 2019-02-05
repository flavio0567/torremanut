import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-inside',
  templateUrl: './inside.page.html',
  styleUrls: ['./inside.page.scss'],
})
export class InsidePage implements OnInit {

  data = '';

  constructor(
    private authService: AuthService,
    private storage: Storage,
    private toastController: ToastController) { }

  ngOnInit() {
  }

  loadSpecialInfo() {
    this.authService.getSpecialData().subscribe(res => {
      this.data = res['msg'];
    });
  }

  logout() {
    this.authService.logout();
  }

  async clearToken() {
    // testing
    this.storage.remove('access_token');

    let toast = await this.toastController.create({
      message: 'JWT removed',
      duration: 3000
    });
    // toast.then(toats => toast.present());
    toast.present();
  }

}
