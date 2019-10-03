import { Reservation } from './Reservation';
import { Screening } from './Screening';
import { Customer } from './Customer';
import { Movie } from './Movie';
import { Money } from './Money';
import { MovieType } from './MovieType';

export class ReservationAgency {
  reserve(screening: Screening, customer: Customer, audienceCount: number): Reservation {
    const discountable: boolean = this.checkDiscountable(screening);
    const fee: Money = this.calculateDiscountFee(screening, discountable, audienceCount);
    return this.createReservation(customer, screening, fee, audienceCount);
  }

  private checkDiscountable(screening: Screening): boolean {
    return screening
      .getMovie()
      .getDiscountConditions()
      .some(condition => condition.isDiscountable(screening));
  }

  private calculateDiscountFee(screening: Screening, discountable: boolean, audienceCount: number): Money {
    if (discountable) {
      return screening
        .getMovie()
        .getFee()
        .minus(this.calculateDiscountedFee(screening.getMovie()))
        .times(audienceCount);
    }

    return screening
      .getMovie()
      .getFee()
      .times(audienceCount);
  }

  private calculateDiscountedFee(movie: Movie): Money {
    switch (movie.getMovieType()) {
      case MovieType.ACOUNT_DISCOUNT:
        return this.calculateAmountDiscountedFee(movie);
      case MovieType.PERCENT_DISCOUNT:
        return this.calculatePercentDiscountedFee(movie);
      case MovieType.NONE_DISCOUNT:
        return this.calculateNoneDiscountedFee();
      default:
        return this.calculateNoneDiscountedFee();
    }
  }

  private calculateAmountDiscountedFee(movie: Movie): Money {
    return movie.getDiscountAmount();
  }

  private calculatePercentDiscountedFee(movie: Movie): Money {
    return movie.getFee().times(movie.getDiscountPercent());
  }

  private calculateNoneDiscountedFee(): Money {
    return Money.ZERO;
  }

  private createReservation(customer: Customer, screening: Screening, fee: Money, audienceCount: number) {
    return new Reservation(customer, screening, fee, audienceCount);
  }
}