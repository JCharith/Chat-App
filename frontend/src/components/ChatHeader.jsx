import { X, MoreVertical } from "lucide-react";
import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, deleteMessages } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDelete = async () => {
    if (selectedUser) {
      console.log("Deleting chat with:", selectedUser.fullName); // Debugging log
      await deleteMessages(selectedUser._id); // Call store function to delete messages
      setSelectedUser(null); // Optionally deselect the user
      setMenuOpen(false); // Close the menu
    }
  };

  const handleBackup = () => {
    console.log("Backup conversation with:", selectedUser.fullName);
    setMenuOpen(false);
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
              />
            </div>
          </div>
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setSelectedUser(null)}>
            <X />
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="ml-2 p-2 rounded-full hover:bg-base-200"
          >
            <MoreVertical />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg border rounded-md z-10">
              <ul>
                <li>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-2 hover:bg-base-200"
                  >
                    Delete
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleBackup}
                    className="w-full text-left px-4 py-2 hover:bg-base-200"
                  >
                    Backup
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
