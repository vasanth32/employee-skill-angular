import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-global-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './global-spinner.component.html',
  styleUrl: './global-spinner.component.scss'
})
export class GlobalSpinnerComponent {
  constructor(public loadingService: LoadingService) { }
}
