// BlackScholes.js
import jstat from 'jstat';

export class BlackScholes {
  constructor(timeToMaturity, strike, currentPrice, volatility, interestRate) {
    this.timeToMaturity = timeToMaturity;
    this.strike = strike;
    this.currentPrice = currentPrice;
    this.volatility = volatility;
    this.interestRate = interestRate;
  }

  run() {
    const { timeToMaturity, strike, currentPrice, volatility, interestRate } = this;

    const d1 = (Math.log(currentPrice / strike) + (interestRate + 0.5 * volatility ** 2) * timeToMaturity) / (volatility * Math.sqrt(timeToMaturity));
    const d2 = d1 - volatility * Math.sqrt(timeToMaturity);

    this.callPrice = currentPrice * jstat.normal.cdf(d1, 0, 1) - strike * Math.exp(-interestRate * timeToMaturity) * jstat.normal.cdf(d2, 0, 1);
    this.putPrice = strike * Math.exp(-interestRate * timeToMaturity) * jstat.normal.cdf(-d2, 0, 1) - currentPrice * jstat.normal.cdf(-d1, 0, 1);

    // Greeks
    this.callDelta = jstat.normal.cdf(d1, 0, 1);
    this.putDelta = -jstat.normal.cdf(-d1, 0, 1);
    this.callGamma = jstat.normal.pdf(d1, 0, 1) / (currentPrice * volatility * Math.sqrt(timeToMaturity));
    this.putGamma = this.callGamma;

    return { callPrice: this.callPrice, putPrice: this.putPrice };
  }
}