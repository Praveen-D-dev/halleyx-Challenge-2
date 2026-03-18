import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../../services/api.service';
import { CustomerOrder } from '../../../models/customer-order.model';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {
  orderForm!: FormGroup;
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  isEditMode = false;

  countries = ['United States', 'Canada', 'Australia', 'Singapore', 'Hong Kong'];
  products = [
    'Fiber Internet 300 Mbps', 
    '5GUnlimited Mobile Plan', 
    'Fiber Internet 1 Gbps', 
    'Business Internet 500 Mbps', 
    'VoIP Corporate Package'
  ];
  statuses = ['Pending', 'In progress', 'Completed'];
  creators = [
    'Mr. Michael Harris',
    'Mr. Ryan Cooper',
    'Ms. Olivia Carter',
    'Mr. Lucas Martin'
  ];

  constructor(
    public dialogRef: MatDialogRef<OrderFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CustomerOrder | null
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data;
    
    this.orderForm = this.fb.group({
      firstName: [this.data?.firstName || '', Validators.required],
      lastName: [this.data?.lastName || '', Validators.required],
      email: [this.data?.email || '', [Validators.required, Validators.email]],
      phone: [this.data?.phone || '', Validators.required],
      streetAddress: [this.data?.streetAddress || '', Validators.required],
      city: [this.data?.city || '', Validators.required],
      stateProvince: [this.data?.stateProvince || '', Validators.required],
      postalCode: [this.data?.postalCode || '', Validators.required],
      country: [this.data?.country || '', Validators.required],
      
      product: [this.data?.product || '', Validators.required],
      quantity: [this.data?.quantity || 1, [Validators.required, Validators.min(1)]],
      unitPrice: [this.data?.unitPrice || 0, [Validators.required, Validators.min(0)]],
      status: [this.data?.status || 'Pending', Validators.required],
      createdBy: [this.data?.createdBy || '', Validators.required]
    });

    // Auto calculate Total Amount = Quantity * Unit Price
    this.orderForm.get('quantity')?.valueChanges.subscribe(() => this.calculateTotal());
    this.orderForm.get('unitPrice')?.valueChanges.subscribe(() => this.calculateTotal());
  }

  get totalAmount(): number {
    const qty = this.orderForm.get('quantity')?.value || 0;
    const price = this.orderForm.get('unitPrice')?.value || 0;
    return qty * price;
  }

  calculateTotal() {
    // The total is read-only, calculated dynamically
  }

  get errorMessage() {
    return 'Please fill the field';
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      const orderData: CustomerOrder = {
        ...this.orderForm.value,
        totalAmount: this.totalAmount
      };

      if (this.isEditMode && this.data?._id) {
        this.apiService.updateOrder(this.data._id, orderData).subscribe({
          next: (res) => this.dialogRef.close(res),
          error: (err) => console.error(err) // add better handling if needed
        });
      } else {
        this.apiService.createOrder(orderData).subscribe({
          next: (res) => this.dialogRef.close(res),
          error: (err) => console.error(err)
        });
      }
    } else {
      this.orderForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
