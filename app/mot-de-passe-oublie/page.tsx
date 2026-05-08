import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import BearLogo from "@/components/ui/BearLogo";

export default function MotDePasseOubliePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4 bg-[#FAFAFA]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <BearLogo size="md" showTagline className="justify-center mb-4" />
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Mot de passe oublié ?</h1>
            <p className="text-sm text-[#6B7280] mt-2">
              Entrez votre adresse email et nous vous enverrons un lien de réinitialisation.
            </p>
          </div>

          <div className="bg-white border border-[#E5D8BC] rounded-2xl p-8 shadow-sm">
            <form className="flex flex-col gap-5">
              <Input
                label="Adresse email"
                type="email"
                placeholder="votre@email.fr"
                autoComplete="email"
              />
              <Button type="submit" className="w-full">Envoyer le lien →</Button>
            </form>

            <p className="text-center text-sm text-[#6B7280] mt-6">
              Vous vous souvenez ?{" "}
              <Link href="/connexion" className="text-[#C9A84C] hover:underline font-medium">
                Se connecter
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-[#9CA3AF] mt-4">
            Si vous n&apos;avez pas de compte,{" "}
            <Link href="/comparer" className="text-[#C9A84C] hover:underline">
              commencez une comparaison gratuitement
            </Link>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
