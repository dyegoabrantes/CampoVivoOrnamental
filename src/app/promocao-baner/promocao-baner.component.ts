import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'app-promocao-baner',
  templateUrl: './promocao-baner.component.html',
  styleUrls: ['./promocao-baner.component.css']
})
export class PromocaoBanerComponent implements OnInit {
  
  slideIndex = 1;
  timerSubscription: any;
  
    plusSlides(n) {
      this.showSlides(this.slideIndex += n);
    }
  
    currentSlide(n) {
      this.showSlides(this.slideIndex = n);
    }

  showSlides(n) {
    var i;
    let slides = document.getElementsByClassName("mySlides") as HTMLCollectionOf<HTMLElement>;
    let dots = document.getElementsByClassName("dot") as HTMLCollectionOf<HTMLElement>;
    if (n > slides.length) {this.slideIndex = 1}
    if (n < 1) {this.slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[this.slideIndex-1].style.display = "block";
    dots[this.slideIndex-1].className += " active";
  }
  
  
  constructor(){

  };

  ngOnInit(){
    this.showSlides(this.slideIndex);
  };
  
  public ngAfterViewInit() : void {
    this.timerSubscription = timer(5000, 5000).subscribe((nextNumber) => {
      this.plusSlides(1);
    });
  }

  public ngOnDestroy(): void {
    this.timerSubscription.unsubscribe();
  }

}
