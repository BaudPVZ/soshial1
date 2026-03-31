import { useState } from "react";
import { supabase } from "./supabase";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        // ТОЛЬКО РЕГИСТРАЦИЯ В AUTH - ПРОФИЛЬ СОЗДАСТСЯ АВТОМАТИЧЕСКИ
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          await supabase.from("profiles").insert({
            id: data.user.id,
            username: username || email.split("@")[0],
            email: email,
            level: 1,
            experience: 0,
            updated_at: new Date().toISOString(),
          });
        }

        setMessage(
          "Регистрация успешна! Проверьте вашу почту для подтверждения."
        );

        // Очистка формы
        setEmail("");
        setPassword("");
        setUsername("");

        // Автоматический переход ко входу
        setTimeout(() => {
          setIsSignUp(false);
          setMessage(null);
        }, 3000);
      } else {
        // ВХОД
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // После успешного входа перенаправляем
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Auth error:", error);

      // Простые сообщения об ошибках
      if (error.message.includes("already registered")) {
        setError("Этот email уже зарегистрирован");
      } else if (error.message.includes("Invalid login")) {
        setError("Неверный email или пароль");
      } else if (error.message.includes("Email not confirmed")) {
        setError("Подтвердите email");
      } else if (error.message.includes("weak")) {
        setError("Пароль слишком слабый");
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h2 className="login-title">
            {isSignUp ? "Создать аккаунт" : "Войти в систему"}
          </h2>
          <p className="login-subtitle">Социальная сеть с системой прокачки</p>
          <div className="level-badge">Уровень 1</div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          {message && <div className="success-message">{message}</div>}

          <div className="form-fields">
            {isSignUp && (
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  <span className="label-icon">👤</span> Имя пользователя
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Введите имя пользователя"
                  className="form-input"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <span className="label-icon">✉️</span> Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите ваш email"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <span className="label-icon">🔒</span> Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                minLength="6"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-action">
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? (
                <span className="loading-content">
                  <svg
                    className="loading-spinner"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Обработка...
                </span>
              ) : isSignUp ? (
                "🎮 Начать игру!"
              ) : (
                "🚀 Войти в систему"
              )}
            </button>
          </div>
        </form>

        <div className="social-login">
          <div className="divider">
            <div className="divider-line" />
            <div className="divider-text">
              <span>Или войдите через</span>
            </div>
          </div>

          <div className="social-buttons">
            <button
              onClick={() => handleSocialLogin("github")}
              className="social-btn github-btn"
            >
              <span className="social-icon">🐙</span> GitHub
            </button>
            <button
              onClick={() => handleSocialLogin("google")}
              className="social-btn google-btn"
            >
              <span className="social-icon">🔍</span> Google
            </button>
          </div>
        </div>

        <div className="toggle-mode">
          <button onClick={() => setIsSignUp(!isSignUp)} className="toggle-btn">
            {isSignUp
              ? "Уже есть аккаунт? Войти"
              : "Нет аккаунта? Зарегистрироваться"}
          </button>
        </div>

        <div className="game-features">
          <div className="feature">
            <span className="feature-icon">⭐</span>
            <span className="feature-text">Прокачивай уровень</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🏆</span>
            <span className="feature-text">Получай достижения</span>
          </div>
          <div className="feature">
            <span className="feature-icon">👥</span>
            <span className="feature-text">Общайся с игроками</span>
          </div>
        </div>
      </div>

      <div className="game-elements">
        <div className="pixel-1">🎮</div>
        <div className="pixel-2">✨</div>
        <div className="pixel-3">💎</div>
        <div className="pixel-4">⚡</div>
        <div className="pixel-5">🌟</div>
      </div>
    </div>
  );
}

export default Login;
