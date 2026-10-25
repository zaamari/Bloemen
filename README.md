# luxurypresent

Webshop voor satijnen boeketten, snoeptaarten en cadeaus. Gebouwd met Next.js 16, Tailwind CSS 4 en Motion.

## Starten

```bash
npm install
npm run dev
```

Open daarna http://localhost:3000 (stuurt door naar `/nl`).

## Structuur

| Map / bestand | Inhoud |
| --- | --- |
| `src/app/[locale]/` | Pagina's: home, shop, product, winkelmand, custom, galerij, account, admin |
| `src/components/` | Onderdelen zoals menu, hero, productkaart en formulieren |
| `src/lib/i18n.ts` | Alle teksten in het Nederlands en Engels |
| `src/lib/catalog.ts` | Producten, categorieën en galerij (voorbeelddata) |
| `src/lib/store.tsx` | Winkelmand, favorieten, account, bestellingen en aanvragen |
| `scripts/prepare-images.mjs` | Zet foto's uit `fotos/` om naar `public/images/` (`npm run images`) |

## Nog te doen

- **Supabase koppelen**: `store.tsx` en `catalog.ts` bewaren nu alles in de browser. Na koppeling komen producten, bestellingen, aanvragen en accounts (met Google-login) uit de database.
- **Logo** vervangen in `src/components/Logo.tsx` en `src/app/icon.svg`.
- **WhatsApp-nummer** invullen in `src/lib/catalog.ts` (`WHATSAPP_NUMBER`).
- **Echte namen en prijzen** invullen in `src/lib/catalog.ts`.
- **Foto's in hoge resolutie** in `fotos/` zetten en `npm run images` draaien.
