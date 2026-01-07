import { useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer/Footer";
import Home from "./pages/Home/Home";
import About from "./pages/About/Greeting/Greeting";
import Vision from "./pages/About/Vision/Vision";
import History from "./pages/About/History/History";
import Service from "./pages/About/Service/Service";
import { RecipeOfWeek } from "./pages/Recipe/RecipeOfWeek";
import AllRecipePage from "./pages/Recipe/AllRecipePage";
import { RecipeDetailPage } from "./pages/RecipeDetail/RecipeDetailPage";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import OAuthCallback from "./pages/OAuthCallback/OAuthCallback";
import { MyPage } from "./pages/Mypage/MyPage";
import { ProfileEditPage } from "./pages/Mypage/components/profile/ProfileEditPage";
import { SearchPage } from "./pages/search/SearchPage";
import NoticePage from "./pages/Notice/NoticePage";
import NoticeEditPage from "./pages/NoticeEdit/NoticeEditPage";
import NoticeRegisterPage from "./pages/NoticeRegister/NoticeRegisterPage";
import Grocery from "./pages/Grocery/Grocery";
import Contact from "./pages/Contact/Contact";
import Location from "./pages/Location/Location";
import RecipeEditPage from "./pages/RecipeEdit/RecipeEditPage";
import RecipeRegisterPage from "./pages/RecipeRegister/RecipeRegisterPage";
import FridgePanel from "./components/fridge/FridgePanel";
import { NotificationPanel } from "./components/notifications/NotificationPanel/NotificationPanel";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isFridgePanelOpen, setIsFridgePanelOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const hideHeaderFooter =
    location.pathname === "/recipe/week" ||
    location.pathname === "/mypage" ||
    location.pathname === "/profile-edit" ||
    location.pathname === "/search" ||
    location.pathname.startsWith("/notice/edit");

  const closeAllPanels = () => {
    setIsFridgePanelOpen(false);
    setIsNotificationOpen(false);
  };

  const toggleFridgePanel = () => {
    setIsNotificationOpen(false); // 다른 패널 닫기
    setIsFridgePanelOpen(!isFridgePanelOpen);
  };

  const toggleNotificationPanel = () => {
    setIsFridgePanelOpen(false); // 다른 패널 닫기
    setIsNotificationOpen(!isNotificationOpen);
  };

  return (
    <>
      <Header
        isNotificationOpen={isNotificationOpen}
        isFridgePanelOpen={isFridgePanelOpen} 
        toggleFridgePanel={toggleFridgePanel}
        toggleNotificationPanel={toggleNotificationPanel}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* About */}
        <Route path="/about" element={<About />} />
        <Route path="/vision" element={<Vision />} />
        <Route path="/history" element={<History />} />
        <Route path="/service" element={<Service />} />

        {/* Recipe */}
        <Route path="/recipe/week" element={<RecipeOfWeek />} />
        <Route path="/recipe/all" element={<AllRecipePage />} />
        <Route path="/recipe/:id" element={<RecipeDetailPage />} />
        <Route path="/recipe/edit/:id" element={<RecipeEditPage />} />
        <Route path="/recipe/register" element={<RecipeRegisterPage />} />

        {/* Search */}
        <Route path="/search" element={<SearchPage />} />

        {/* Grocery */}
        <Route path="/grocery" element={<Grocery />} />

        {/* Contact Us */}
        <Route path="/notice" element={<NoticePage />} />
        <Route path="/notice/edit/:id" element={<NoticeEditPage />} />
        <Route path="/notice/register" element={<NoticeRegisterPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/location" element={<Location />} />

        {/* Mypage */}
        <Route path="/mypage" element={<MyPage onNavigateToEditProfile={() => navigate('/profile-edit')} />} />
        <Route path="/profile-edit" element={<ProfileEditPage onBack={() => navigate('/mypage')} />} />

        {/* 로그인 / 회원가입 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
      </Routes>
      <FridgePanel isOpen={isFridgePanelOpen} onClose={toggleFridgePanel} />
      <NotificationPanel isOpen={isNotificationOpen} onClose={toggleNotificationPanel} />
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

export default App;
