import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacebookComponent } from './facebook/facebook.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { TwitterComponent } from './twitter/twitter.component';


@NgModule({
  declarations: [FacebookComponent, TwitterComponent],
  exports: [
    FacebookComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    FormsModule
  ]
})
export class PreviewModule {
}
