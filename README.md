# labirint

## Popravek premikanja

Če se je opica premikala po 2 polji naenkrat, je bil razlog dvojni `keydown` listener (na `window` in na `#game`). V tej verziji je listener samo na `window`, zato je premik vedno **1 korak** na pritisk tipke.
