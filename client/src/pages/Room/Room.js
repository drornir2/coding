import React, { useContext, createContext, useEffect, useState } from "react";
import { redirect, useLoaderData } from "react-router-dom";
import { Navbar, CodeEditor, SmileyCard } from "../../components/index";
import { toast } from "react-toastify";
import "./room.css";
import {
  checkSolution,
  getCodingRoomById,
} from "../../services/codingRoomService";
import {
  connectSocket,
  joinRoom,
  leaveRoom,
  sendCode,
  receiveCode,
} from "../../services/socketService";
import { getRoomId } from "../../utils/utils";

export const loader = async ({ request }) => {
  try {
    const roomId = getRoomId(request.url);
    const codingRoom = await getCodingRoomById(roomId);
    await connectSocket();
    return codingRoom;
  } catch {
    return redirect("/"); //redirect to lobby in case of error
  }
};

const RoomContext = createContext();
const Room = () => {
  const { codingRoom } = useLoaderData();
  const { _id, name, description, currentCode } = codingRoom;
  const [editorContent, setEditorContent] = useState(currentCode);
  const [isMentor, setIsMentor] = useState(null);
  const [isCodeCorrect, setIsCodeCorrect] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await joinRoom(_id, (isFirst) => {
        setIsMentor(!isMentor ? isFirst : isMentor);
      });
    };
    fetchData();
  }, []);

  const onEditorChange = (newValue, event) => {
    sendCode(_id, newValue);
    setEditorContent(newValue);
  };
  const onLeaveRoom = () => {
    leaveRoom(_id);
  };
  receiveCode((code) => {
    setEditorContent(code);
  });

  const onCheckSolution = async () => {
    try {
      const { isSolved } = await checkSolution(_id);
      if (isSolved) setIsCodeCorrect(true);
      else {
        setIsCodeCorrect(false);
        toast.error("code incorrect.... try again");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <RoomContext.Provider
      value={{ isMentor, onEditorChange, onLeaveRoom, editorContent }}
    >
      <section className="room-section">
        <Navbar />
        {isCodeCorrect && <SmileyCard />}
        <header className="room-header">
          <h2 className="room-title">{name}</h2>
          <p className="room-description">{description}</p>
        </header>
        <CodeEditor />
        {!isMentor && (
          <button onClick={onCheckSolution} className="btn">
            check me!
          </button>
        )}
      </section>
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => useContext(RoomContext);
export default Room;
