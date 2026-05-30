import LoginForm from "@/app/(auth)/components/LoginForm";
import { NEWSLETTER_FALLBACK } from "@/app/(public)/vehiculos/constants";
import { Footer, NewsletterSection } from "@/components/home";


export default async function Page() {
  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <div className="container mx-auto my-5 flex justify-center">
        <LoginForm />
    </div>
      <NewsletterSection data={NEWSLETTER_FALLBACK} />
      <Footer />
    </div>
  )
}
