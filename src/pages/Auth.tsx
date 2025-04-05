
import { SignIn, SignUp } from "@clerk/clerk-react";
import { Navbar } from "@/components/Navbar";

interface AuthProps {
  type: "sign-in" | "sign-up";
}

const Auth = ({ type }: AuthProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="mx-auto w-full max-w-md p-4 sm:p-8 bg-card rounded-xl shadow-sm border">
          {type === "sign-in" ? (
            <SignIn
              appearance={{
                elements: {
                  formButtonPrimary: "bg-primary hover:bg-primary/90",
                  card: "shadow-none bg-transparent",
                  headerTitle: "font-serif text-2xl",
                },
              }}
              routing="path"
              path="/sign-in"
              redirectUrl="/dashboard"
            />
          ) : (
            <SignUp
              appearance={{
                elements: {
                  formButtonPrimary: "bg-primary hover:bg-primary/90",
                  card: "shadow-none bg-transparent",
                  headerTitle: "font-serif text-2xl",
                },
              }}
              routing="path"
              path="/sign-up"
              redirectUrl="/dashboard"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
