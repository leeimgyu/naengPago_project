## 코드 구조 가이드라인

### 컴포넌트 중심 개발
* 하나의 파일에 모든 코드를 작성하지 말고, 재사용 가능한 작은 컴포넌트로 분리
* 각 컴포넌트는 단일 책임 원칙(Single Responsibility Principle)을 따름
* 컴포넌트는 `/components` 디렉토리 내에 기능별로 구분하여 배치
* 페이지 레벨 컴포넌트는 주로 레이아웃과 상태 관리를 담당하고, UI 렌더링은 하위 컴포넌트에 위임

### 파일 명명 규칙
* 컴포넌트 파일명은 PascalCase 사용 (예: `ProfileBanner.tsx`, `RecipeCard.tsx`)
* 한 컴포넌트 당 하나의 파일
* 관련된 컴포넌트는 폴더로 그룹화 가능 (예: `/components/mypage/ProfileBanner.tsx`)

### 컴포넌트 설계 원칙
* Props를 통해 데이터와 콜백 함수 전달
* 상태는 가능한 상위 컴포넌트에서 관리하고 필요한 곳에만 전달
* 100줄 이상의 컴포넌트는 분리를 고려
* UI 로직과 비즈니스 로직 분리

### 브랜드 가이드라인
* 브랜드 컬러: #3b6c55 (녹색)
* 폰트: Noto Sans KR
* 미니멀하고 따뜻한 디자인 감각 유지
* 여백과 간격을 충분히 활용하여 가독성 확보

<!--

System Guidelines

Use this file to provide the AI with rules and guidelines you want it to follow.
This template outlines a few examples of things you can add. You can add your own sections and format it to suit your needs

TIP: More context isn't always better. It can confuse the LLM. Try and add the most important rules you need

# General guidelines

Any general rules you want the AI to follow.
For example:

* Only use absolute positioning when necessary. Opt for responsive and well structured layouts that use flexbox and grid by default
* Refactor code as you go to keep code clean
* Keep file sizes small and put helper functions and components in their own files.

--------------

# Design system guidelines
Rules for how the AI should make generations look like your company's design system

Additionally, if you select a design system to use in the prompt box, you can reference
your design system's components, tokens, variables and components.
For example:

* Use a base font-size of 14px
* Date formats should always be in the format “Jun 10”
* The bottom toolbar should only ever have a maximum of 4 items
* Never use the floating action button with the bottom toolbar
* Chips should always come in sets of 3 or more
* Don't use a dropdown if there are 2 or fewer options

You can also create sub sections and add more specific details
For example:


## Button
The Button component is a fundamental interactive element in our design system, designed to trigger actions or navigate
users through the application. It provides visual feedback and clear affordances to enhance user experience.

### Usage
Buttons should be used for important actions that users need to take, such as form submissions, confirming choices,
or initiating processes. They communicate interactivity and should have clear, action-oriented labels.

### Variants
* Primary Button
  * Purpose : Used for the main action in a section or page
  * Visual Style : Bold, filled with the primary brand color
  * Usage : One primary button per section to guide users toward the most important action
* Secondary Button
  * Purpose : Used for alternative or supporting actions
  * Visual Style : Outlined with the primary color, transparent background
  * Usage : Can appear alongside a primary button for less important actions
* Tertiary Button
  * Purpose : Used for the least important actions
  * Visual Style : Text-only with no border, using primary color
  * Usage : For actions that should be available but not emphasized
-->