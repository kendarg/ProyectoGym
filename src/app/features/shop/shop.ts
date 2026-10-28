import { Component} from "@angular/core";
import { productos } from "./shop.data";

@Component({
    selector:'app-shop',
    templateUrl:'./shop.html',
    styleUrl:'./shop.css',
})
export class Shop{
    productos = productos;
}