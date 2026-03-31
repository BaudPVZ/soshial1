import "./Tasks.css";
import { supabase } from "./supabase";
import { useState, useEffect } from "react";

export default function Tasks() {
  // все задачи из БД
  const [kvests, setKvests] = useState([]);

  //подгрузка из БД
  useEffect(() => {
    async function loadData() {
      const { data } = await supabase.from("kvests").select("*");
      setKvests(data);
    }

    loadData();
  }, []);

  return (
    <div>
      <p>Всего ... задач</p>

      <ul>
        {kvests.map((kvest) => {
          return (
            <div className="task">
              <div className="task-content">
                <h2 className="task-title">{kvest.title}</h2>
                <p className="task-description">{kvest.description}</p>
              </div>

              <p className="task-exp">{kvest.exp}</p>

              <div className="task-buttons">
                <button className="task-get">Получить</button>
                <button className="task-pass">Сдать</button>
              </div>
            </div>
          );
        })}
      </ul>
    </div>
  );
}
