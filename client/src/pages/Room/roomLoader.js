import { getRoomId } from "../../utils/utils";
import { getCodingRoomById } from "../../services/codingRoomService";
import { redirect } from "react-router-dom";
import { connectSocket } from "../../services/socketService";
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
