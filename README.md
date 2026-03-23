# Budžeta Trackers - Lietošanas instrukcija

Šī ir React + Vite lietotne. Lai tā darbotos tavā datorā vai GitHub Pages, ir jāveic daži soļi.

## 1. Palaišana lokāli (savā datorā)

Tev ir nepieciešams instalēts [Node.js](https://nodejs.org/).

1. Atver termināli šajā mapē.
2. Instalē atkarības:
   ```bash
   npm install
   ```
3. Palaid izstrādes serveri:
   ```bash
   npm run dev
   ```
4. Atver pārlūkā adresi, ko parāda terminālis (parasti `http://localhost:3000`).

## 2. Publicēšana GitHub Pages

Pārlūki nevar izpildīt `.tsx` failus tieši, tāpēc lietotne ir "jānobūvē" (build).

1. Terminālī palaid:
   ```bash
   npm run build
   ```
2. Tiks izveidota mape **`dist`**.
3. **SVARĪGI:** GitHub Pages ir jāaugšupielādē **tikai `dist` mapes saturs**.
4. Ja vēlies, lai GitHub to dara automātiski, vari izmantot GitHub Actions (Vite + GitHub Pages workflow).

## 3. Instalēšana telefonā (PWA)

Kad lietotne ir publicēta (piemēram, GitHub Pages):
1. Atver adresi savā telefonā (Safari vai Chrome).
2. Spied "Share" (Safari) vai trīs punktus (Chrome).
3. Izvēlies **"Add to Home Screen"**.
4. Lietotne parādīsies tavā sākuma ekrānā kā parasta aplikācija.
