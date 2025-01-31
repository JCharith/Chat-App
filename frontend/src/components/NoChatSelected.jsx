const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        {/* Image Display */}
        <div className="flex justify-center mb-4">
          <img
            src="/favicon.jpg"
            alt="Chat Icon"
            className="w-16 h-16 rounded-lg object-cover"
          />
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold">Welcome to ConVerse!</h2>
        <p className="text-base-content/60">
          Select a chat to start annoying your friends!
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
