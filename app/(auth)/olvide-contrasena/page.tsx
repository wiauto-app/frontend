import ForgotPasswordForm from "@/app/(auth)/components/ForgotPasswordForm";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <ForgotPasswordForm />
    </div>
  )
}
