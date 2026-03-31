import { useState, useEffect } from "react";
import { supabase } from "./supabase";

function Dashboard({ session }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile();
  }, [session]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <nav>
        <div>
          <div>
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Социальная сеть
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {profile?.username || session.user.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Ваш профиль</h2>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">
                  Уровень: {profile?.level || 1}
                </h3>
                <span className="text-gray-600">
                  Опыт: {profile?.experience || 0}/1000
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                  style={{
                    width: `${((profile?.experience || 0) % 1000) / 10}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Статистика</h4>
                <p>Email: {session.user.email}</p>
                <p>Имя пользователя: {profile?.username || "Не установлено"}</p>
                <p className="mt-2">
                  Дата регистрации:{" "}
                  {new Date(profile?.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">
                  Достижения
                </h4>
                <p>Система прокачки в разработке...</p>
                <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Получить опыт
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
