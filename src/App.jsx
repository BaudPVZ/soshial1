// Соц сеть с системой прокачки. уровни и за уровни
// Убрать как на мобилке фон

import { useState, useEffect } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import { supabase } from "./supabase";
import Header from "./Header";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем текущую сессию
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Слушаем изменения аутентификации
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div>
      {/* если не вошли в ЛК */}
      {!session ? (
        <Login />
      ) : (
        <Header />
        // <Dashboard key={session.user.id} session={session} />
      )}
    </div>
  );
}

export default App;
