import { Component, OnInit } from '@angular/core';
import { Subject, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { ContextService } from '../context.service';
import { SharedDataService } from '../shared-data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';



@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  contents: any[] = [];
  isLoading: boolean = false;
  currentPage: number = 1;
  private searchTerms = new Subject<string>();
  public currentSearchTerm: string = '';
  searchPerformed: boolean = false;

  constructor(private apiService: ApiService, private contextService: ContextService,  
    private router: Router, private sharedDataService: SharedDataService,  private snackBar: MatSnackBar) {}

    ngOnInit(): void {
      this.searchTerms.pipe(
        debounceTime(20),
        switchMap((term: string) => {
          this.currentSearchTerm = term;
          this.searchPerformed = term.length > 0;
          this.isLoading = this.searchPerformed;
    
          if (!this.searchPerformed) {
            return of([]); 
          }
    
          const profileId = this.contextService.getContext().profileId || '';
          return this.apiService.searchContent(profileId, term, this.currentPage).pipe(
            catchError((error) => {
              console.error('Error occurred during search:', error);
              return of([]); // Return an empty array to keep the observable stream intact
            })
          );
        }),
      ).subscribe(data => {
        this.contents = data;
        this.isLoading = false;
      });
    }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, 
    });
  }

  nextPage() {
    this.currentPage++;
    this.search(this.currentSearchTerm);
  }

  onMoreDetails(content: any): void {
    this.sharedDataService.setContentData(content);
    this.router.navigate(['/details']);
  }

  randomMatchPercentage(): number {
    return Math.floor(Math.random() * (100 - 60 + 1) + 60);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.search(this.currentSearchTerm);
    }
  }
}
