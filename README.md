# Studio Nathan — rluvu2.github.io

기독교 세계관을 담은 게임과 콘텐츠를 만드는 인디 게임 스튜디오, **Studio Nathan(스튜디오 네이선)**의 소개 페이지입니다.

- 주소: https://rluvu2.github.io/
- 게임: [별빛 찻집](https://rluvu2.github.io/starlight-tea/) · [루머스 AD 33](https://rluvu2.github.io/rumors-ad33/)

빌드 없이 그대로 올라가는 정적 사이트입니다. `main`에 push하면 GitHub Pages가 바로 배포합니다.
(`.nojekyll` — Jekyll 처리를 건너뜀)

## 폴더

```
index.html          스튜디오 소개 (표지 · 게임 · 스튜디오 이야기 · 연락)
404.html            없는 주소로 왔을 때
assets/site.css     모든 모양 (색은 맨 위 :root 에 모여 있고, 어두운 화면은 바로 아래)
assets/games/       게임 그림 (WebP, tools 로 만듦)
favicon.svg · favicon.ico · apple-touch-icon.png   등잔 표지 아이콘
og-image.png        카카오톡·SNS 링크 미리보기 (1200×630)
assets-src/         게임 그림 원본 (표지 · 플레이 화면)
tools/build-assets.mjs   아이콘 · 미리보기 · WebP 를 만드는 도구
```

## 자주 하는 손질

| 하고 싶은 것 | 고칠 곳 |
|---|---|
| 문구 바꾸기 | `index.html` |
| 스튜디오 이름 바꾸기 | `index.html`(제목·표지·바닥글·메타), `404.html`, `tools/build-assets.mjs`(미리보기 그림) |
| 새 게임 넣기 | `index.html`의 `<article class="feature">` 하나를 복사 (두 번째처럼 `feature-reverse`를 붙이면 그림이 오른쪽) → 그림 원본을 `assets-src/`에 두고 `tools/build-assets.mjs`의 `GAME_IMAGES`에 한 줄 |
| 색 바꾸기 | `assets/site.css` 맨 위 `:root` |
| 아이콘·미리보기 다시 만들기 | `node tools/build-assets.mjs` (처음 한 번 `npm i -D puppeteer-core`, 크롬·엣지 필요) |

## 표지 이야기

- **이름:** 만든 사람의 이름 Nathan. 히브리어 나단(נָתָן)은 ‘그가 주셨다’는 뜻이고, 선지자 나단은 다윗 왕에게 이야기 하나로 진실을 전했습니다(사무엘하 12장).
- **등잔:** “주의 말씀은 내 발에 등이요 내 길에 빛이니이다”(시편 119:105). 별빛 찻집의 촛불, 루머스 AD 33의 등잔과도 이어집니다.
- **루머스 AD 33 소개에는 결말을 적지 않습니다.** 게임의 원칙(“무엇을 보게 되는지는 걸어 본 사람만”)을 따릅니다.

## 덤

이 저장소가 도메인 맨 앞(`rluvu2.github.io/`)이라, 여기의 `favicon.ico`는 자기 아이콘이 없는 하위 게임(루머스 AD 33)의 탭 아이콘으로도 쓰입니다.
