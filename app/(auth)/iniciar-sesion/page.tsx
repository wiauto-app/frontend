import LoginForm from "@/app/(auth)/components/LoginForm";

export default async function Page() {
  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <div className="container mx-auto my-5 flex justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
