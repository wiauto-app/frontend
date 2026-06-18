import { getPageData } from "./services/getPageData";

export default async function Page() {
  const data = await getPageData();
  console.log(data);
  return (
    <div></div>
  );
}