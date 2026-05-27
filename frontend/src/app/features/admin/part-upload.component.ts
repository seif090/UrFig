import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'app-part-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="upload-container">
      <h3>Upload New Lego Part</h3>
      
      <form [formGroup]="uploadForm" (ngSubmit)="onSubmit()" class="upload-form">
        <div class="form-group">
          <label>Part Name</label>
          <input type="text" formControlName="name" placeholder="e.g. Blue Space Suit">
        </div>

        <div class="form-group">
          <label>Part Type</label>
          <select formControlName="type">
            <option value="head">Head</option>
            <option value="torso">Torso</option>
            <option value="legs">Legs</option>
            <option value="hair">Hair/Hat</option>
          </select>
        </div>

        <div class="form-group">
          <label>Price ($)</label>
          <input type="number" formControlName="price" step="0.01">
        </div>

        <div class="form-group">
          <label>Part Image (PNG suggested)</label>
          <input type="file" (change)="onFileSelected($event)" accept="image/*">
        </div>

        <button type="submit" [disabled]="uploadForm.invalid || !selectedFile()" class="submit-btn">
          {{ isUploading() ? 'Uploading...' : 'Upload Part' }}
        </button>

        @if (message()) {
          <p class="status-msg" [class.error]="isError()">{{ message() }}</p>
        }
      </form>
    </div>
  `,
  styles: [`
    .upload-container {
      background: #f9f9f9;
      padding: 2rem;
      border-radius: 8px;
      border: 2px dashed #ccc;
    }
    .upload-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 400px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }
    input, select {
      padding: 0.6rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .submit-btn {
      padding: 0.8rem;
      background: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }
    .submit-btn:disabled {
      background: #ccc;
    }
    .status-msg {
      margin-top: 1rem;
      font-size: 0.9rem;
    }
    .status-msg.error {
      color: #dc3545;
    }
  `]
})
export class PartUploadComponent {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);

  uploadForm = this.fb.group({
    name: ['', Validators.required],
    type: ['head', Validators.required],
    price: [1.99, [Validators.required, Validators.min(0)]]
  });

  selectedFile = signal<File | null>(null);
  isUploading = signal(false);
  message = signal('');
  isError = signal(false);

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile.set(file);
    }
  }

  onSubmit() {
    if (this.uploadForm.valid && this.selectedFile()) {
      this.isUploading.set(true);
      const formData = new FormData();
      formData.append('name', this.uploadForm.value.name!);
      formData.append('type', this.uploadForm.value.type!);
      formData.append('price', this.uploadForm.value.price!.toString());
      formData.append('image', this.selectedFile()!);

      this.adminService.uploadLegoPart(formData).subscribe({
        next: (res) => {
          this.message.set(`Successfully uploaded: ${res.name}`);
          this.isError.set(false);
          this.isUploading.set(false);
          this.uploadForm.reset({ type: 'head', price: 1.99 });
          this.selectedFile.set(null);
        },
        error: (err) => {
          this.message.set(err.error?.message || 'Upload failed');
          this.isError.set(true);
          this.isUploading.set(false);
        }
      });
    }
  }
}
迫