import { redirect } from "next/navigation";
import { auth } from "../auth";
import SignIn from "../components/auth/SignIn";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/home");
  }
  return <SignIn/>;
}