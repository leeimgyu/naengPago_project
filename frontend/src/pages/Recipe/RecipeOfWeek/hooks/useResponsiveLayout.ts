import { useState, useEffect } from 'react';

export function useResponsiveLayout() {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [sidePadding, setSidePadding] = useState("4rem");
  const [contentPaddingLeft, setContentPaddingLeft] = useState("8rem");
  const [contentPaddingRight, setContentPaddingRight] = useState("8rem");

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      setHeaderHeight(header.clientHeight);
    }

    const handleResize = () => {
      const width = window.innerWidth;
      let newSidePadding;
      let newContentPaddingLeft;
      let newContentPaddingRight;

      if (width < 768) {
        // 모바일: FixedTitle이 없으므로 좌우 패딩 동일
        newSidePadding = "2rem";
        newContentPaddingLeft = "2rem";
        newContentPaddingRight = "2rem";
      } else if (width < 1680) {
        // 태블릿/작은 데스크탑: FixedTitle과의 간격을 위해 왼쪽 패딩을 더 줌
        newSidePadding = "4rem";
        newContentPaddingLeft = "6rem"; // sidePadding(4rem) + gap(2rem)
        newContentPaddingRight = "4rem";
      } else {
        // 큰 데스크탑: 좌우 동일하게 넓은 간격
        newSidePadding = "4rem";
        newContentPaddingLeft = "8rem";
        newContentPaddingRight = "8rem";
      }

      setSidePadding(newSidePadding);
      setContentPaddingLeft(newContentPaddingLeft);
      setContentPaddingRight(newContentPaddingRight);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { headerHeight, sidePadding, contentPaddingLeft, contentPaddingRight };
}
