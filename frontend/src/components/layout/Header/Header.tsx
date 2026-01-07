import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import styles from "./Header.module.css";
import greenLogo from "@/assets/image/logo/green_logo.png";
import { SearchPanel } from "@/pages/search/components/SearchPanel/SearchPanel";
import {
  Menu,
  X,
  LogIn,
  UserPlus,
  Refrigerator,
  Bell,
  Search,
  LogOut,
} from "lucide-react";

interface HeaderProps {
  toggleFridgePanel: () => void;
  toggleNotificationPanel: () => void;
  isFridgePanelOpen: boolean;
  isNotificationOpen: boolean;
}

function Header({
  toggleFridgePanel,
  toggleNotificationPanel,
  isNotificationOpen,
  isFridgePanelOpen,
}: HeaderProps) {
  const { isAuthenticated, logout, user, expiringItems, recentNotices } =
    useAuth();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  //header event 처리
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visible, setVisible] = useState(true);

  const controlHeader = () => {
    if (typeof window !== "undefined") {
      // 스크롤 시 패널들 닫기
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        // 아래로 스크롤할 때
        if (isFridgePanelOpen) {
          toggleFridgePanel();
        }
        if (isNotificationOpen) {
          toggleNotificationPanel();
        }
      }

      // 헤더 숨김/보임 처리
      if (window.scrollY > 100 && window.scrollY > lastScrollY) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlHeader);
      return () => {
        window.removeEventListener("scroll", controlHeader);
      };
    }
  }, [lastScrollY, isFridgePanelOpen, isNotificationOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  // 검색 처리
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchOpen(true);
  };

  const handleSearchIconClick = () => {
    setIsSearchOpen(true);
  };

  const handleInputClick = () => {
    setIsSearchOpen(true);
  };

  const aboutPaths = ["/about", "/vision", "/history", "/service"];
  const isAboutActive = aboutPaths.includes(location.pathname);

  const contactPaths = ["/contact", "/notice", "/location"];
  const isContactActive = contactPaths.includes(location.pathname);

  const renderNavLinks = (isMobile: boolean) => (
    <ul className={isMobile ? styles.mobileNavList : styles.desktopNavList}>
      <li className={`${styles.navItem} ${styles.hasDropdown}`}>
        <NavLink to="/about" className={isAboutActive ? "active" : ""}>
          About
        </NavLink>
        <ul className={styles.dropdownMenu}>
          <li>
            <NavLink
              to="/about"
              onClick={closeMenu}
              className={styles.dropdownLink}
            >
              인사말
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/vision"
              onClick={closeMenu}
              className={styles.dropdownLink}
            >
              비전
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/history"
              onClick={closeMenu}
              className={styles.dropdownLink}
            >
              연혁
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/service"
              onClick={closeMenu}
              className={styles.dropdownLink}
            >
              서비스 소개
            </NavLink>
          </li>
        </ul>
      </li>
      <li className={`${styles.navItem} ${styles.hasDropdown}`}>
        <NavLink
          to="/recipe/week"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Recipe
        </NavLink>
        <ul className={styles.dropdownMenu}>
          <li>
            <NavLink
              to="/recipe/week"
              onClick={closeMenu}
              className={styles.dropdownLink}
            >
              Recipe of Week
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/recipe/all"
              onClick={closeMenu}
              className={styles.dropdownLink}
            >
              All Recipe
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/recipe/register"
              onClick={closeMenu}
              className={styles.dropdownLink}
            >
              레시피 등록
            </NavLink>
          </li>
        </ul>
      </li>
      <li className={styles.navItem}>
        <NavLink
          to="/grocery"
          onClick={closeMenu}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Grocery
        </NavLink>
      </li>
      <li className={`${styles.navItem} ${styles.hasDropdown}`}>
        <NavLink to="/contact" className={isContactActive ? "active" : ""}>
          Contact Us
        </NavLink>
        <ul className={styles.dropdownMenu}>
          <li>
            <NavLink
              to="/notice"
              onClick={closeMenu}
              className={styles.dropdownLink}
            >
              공지사항
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              onClick={closeMenu}
              className={styles.dropdownLink}
            >
              1:1 문의
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/location"
              onClick={closeMenu}
              className={styles.dropdownLink}
            >
              오시는 길
            </NavLink>
          </li>
        </ul>
      </li>
    </ul>
  );

  return (
    <>
      <header
        className={`${styles.siteHeader} ${!visible ? styles.hidden : ""}`}
      >
        <div className={`${styles.container} ${styles.headerContainer}`}>
          <h1 className={styles.logo}>
            <Link to="/" aria-label="냉파고 홈페이지">
              <img
                className={styles.greenLogo}
                src={greenLogo}
                alt="냉파고 로고"
              />
              <span>aengpago</span>
            </Link>
          </h1>

          <div className={styles.desktopNavWrapper}>
            <nav
              className={styles.navigation}
              role="navigation"
              aria-label="주요 네비게이션"
            >
              {renderNavLinks(false)}
            </nav>
            <ul className={`${styles.iconNav} hidden 2xl:flex`}>
              <li className={styles.navItem}>
                <form
                  onSubmit={handleSearchSubmit}
                  className={styles.searchForm}
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={handleInputClick}
                    placeholder="검색어를 입력하세요..."
                    className={styles.searchInput}
                    aria-label="검색"
                  />
                  <button
                    type="button"
                    onClick={handleSearchIconClick}
                    className={styles.searchButton}
                    aria-label="검색 실행"
                  >
                    <Search className={styles.searchIcon} />
                  </button>
                </form>
              </li>
            </ul>
          </div>

          <div className={styles.headerRight}>
            {isAuthenticated ? (
              <>
                <Link to="/mypage" className={styles.userGreeting}>
                  <strong>{user?.username}</strong>님
                </Link>
                <button
                  onClick={toggleFridgePanel}
                  className={styles.iconWrapper}
                  aria-label="내 냉장고"
                >
                  <Refrigerator className={styles.icon} />
                </button>
                <button
                  onClick={toggleNotificationPanel}
                  className={styles.iconWrapper}
                  aria-label="알림"
                  style={{ position: "relative" }}
                >
                  <Bell className={styles.icon} />
                  {expiringItems.length + recentNotices.length > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-4px",
                        right: "-4px",
                        backgroundColor: "#ef4444",
                        color: "white",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: "bold",
                        border: "2px solid white",
                      }}
                    >
                      {expiringItems.length + recentNotices.length > 9
                        ? "9+"
                        : expiringItems.length + recentNotices.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className={`${styles.iconWrapper} 2xl:hidden`}
                  aria-label="검색"
                >
                  <Search className={styles.searchIcon} />
                </button>
                <button
                  onClick={logout}
                  className={`${styles.iconWrapper} hidden md:flex`}
                  aria-label="로그아웃"
                >
                  <LogOut className={styles.icon} />
                  {/* <img src={logoutIcon} alt="로그아웃" className={styles.icon} /> */}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className={`${styles.iconWrapper} 2xl:hidden`}
                  aria-label="검색"
                >
                  <Search className={styles.searchIcon} />
                </button>
                <Link to="/login" className={styles.authTextButton}>
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className={`${styles.authTextButton} ${styles.btnPrimary}`}
                >
                  회원가입
                </Link>

                <Link
                  to="/login"
                  className={styles.authIconButton}
                  aria-label="로그인"
                >
                  <LogIn />
                </Link>
                <Link
                  to="/signup"
                  className={styles.authIconButton}
                  aria-label="회원가입"
                >
                  <UserPlus />
                </Link>
              </>
            )}
            <button
              className={styles.hamburger}
              onClick={() => setIsMenuOpen(true)}
              aria-label="메뉴 열기"
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>

      <div className={`${styles.mobileNav} ${isMenuOpen ? styles.open : ""}`}>
        <div className={styles.mobileNavHeader}>
          <button onClick={closeMenu} aria-label="메뉴 닫기">
            <X />
          </button>
        </div>
        <nav
          className={styles.mobileNavMenu}
          role="navigation"
          aria-label="모바일 네비게이션"
        >
          {renderNavLinks(true)}
        </nav>
        <div className={styles.mobileAuthSection}>
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                closeMenu();
              }}
              className={styles.mobileAuthAction}
            >
              로그아웃
            </button>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
                className={styles.mobileAuthAction}
              >
                로그인
              </Link>
              <Link
                to="/signup"
                onClick={closeMenu}
                className={styles.mobileAuthAction}
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
      {isMenuOpen && <div className={styles.overlay} onClick={closeMenu}></div>}

      <SearchPanel
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}

export default Header;
