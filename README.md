radioactive.js
===============

[![Build Status](https://travis-ci.org/reinpk/radioactive.png?branch=master)](https://travis-ci.org/reinpk/radioactive)


A library to model nuclear physics in javascript. Intended for building visualizations and interactive demonstrations.

## Usage

### Decay

#### products(isotope)
Get the decay products for the given `isotope`. The `isotope` parameter is a compact name like `Pu-239`.

```javascript
radioactive.decay.products('Pu-239');
```

returns an array of products produced in the decay process:

```javascript
[
    {
        fraction : 1,       // in the range [0, 1]
        product  : 'U-235'  // a compact isotope name
    },
    ...
]
```

#### chain(isotope)
Get the complete decay chain for the given `isotope`. The `isotope` parameter is a compact name like `Y-99`.

```javascript
radioactive.decay.chain('Y-99');
```

returns an array of products produced in the decay process:

```javascript
["Y-99", "Zr-99", "Nb-99m", "Nb-99", "Mo-99m2", "Mo-99m1", "Mo-99", "Tc-99m", "Tc-99"]
```

#### mass(charge)
Get a decay profile of isotope mass for a starting `charge` of isotopes. The `charge` parameter is a dictionary of compact isotope names (like `Pu-239') to initial charges (kilograms) of that isotope.

```javascript
radioactive.decay.mass({
    'Y-99' : 1 //kilograms
});
```

returns a function that can be passed `time` in years. That function will return a dictionary of isotope masses remaining at that time:

```javascript
{
    'Y-99'  : 0.02, // kilograms
    'Zr-99' : 0.8, // kilograms
    ...other isotopes...
    'total   : 1   // kilograms
}
```

#### radioactivity(charge)
Get a decay profile of radioactivity for a starting `charge` of isotopes. The `charge` parameter is a dictionary of compact isotope names (like `Pu-239') to initial charges (kilograms) of that isotope.

```javascript
radioactive.decay.radioactivity({
    'Y-99' : 1 //kilograms
});
```

returns a function that can be passed `time` in years. That function will return a dictionary of isotope masses remaining at that time:

```javascript
{
    'Y-99' : 5510123, // becquerels
    ...other isotopes...
    'total : 14310123 // becquerels
}
```

### Fission & Neutron Capture
This module isn't implemented yet. Simulating fission and neutron capture is a real-time process, and needs totally different math & datasets.

Things this module will need to know about

+ Fission isotope spread
+ Neutron absorption probabilities for different energies and istopes
+ Energies and products released
+ Geometry of the situation
+ Accompanying thermal model would make it actually useful

Contributions are welcome!

## License (MIT)

    WWWWWW||WWWWWW
     W W W||W W W
          ||
        ( OO )__________
         /  |           \
        /o o|    MIT     \
        \___/||_||__||_|| *
             || ||  || ||
            _||_|| _||_||
           (__|__|(__|__|

Copyright (C) 2013 Peter Reinhardt

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/reinpk/radioactive/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

