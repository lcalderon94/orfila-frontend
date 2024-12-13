import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MockAuthService } from '../services/mock-auth.service';
import { UserProfile } from '../interfaces/profile.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  currentProfile: UserProfile | null = null;
  availableUsers: UserProfile[] = [];

  constructor(private mockAuthService: MockAuthService) {}

  ngOnInit(): void {
    this.availableUsers = this.mockAuthService.getMockUsers();
    this.mockAuthService.getCurrentProfile().subscribe((profile: UserProfile | null) => {
      this.currentProfile = profile;
    });
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  onUserChange(userId: string): void {
    this.mockAuthService.switchUser(userId);
  }
}