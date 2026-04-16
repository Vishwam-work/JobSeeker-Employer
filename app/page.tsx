import EmployerHeader from "@/components/Employerheader";
import EmployerFooter from "@/components/Employerfooter";
import EmployerHome from "@/components/Home";
import CookieConsent from "@/components/Cookie";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <EmployerHeader />
      <EmployerHome />
      <EmployerFooter />
      <CookieConsent />
    </div>
  );
}
