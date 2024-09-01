import React from 'react';
import Plot from 'react-plotly.js';
import { BlackScholes } from './BlackScholes';

export function Heatmap({ title, inputs, heatmapParams, type }) {
  const { strike, timeToMaturity, interestRate } = inputs;
  const { spotMin, spotMax, volMin, volMax } = heatmapParams;
  

  const spotRange = Array.from({ length: 10 }, (_, i) => spotMin + (i * (spotMax - spotMin) / 9));
  const volRange = Array.from({ length: 10 }, (_, i) => volMin + (i * (volMax - volMin) / 9));

  const prices = volRange.map(vol =>
    spotRange.map(spot => {
      const bs = new BlackScholes(timeToMaturity, strike, spot, vol, interestRate);
      const { callPrice, putPrice } = bs.run();
      return type === 'call' ? callPrice : putPrice;
    })
  );

  const data = [{
    z: prices,
    x: spotRange,
    y: volRange,
    type: 'heatmap',
    colorscale: [
      [0, 'rgb(255,0,0)'],      // Red for lowest values
      [0.5, 'rgb(255,255,0)'],  // Yellow for middle values
      [1, 'rgb(0,255,0)']       // Green for highest values
    ],
  }];

  const layout = {
    title: title,
    xaxis: { title: 'Spot Price', gridcolor: '#444', linecolor: '#444' },
    yaxis: { title: 'Volatility', gridcolor: '#444', linecolor: '#444' },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'white',
    font: { color: 'black' },
  };

  return (
    <Plot
      data={data}
      layout={layout}
      style={{ width: '400px', height: '400px' }}
    />
  );
}