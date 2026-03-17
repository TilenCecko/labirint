# Labirint

Ta projekt je preprosta spletna igra, narejena z `HTML`, `CSS` in `JavaScript`. Na strani se prikaže labirint, v katerem igralec vodi opico do cilja in med potjo pobira banane.

## O spletni strani

Spletna stran predstavlja interaktivni labirint, kjer je cilj:

- premikati opico skozi labirint,
- pobrati vse banane,
- priti do končne točke.

Igra je narejena na elementu `canvas`, zato se vsi deli labirinta, igralec, banane in cilj izrisujejo dinamično z JavaScript kodo.

## Kako deluje

- Igralec se premika s puščicami na tipkovnici.
- Opica se ne more premikati skozi zidove labirinta.
- Po igralnem polju so razporejene banane, ki jih mora igralec pobrati.
- Dve banani se premikata gor in dol po osi `y`, zato je igra nekoliko težja.
- Ko igralec pride do cilja, igra preveri, ali so bile pobrane vse banane.

## Gumbi na strani

- `Nova igra`: ustvari novo postavitev banan in začne igro znova.
- `Reset`: vrne igralca na začetni položaj.
- `Vizitka`: prikaže podatke o avtorju.

## Datoteke projekta

- [index.html](/Users/tilen/Desktop/labirint-main/index.html): osnovna struktura spletne strani
- [css/style.css](/Users/tilen/Desktop/labirint-main/css/style.css): videz strani in postavitev elementov
- [js/script.js](/Users/tilen/Desktop/labirint-main/js/script.js): logika igre, risanje labirinta, premikanje igralca in banan

## Namen projekta

Namen te spletne strani je prikazati preprosto interaktivno igro v brskalniku ter uporabo `canvas` elementa, dogodkov tipkovnice in animacije z JavaScriptom.
