import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import { Input } from "@/components/ui/input";
import InitUser from "@/lib/store/InitUser";
import { supabaseServer } from "@/lib/supabase/server";

export default async function Page() {
  //https://www.youtube.com/watch?v=-xXASlyU0Ck
  const supabase = supabaseServer();
  const data = (await supabase).auth.getSession();

  console.log("data :: ", data);

  return (
    <>
      <InitUser user={(await data).data.session?.user} />

      <div className="max-w-3xl mx-auto md:py-10 h-screen">
        <div className=" h-full border rounded-md flex flex-col relative">
          <ChatHeader user={(await data).data.session?.user} />
          <div className="flex-1 flex flex-col p-5 h-full overflow-y-auto ">
            <div className="flex-1"></div>
            <div className="space-y-7">
              <div className="flex gap-2">
                <div className="h-10 w-10 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <h1 className="font-bold">Miji</h1>
                    <h1 className="text-sm text-gray-400 ">
                      {new Date().toDateString()}
                    </h1>
                  </div>
                  <p className="text-gray-300">
                    Displays a form input field or a component that looks like
                    an input field.Displays a form input field or a component
                    that looks like an input field. Displays a form input field
                    or a component that looks like an input field. Displays a
                    form input field or a component that looks like an input
                    field.Displays a form input field or a component that looks
                    like an input field.Displays a form input field or a
                    component that looks like an input field.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <ChatInput />
        </div>
      </div>
    </>
  );
}
