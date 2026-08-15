

## Подробная схема кубической комнаты

Текущая версия Darkland — это не плоская сцена, а сетка комнат с шестью направлениями перехода. Координата `ROOM x,y,z` меняется после принятого перехода.

```text
                         ВЕРХ / CEILING
                       [дверь +Y]
                            ▲
                            │ Space / PageUp
                            │
ЗАПАД / WEST  ◄── [ ROOM x,y,z ] ──►  ВОСТОК / EAST
  ArrowLeft                         ArrowRight
                            │
                            │ Shift / PageDown
                            ▼
                          НИЗ / FLOOR
                       [дверь -Y]

          СЕВЕР / NORTH: ArrowUp       ЮГ / SOUTH: ArrowDown
```

| Направление | Грань комнаты | Координата | Управление | Результат |
|---|---|---:|---|---|
| Вперёд | Север | `z + 1` | `ArrowUp` | Переход через северную дверь |
| Назад | Юг | `z - 1` | `ArrowDown` | Переход через южную дверь |
| Влево | Запад | `x - 1` | `ArrowLeft` | Переход через западную дверь |
| Вправо | Восток | `x + 1` | `ArrowRight` | Переход через восточную дверь |
| Вверх | Потолок | `y + 1` | `Space` или `PageUp` | Открытие потолочной двери |
| Вниз | Пол | `y - 1` | `Shift` или `PageDown` | Открытие двери в полу |

Каждый принятый переход блокирует повторный ввод на `420 ms`, воспроизводит переходный звук, меняет координату комнаты, перестраивает часть модульной геометрии и ориентирует камеру по входной грани. На телефоне экранные стрелки выполняют те же команды, а drag по игровому canvas вращает камеру по горизонтали и вертикали.

## Что было добавлено в последней итерации

Добавлены двустворчатые двери в полу и потолке с отдельными рамами и подсветкой. Добавлена подробная схема движения и обозначения верхней/нижней граней. Визуальные модули меняют положение и поворот при смене координаты комнаты, чтобы переход был заметен не только в тексте HUD. Кодовая база не зависит от генерации изображений: это обычная Babylon.js/TypeScript-механика.


## ShadowCube-inspired mechanics and autonomous checks

The project borrows only a general design idea from the referenced ShadowCube repository: a connected network of cube-like rooms, face-to-face transitions, spatial disorientation, and a route toward an exit. The implementation here is original Babylon.js/TypeScript code; no ShadowCube source code, Unity assets, film images, logo, or characters are copied. The reference has no explicit permissive code licence in its top-level files, so it is treated as inspiration only.

Two GitHub Actions workflows now run automatically:

| Workflow | Trigger | Checks or action |
|---|---|---|
| `Verify Darkland` | Push or pull request to `main` | Installs the locked dependencies, runs `pnpm run check`, and runs the production build. |
| `Publish Darkland` | Push to `main` or manual dispatch | Builds the static site, creates the SPA fallback, uploads the Pages artifact, and deploys it through GitHub Pages. |

To operate the project without repeatedly typing in chat, push a change to `main`, then open the **Actions** tab. A green `Verify Darkland` run means the TypeScript and production build checks passed. The `Publish Darkland` run then updates the GitHub Pages deployment. The managed live preview remains available separately while developing.


### One-time GitHub Pages setup

The verification workflow is fully automatic and has passed on commit `9aaa04a`. The Pages build artifact is also created automatically, but the repository currently returns `404/403` because GitHub Pages has not been enabled for this repository and the available token cannot change that account setting. To finish the public Pages URL once, open **Settings → Pages → Build and deployment → Source: GitHub Actions**, save, and rerun `Publish Darkland` from the Actions tab. After that, every push to `main` will rebuild and publish the game without further chat commands.
