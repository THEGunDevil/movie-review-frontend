import { ArrowUpRight, Mail } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function ContactBand() {
  return (
    <section id="contact" className="bg-white">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
        <div>
          <p className="text-sm font-semibold text-[#c23a32]">
            Portfolio contact
          </p>
          <h2 className="mt-2 text-3xl font-semibold leading-tight">
            Available for festival dispatches, capsule packages, and editorial
            commissions.
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="mailto:hello@framewise.dev">
            <Button className="bg-[#171412] text-white hover:bg-[#2b2623]">
              <Mail />
              hello@framewise.dev
            </Button>
          </Link>
          <Link href="#reviews">
            <Button className="border-[#cad2df] bg-white text-[#171412] hover:bg-[#eef2f6]">
              <ArrowUpRight />
              Writing samples
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
