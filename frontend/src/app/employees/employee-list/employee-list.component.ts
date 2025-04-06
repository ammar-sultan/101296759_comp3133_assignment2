import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { GraphqlService } from '../../services/graphql.service';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { filter } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../dialogs/ confirm-dialog.component';

@Component({
  standalone: true,
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
  imports: [CommonModule, NgIf, NgFor, FormsModule, NavbarComponent],
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  searchQuery: string = '';
  errorMessage: string = '';

  constructor(
    private gql: GraphqlService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationEnd && this.router.url === '/employees'
        )
      )
      .subscribe(() => {
        this.fetchEmployees();
      });
  }

  ngOnInit() {
    this.fetchEmployees();
  }

  fetchEmployees() {
    this.gql.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.filteredEmployees = data;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load employees.';
        console.error(err);
      },
    });
  }

  handleSearch() {
    const query = this.searchQuery.toLowerCase();
    this.filteredEmployees = this.employees.filter(
      (emp) =>
        `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.designation.toLowerCase().includes(query)
    );
  }

  handleDelete(id: string) {
    // Open your custom dialog instead of using confirm()
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: 'Are you sure you want to delete this employee?' },
    });

    // Check user’s choice after the dialog closes
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.gql.deleteEmployee(id).subscribe({
          next: () => {
            this.fetchEmployees();
          },
          error: () => alert('Failed to delete employee.'),
        });
      }
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
