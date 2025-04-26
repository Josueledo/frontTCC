import { Routes } from '@angular/router';
import { LogMonitorComponent } from './log-monitor/log-monitor.component';
import { BlockedsComponent } from './blockeds/blockeds.component';

export const routes: Routes = [
    {
        path:"",
        component:LogMonitorComponent
    },
    {
        path:"blocks",
        component:BlockedsComponent
    }
];
