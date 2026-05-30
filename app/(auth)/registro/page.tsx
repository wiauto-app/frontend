import RegisterForm from "@/app/(auth)/components/RegisterForm";
import { NEWSLETTER_FALLBACK } from "@/app/(public)/vehiculos/constants";
import { Footer, NewsletterSection } from "@/components/home";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <div className="container mx-auto flex justify-center">
        <RegisterForm />
      </div>
      <NewsletterSection data={NEWSLETTER_FALLBACK} />
      <Footer />
    </div>
  )
}