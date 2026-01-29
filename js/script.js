const path = document.getElementById('path');
const button = document.getElementById('reset');

// dolžina poti
const length = path.getTotalLength();

// začetno stanje – skrita črta
path.style.strokeDasharray = length;
path.style.strokeDashoffset = length;
path.style.animation = 'none';

// klik na gumb
button.addEventListener('click', () => {
    path.style.animation = 'none';
    path.getBoundingClientRect();

    // zaženi animacijo
    path.style.animation =  'draw-line 10s ease-in-out forwards';
});


