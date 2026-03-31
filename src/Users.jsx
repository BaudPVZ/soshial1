import { supabase } from "./supabase";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Users.css";

export default function Users() {
  const [users, setUsers] = useState([]);

  //загрузка идет или нет
  const [loading, setLoading] = useState(false);

  //подгрузка пользователей из БД
  useEffect(() => {
    async function LoadUsers() {
      setLoading(true);

      const { data } = await supabase
        .from("profiles")
        .select("id, experience, email, level");

      setUsers(data); //отправляю в users

      setLoading(false);
    }

    LoadUsers();
  }, []);

  return (
    <div className="container">
      <p className="all-users">Всего 10 пользователей</p>
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <ul className="users">
          {users.map((user) => {
            return (
              <li className="user-info">
                <Link to={`/chat/${user.id}`}>
                  <h3 className="user-email">{user.email}</h3>
                  <p className="user-level">LVL {user.level}</p>
                  <p className="user-exp">EXP {user.experience}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// 1 LVL 0-50 exp
// 2 LVL 50-100 exp
// 3 LVL 100-150 exp
// 4 LVL 150-200 exp
// 5 LVL 200-250 exp


// 1 LVL 0-50 exp
// 2 LVL 50-100 exp
// 3 LVL 100-150 exp
// 4 LVL 150-200 exp
// 5 LVL 200-250 exp
