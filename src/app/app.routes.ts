import { Routes } from '@angular/router';
import { LogMonitorComponent } from './log-monitor/log-monitor.component';
import { BlockedsComponent } from './blockeds/blockeds.component';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [

    {
        path:"blocks",
        component:BlockedsComponent
    }
    ,
    {
        path:"",
        component:HomeComponent
    }

];
