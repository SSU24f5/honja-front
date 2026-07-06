# honja-front

**Expo SDK**를 기반으로 개발하고, **Feature-Sliced Design (FSD)** 아키텍처를 준수하는 React Native 모바일 애플리케이션입니다.

---

## 🛠 기술 스택 (Tech Stack)

*   **프레임워크**: [Expo SDK 57](https://expo.dev) (React Native 0.86)
*   **아키텍처**: [Feature-Sliced Design (FSD)](https://feature-sliced.design/)
*   **상태 관리**: 
    *   **클라이언트**: [Zustand](https://github.com/pmndrs/zustand)
    *   **서버**: [TanStack Query v5](https://tanstack.com/query/latest)
*   **코드 컨벤션 (Lint & Format)**: [Biome](https://biomejs.dev) (ESLint 및 Prettier의 고성능 올인원 대체 도구)
*   **테스트**: [Jest](https://jestjs.io) & [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)

---

## 📐 디렉터리 구조 (FSD 아키텍처)

프로젝트 구조는 FSD 설계 원칙에 따라 `src/` 디렉터리 아래에 레이어별로 관리됩니다:

```text
src/
├── app/          # 전역 설정, 레이아웃, 전역 컨텍스트 프로바이더 (Expo Router 진입점)
├── pages/        # 화면 단위 페이지 컴포넌트 조합 레이어
├── widgets/      # 독립적으로 작동 가능한 UI 결합체 (피처와 엔티티의 조합)
├── features/     # 비즈니스 가치를 제공하는 사용자 상호작용 기능 (예: CounterButton)
├── entities/     # 비즈니스 도메인 모델, 데이터 구조, 상태 저장소 (예: useCounterStore)
└── shared/       # 재사용 가능한 공통 유틸리티, 설정, API 클라이언트 및 기초 UI 컴포넌트
    ├── api/      # Query Client 설정 및 백엔드 API 연동 부
    ├── config/   # 전역 상수, 환경 변수, 테마 설정 등
    ├── lib/      # 공통 커스텀 훅 및 헬퍼 함수
    └── ui/       # 가장 기저에 위치하는 재사용 가능한 기초 UI 컴포넌트 (버튼, 카드, 텍스트 등)
```

---

## ✒️ 코드 규칙 및 컨벤션 (Biome)

본 프로젝트는 **ESLint**와 **Prettier**를 사용하는 대신, 훨씬 빠르고 일관된 포맷팅/린팅을 지원하는 **Biome**을 사용합니다.

### 규칙 설정 안내 (`biome.json`)
설정은 프로젝트 루트의 [`biome.json`](./biome.json) 파일에 정의되어 있습니다:
*   **포매터 (Formatter)**:
    *   들여쓰기: 2칸 공백 (Spaces) 사용.
    *   따옴표 규칙: 일반 코드 문자열은 홑따옴표(`'...'`), JSX 속성은 쌍따옴표(`"..."`) 사용.
    *   줄바꿈 쉼표: 여러 줄로 구성된 요소들의 마지막 항목에 항상 쉼표(Trailing Comma) 붙임.
    *   최대 너비: 한 줄에 최대 100자 제한.
*   **린터 (Linter)**:
    *   Biome 공식 `recommended` 추천 규칙 모음을 따릅니다.
    *   커스텀 규칙: 논-널 단언 연산자 사용 허용 (`noNonNullAssertion`: off), 미사용 변수는 경고 처리 (`noUnusedVariables`: warn).
*   **가져오기 정렬 (Import Organizer)**:
    *   코드 저장/포맷팅 시 `import` 구문을 자동으로 정렬 및 그룹화합니다.

### 실행 명령어

아래 npm 명령어를 사용하여 코드를 검사하고 수정할 수 있습니다:

```bash
# 코드 린트, 포맷, import 정렬 상태를 검사합니다.
npm run lint

# 자동으로 수정 가능한 규칙(포맷, import 정렬, 린트 에러)을 즉시 반영합니다.
npm run lint:fix

# 파일들의 포맷을 강제로 정리합니다.
npm run format
```

> [!TIP]
> **VS Code 개발 팁**: VS Code 내에 **Biome** 익스텐션을 설치하고 기본 포매터(Default Formatter)로 설정하시면 파일 저장(Save) 시 실시간으로 규칙이 자동 적용됩니다.

---

## 🧪 단위 테스트 (Unit Testing)

**Jest**와 **React Native Testing Library**(RNTL)를 사용한 테스트 환경이 구성되어 있습니다.

```bash
# 전체 테스트 실행
npm run test

# 테스트 감시(Watch) 모드 실행
npm run test:watch
```

*   **CSS 파일 모킹**: 웹 버전을 고려한 `.css` 파일 import 동작 시 Jest가 에러를 발생시키지 않도록 [`jest/mocks/styleMock.js`](./jest/mocks/styleMock.js)를 통해 스타일 관련 구문을 목(mock) 처리하고 있습니다.
*   **RNTL 비동기 API 처리**: React 19 버전을 기반으로 작동하므로, RNTL v14+ 명세에 맞춰 `render`와 `fireEvent` 등의 API를 비동기(`async/await`)로 호출하도록 구성되어 있습니다:
    ```typescript
    const { getByTestId } = await render(<MyComponent />);
    await fireEvent.press(getByTestId('button'));
    ```

---

## 🚀 시작하기

1.  **의존성 패키지 설치**:
    ```bash
    npm install
    ```
2.  **Expo 개발 서버 구동**:
    ```bash
    npm start
    ```
3.  **플랫폼 실행 시 단축키**:
    *   `a` : 안드로이드 에뮬레이터 구동
    *   `i` : iOS 시뮬레이터 구동 (macOS 필요)
    *   `w` : 웹 브라우저 실행
