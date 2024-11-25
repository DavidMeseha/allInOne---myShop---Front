import { Success } from "@/components/Icons";
import { LocalLink } from "@/components/LocalizedNavigation";
import { Dictionaries, getDictionary } from "@/dictionary";

export default async function Page({ params }: { params: { lang: Dictionaries; id: string } }) {
  const dictionary = await getDictionary(params.lang);

  return (
    <div className="mt-28 flex flex-col items-center justify-center">
      <div className="mb-10 w-32 fill-green-600">
        <Success />
      </div>
      <h1 className="mb-4 text-center text-xl font-bold text-strongGray">
        {dictionary["checkout.orderPlacedSuccessfully"]} <span className="text-primary">{params.id}</span>
      </h1>
      <LocalLink className="bg-primary px-6 py-3 text-white" href="/">
        {dictionary["continueShopping"]}
      </LocalLink>
    </div>
  );
}