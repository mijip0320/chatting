import ChatHeader from "@/components/ChatHeader";

export default function Page() {
  //https://www.youtube.com/watch?v=-xXASlyU0Ck
  return (
    <div className="max-w-3xl mx-auto md:py-10 h-screen">
      <div className=" h-full border rounded-md flex flex-col relative">
        <ChatHeader />
      </div>
    </div>
  );
}
