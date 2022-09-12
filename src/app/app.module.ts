import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSliderModule} from "@angular/material/slider";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatCardModule} from "@angular/material/card";
import {MatTableModule} from "@angular/material/table";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {TattooWorkListComponent} from './components/tattoo-work-list/tattoo-work-list.component';
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../environments/environment";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {HttpClientModule} from "@angular/common/http";
import {TranslateModule} from '@ngx-translate/core';
import {StreamChatModule, StreamAutocompleteTextareaModule} from 'stream-chat-angular';
import {ChatComponent} from './components/chat/chat.component';
import {AuthModule} from "@angular/fire/auth";
import {AngularFireFunctionsModule, REGION} from "@angular/fire/compat/functions";
import {RouterModule, Routes} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatNativeDateModule, MatOptionModule} from "@angular/material/core";
import {MatButtonModule} from "@angular/material/button";
import {HomePageComponent} from './components/home-page/home-page.component';
import {MyProfileComponent} from './components/my-profile/my-profile.component';
import {MatBadgeModule} from "@angular/material/badge";
import {LoginDialogComponent} from './components/login-dialog/login-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatDividerModule} from "@angular/material/divider";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatChipsModule} from "@angular/material/chips";
import {FilterMembersPipe} from "./components/chat/filter.pipe";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { CreateArtistAccountFormComponent } from './components/create-artist-account-form/create-artist-account-form.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatSelectModule} from "@angular/material/select";
import { PostTattooWorkComponent } from './components/post-tattoo-work/post-tattoo-work.component';
import { EditTattooWorkComponent } from './components/edit-tattoo-work/edit-tattoo-work.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';

const routes: Routes = [
  {path: 'me', component: MyProfileComponent},
  {path: 'me-edit', component: EditProfileComponent},
  {path: 'chats', component: ChatComponent},
  {path: 'chats/:id', component: ChatComponent},
  {path: 'users/:id', component: UserProfileComponent},
  {path: 'post', component: PostTattooWorkComponent},
  {path: 'edit-tattoo-work/:id', component: EditTattooWorkComponent},
  {path: 'artist-account-form', component: CreateArtistAccountFormComponent},
  {path: 'home', component: HomePageComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    FilterMembersPipe,
    AppComponent,
    UserProfileComponent,
    TattooWorkListComponent,
    ChatComponent,
    HomePageComponent,
    MyProfileComponent,
    LoginDialogComponent,
    CreateArtistAccountFormComponent,
    PostTattooWorkComponent,
    EditTattooWorkComponent,
    EditProfileComponent
  ],
  imports: [
    BrowserModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    TranslateModule.forRoot(),
    StreamAutocompleteTextareaModule,
    StreamChatModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSliderModule,
    MatPaginatorModule,
    MatGridListModule,
    MatCardModule,
    MatTableModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    HttpClientModule,
    AngularFireFunctionsModule,
    AuthModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatButtonModule,
    MatBadgeModule,
    MatDialogModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatSelectModule,
  ],
  providers: [{provide: REGION, useValue: 'europe-central2'}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
