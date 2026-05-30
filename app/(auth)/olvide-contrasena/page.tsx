import ForgotPasswordForm from "@/app/(auth)/components/ForgotPasswordForm";
import { NEWSLETTER_FALLBACK } from "@/app/(public)/vehiculos/constants";
import { Footer, NewsletterSection } from "@/components/home";


export default function Page() {
  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <div className="container mx-auto flex justify-center">
        <ForgotPasswordForm />
      </div>
      <NewsletterSection data={NEWSLETTER_FALLBACK} />
      <Footer />
    </div>
  )
}