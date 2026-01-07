/// <reference types="vite/client" />

// Environment Variables 타입 선언
interface ImportMetaEnv {
  readonly VITE_KAKAO_MAP_APP_KEY: string;
  // 필요시 다른 환경 변수 추가
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// CSS Module 타입 선언
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

// 이미지 파일 타입 선언
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

// 비디오 파일 타입 선언
declare module '*.mp4' {
  const content: string;
  export default content;
}

declare module '*.webm' {
  const content: string;
  export default content;
}
