import "./Chat.css";
import { supabase } from "./supabase";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// стейт - хранилище.

export default function Chat() {
  const { userId } = useParams(); //id собеседника из URL
  const [messages, setMessages] = useState([]); //история сообщений
  const [msg, setMsg] = useState(""); //текущее сообщение
  const [user, setUser] = useState(null); //Я мой аккаунт

  // подгрузка нашего id
  useEffect(() => {
    async function loadData() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }

    loadData();
  }, []);

  // подгрузка данных собеседника

  useEffect(() => {
    if (!user || !userId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("msg")
        .select("*")
        .or(
          `and(sender.eq.${user.id},getter.eq.${userId}),and(sender.eq.${userId},getter.eq.${user.id})`,
        )
        .order("created_at", { ascending: true }); //фильтр по дате создания
      if (!error) setMessages(data);
    };

    fetchMessages();

    const subscription = supabase
      .channel(`msg:${user.id}-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "msg",
          filter: `or(and(sender.eq.${user.id},getter.eq.${userId}),and(sender.eq.${userId},getter.eq.${user.id}))`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        },
      )

      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, userId]); //подгрузка сообщений происходит.

  //когда меняется id ваш или вашего собеседника

  //когда нажимаю кнопку отправить
  async function sendMessage() {
    await supabase.from("msg").insert({
      text: msg,
      sender: user.id,
      getter: userId,
    });
  }

  return (
    <div className="chat">
      <h3 className="chat-name">{userId}</h3>

      {messages.map((m) => (
        <p>{m.text}</p>
      ))}

      <div className="chat-submit">
        <input
          onChange={(event) => setMsg(event.target.value)}
          className="chat-input"
        ></input>
        <button onClick={sendMessage} className="chat-btn">
          Отправить
        </button>
      </div>
    </div>
  );
}
