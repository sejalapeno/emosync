import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center align-middle">
      <div className="w-full max-w-md">
        <SignIn />
      </div>
    </div>
  );
}
