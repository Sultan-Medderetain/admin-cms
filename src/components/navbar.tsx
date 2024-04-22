import { UserButton, auth, redirectToSignIn } from "@clerk/nextjs";
import { MainNav } from "./main-nav";
import prismadb from "@/lib/prismadb";
import StoreSwitcher from "./store-switcher";

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId: userId,
    },
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
