# Archive of Surface — online exhibition

`Archive of Surface` is a restrained online exhibition built from a supplied photographic archive of mosaic and monumental work. The interface presents each selected fragment in two states: a documentary source photograph and an interpretive graphite study created for this exhibition route.

The visual language is intentionally sparse: bone paper, soot, graphite, mineral gold, oxidized-blue wayfinding, bas-relief frames, and directional shadows. Each room includes a short spatial prehistory. These texts are marked as curatorial interpretation and do not assert unverified titles, dates, authorship, or locations.

## Published links

| Назначение | Ссылка | Статус |
|---|---|---|
| **Постоянный сайт Manus** | https://galleryexp-dstrjv7l.manus.space | Публичная опубликованная версия |
| **Открытый GitHub-репозиторий** | https://github.com/mosaicin/gallery-experience | Исходный код и фотокаталог |
| **Ubuntu preview** | https://3000-ixa2dmomf7pu7fx70a-a586e3b1.us2.manus.computer | Временный адрес запущенного dev-сервера |

Сайт Manus является постоянной публичной версией. GitHub содержит исходный код, оптимизированный фотокаталог и инструкции запуска. Ubuntu preview предназначен для текущей проверки и может измениться после остановки или перезапуска локального сервера.

## Public scope

This public repository contains the web interface and the exhibition assets used by the deployed page. It does **not** contain the uploaded PDF, private personal archives, Mail.ru credentials, media archives, or private legal notes. The source images are referenced through project storage paths rather than committed as local bulk files.

## Run locally

```bash
pnpm install
pnpm run dev
```

For a production check:

```bash
pnpm run check
pnpm run build
```

## Structure

The exhibition page lives in `client/src/pages/Home.tsx`. Visual tokens and the material system are defined in `client/src/index.css`. The project uses React, Vite, Tailwind CSS, and Lucide icons.

## Attribution and interpretation

The photograph labels identify the material visible in the supplied archive. Room names, spatial prehistories, and graphite studies are curatorial treatments for this online exhibition. They should not be read as independent documentary claims.

## GitHub Pages

The repository includes the existing GitHub Actions workflow for building the site. To enable the free GitHub Pages host, open **Settings → Pages → Build and deployment**, choose **GitHub Actions** as the source, save, and rerun the publish workflow. The resulting URL will use the repository's GitHub Pages address.

## License

The code is published for demonstration and exhibition purposes. Uploaded source photographs and generated study images remain subject to the rights and permissions of their respective owners and contributors; do not reuse them commercially without permission.
