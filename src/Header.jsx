import "./Header.css";
import { supabase } from "./supabase";
import { Routes, Route, BrowserRouter, NavLink } from "react-router-dom";
import Users from "./Users";
import Posts from "./Posts";
import Tasks from "./Tasks";
import Groups from "./Groups";
import Chat from "./Chat"

const Header = () => {
  async function Logout() {
    await supabase.auth.signOut();
  }

  return (
    <BrowserRouter>
      <header className="header">
        <div className="header-container">
          {/* Логотип */}
          <div className="logo">
            <div className="logo-icon">🎮</div>
            <div className="logo-text">
              <span className="logo-main">GAME</span>
              <span className="logo-sub">social</span>
            </div>
          </div>

          {/* <NavLink to={"/profile"}>f</NavLink> */}
          <NavLink to={"/users"}>Пользователи</NavLink>
          <NavLink to={"/groups"}>Группы</NavLink>
          <NavLink to={"/tasks"}>Задания</NavLink>

          {/* Правая часть */}
          <div className="header-right">
            <button className="notification-btn">
         
              <span className="badge">2</span>
            </button>
            <button onClick={Logout} className="create-post-btn">
              🔙Выйти
            </button>
          </div>
        </div>
      </header>

      {/* Основная навигация */}
      <nav className="nav">
        <Routes>
          <Route
            path="/posts"
            element={<Posts />}
            icon="📝"
            text="Посты"
            active={true}
          />
          <Route path="/users" element={<Users />} icon="👥" text="Люди" />
          <Route path="/groups" element={<Groups />} icon="👾" text="Группы" />
          <Route
            path="/tasks"
            element={<Tasks />}
            icon="🎯"
            text="Задания"
            badge="3"
          />
          <Route path="/chat/:userId" element={<Chat />}></Route>
          {/* <Route
                path="/profile"
                element={<Dashboard />}
                icon="👤"
                text="Профиль"
              /> */}
        </Routes>
      </nav>
    </BrowserRouter>
  );
};

export default Header;
