import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ContextService } from '../context.service';
import { Router } from '@angular/router';
import { SharedDataService } from '../shared-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {
  contents: any[] = [];
  categories: string[] = [];
  isLoading: boolean = true;
  currentPage: number = 1;
  selectedCategory: string | null = null;

  constructor(
    private apiService: ApiService, 
    private contextService: ContextService, 
    private router: Router,
    private sharedDataService: SharedDataService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.fetchCategories();
    this.loadContent();
  }

  fetchCategories() {
    this.apiService.getCategories('Movie').subscribe(categories => {
      this.categories = categories;
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, 
    });
  }

  loadContent() {
    const profileId = this.contextService.getContext().profileId;
    if (!profileId) {
      console.error('No profile ID found');
      this.openSnackBar('Not Authenticated', 'Close');
      this.router.navigate(['/login']);
      return;
    }

    this.apiService.getContent(profileId, this.currentPage, 'Movie', this.selectedCategory ?? undefined).subscribe(
      (data) => {
        this.contents = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Failed to fetch content', error);
        this.isLoading = false;
        if (error.status === 401) {
          this.openSnackBar('Something Went wrong! Please try again later', 'Close');
          this.router.navigate(['/login']);
        }
      }
    );
  }

  nextPage() {
    this.currentPage++;
    this.loadContent();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadContent();
    }
  }

  onMoreDetails(content: any): void {
    this.sharedDataService.setContentData(content);
    this.router.navigate(['/details']);
  }

  randomMatchPercentage(): number {
    return Math.floor(Math.random() * (100 - 60 + 1) + 60);
  }

  onCategoryChange(newCategory: string) {
    this.selectedCategory = newCategory;
    this.loadContent();
  }
}
