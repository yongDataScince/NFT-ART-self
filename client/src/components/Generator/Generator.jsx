import React from "react";
import * as _ from 'lodash'

function Random(seed) {
  this._seed = seed % 2147483647;
  if (this._seed <= 0) this._seed += 2147483646;
}

Random.prototype.next = function () {
  return this._seed = this._seed * 16807 % 2147483647;
};
Random.prototype.nextFloat = function () {
  // We know that result of next() will be 1 to 2147483646 (inclusive).
  return (this.next() - 1) / 2147483646;
};

var hashCode = function(str) {
  var hash = 0, i, chr;
  if (str?.length === 0) return hash;
  for (i = 0; i < str?.length; i++) {
    chr   = str?.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function rndRatios(count, rnd){
  const rawRatios = (new Array(count)).fill(1).map(() => rnd.nextFloat());
  const total = rawRatios.reduce((a,b) => a+b);
  return rawRatios.map(raw => raw/total);
}

export const Avatar = ({ name }) => {
  const size = 120;
  const coefW = 2.3;
  const coefH = 1.3;

  const rnd = new Random(hashCode(name));
  const radiusRatios = rndRatios(6, rnd).reduce(([sum,a],r) => {
    const next = sum + r;
    a.push(next);
    return [next, a];
  }, [0,[]])[1];

  const ds = Array(10).fill(0).map((id) => {
    return `M${radiusRatios.map((r) => {
      // const radius = rnd.nextFloat() * size/2 + size/4;
      const radius = (rnd.nextFloat() * (rnd.nextFloat() * rnd.nextFloat() * 1900)) * rnd.nextFloat() * rnd.nextFloat() + size * coefW * rnd.nextFloat();
      // const radius = rnd.nextFloat() * size - size;
      return (Math.sin(r*Math.PI*2)*radius+size*(coefW)/2) + ' ' + (Math.cos(r*Math.PI*2)*radius+size/2);
    })} Z`;
  })


  const _ = rnd.nextFloat() * 50 + 10 + rnd.nextFloat();
  const rndColor = rnd.nextFloat() * 360;

  const sat = rnd.nextFloat() * 50 + 25;
  
  const bgColor = `hsl(${rndColor+rnd.nextFloat()+rnd.nextFloat()*150+100},${sat+rnd.nextFloat()*50-25}%,${rnd.nextFloat() * 20}%)`;

  return <svg width={size*coefW} height={size*coefH} viewBox={`0 0 ${size*coefW} ${size*coefH}`}>
    <rect x="0" y="0" width={size*coefW} height={size*coefH} fill={bgColor} />
    {ds.map((d, idx) => {
      let rndc = rnd.nextFloat() * rnd.nextFloat() * 360;
      let rnds = rnd.nextFloat() * rnd.nextFloat() * 60 + 25;
      const fgColor = `hsl(${rndc},${rnds}%,60%)`;
      return <path d={d} stroke={fgColor} fill="transparent" strokeWidth={idx * 0.7 * rnd.nextFloat() * rnd.nextFloat()} />
    })}
  </svg>;
}