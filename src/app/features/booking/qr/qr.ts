import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import QRCode from 'qrcode';
import { tutoriales, type Tutoriales } from './qr.data';

@Component({
    selector: 'app-qr',
    imports: [FormsModule],
    templateUrl: './qr.html',
    styleUrl: './qr.css',
})
export class Qr implements OnInit {
    tutoriales: Tutoriales[] = tutoriales;

    async ngOnInit() {
        for (const tutorial of this.tutoriales) {
            tutorial.qr = await this.generarQR(tutorial.url);
        }
    }

    async generarQR(url: string): Promise<string> {
        return QRCode.toDataURL(url, { width: 250, margin: 2 });
    }

}