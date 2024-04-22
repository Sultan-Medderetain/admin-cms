import prismadb from "@/lib/prismadb";

interface DashboardPageProps {
  params: { storeId: string };
}

const DashboardPage = async ({ params: { storeId } }: DashboardPageProps) => {
  const store = await prismadb.store.findFirst({
    where: {
      id: storeId,
    },
  });

  return <div className="p-4">Active Store {store?.name}</div>;
};

export default DashboardPage;
