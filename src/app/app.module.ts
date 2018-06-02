import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {MomentModule} from 'ngx-moment';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome'
import {DateCheckPipe} from  './pipes/date-check.pipe'


@NgModule({
    declarations: [
        AppComponent,
        DateCheckPipe
    ],
    imports: [
        BrowserModule,
        FormsModule,
        MomentModule,
        Angular2FontawesomeModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
