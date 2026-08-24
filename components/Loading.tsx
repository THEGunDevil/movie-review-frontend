import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-loading">
        <Image
          src="/icon.png"
          alt="Loading"
          width={180}
          height={180}
          priority
        />
      </div>
    </div>
  );
}