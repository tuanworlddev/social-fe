import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { VideoCallComponent } from './components/video-call/video-call.component';
import { ChatComponent } from './components/chat/chat.component';
import { FriendComponent } from './components/friend/friend.component';
import { NotificationComponent } from './components/notification/notification.component';
import { AboutComponent } from './components/about/about.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, children: [
        { path: 'home', component: VideoCallComponent },
        { path: 'message', component: ChatComponent },
        { path: 'friend', component: FriendComponent },
        { path: 'notification', component: NotificationComponent },
        { path: 'about', component: AboutComponent },
        { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]},
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
];
