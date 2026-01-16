import Image from "next/image";

const careerCards = [
  {
    id: 1,
    title: "Life Insurance update",
    description: "We offer a variety of life insurance options which gives peace of mind & financial security to you and your family.",
    image: "/assets/images/8jc9fH3B63sSTdln1747924955.png",
    color: "blue",
    borderColor: "border-blue-400",
    textColor: "text-blue-600",
  },
  {
    id: 2,
    title: "Life Insurance",
    description: "We offer a variety of life insurance options which gives peace of mind & financial security to you and your family.",
    image: "/assets/images/kNN4g6hmCmM5HZvO1747642029.png",
    color: "pink",
    borderColor: "border-pink-400",
    textColor: "text-pink-600",
  },
  {
    id: 3,
    title: "testttt",
    description: "We offer a variety of life insurance options which gives peace of mind & financial security to you and your family.",
    image: "/assets/images/8jc9fH3B63sSTdln1747924955.png",
    color: "green",
    borderColor: "border-green-400",
    textColor: "text-green-600",
  },
  {
    id: 4,
    title: "Life Insuran",
    description: "We offer a variety of life insurance options which gives peace of mind & financial security to you and your family.",
    image: "/assets/images/kNN4g6hmCmM5HZvO1747642029.png",
    color: "orange",
    borderColor: "border-orange-400",
    textColor: "text-orange-600",
  },
  {
    id: 5,
    title: "testing final",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    image: "/assets/images/8jc9fH3B63sSTdln1747924955.png",
    color: "teal",
    borderColor: "border-teal-400",
    textColor: "text-teal-600",
  },
];

export default function CareerCards() {
  return (
    <section className="bg-white pt-8 sm:pt-12 md:pt-16 pb-16 sm:pb-20 md:pb-24 px-1 sm:px-2 md:px-4 lg:px-6">
      <div className="max-w-[95%] mx-auto">
        {/* Heading */}
        <h2 className="text-gray-800 text-center text-xl sm:text-2xl md:text-3xl font-bold mb-12 md:mb-16">
          Nusid quod maxime placeat facere possimus, nisi assumenda est, omnis dolor
        </h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
          {/* First 4 Cards */}
          {careerCards.slice(0, 4).map((card) => {
            // Split title into two lines if it contains "update"
            const titleParts = card.title.includes("update") 
              ? card.title.split(" update")
              : card.title.length > 15
              ? [card.title.substring(0, card.title.length - 6), card.title.substring(card.title.length - 6)]
              : [card.title];
            
            return (
              <div
                key={card.id}
                className="bg-white rounded-lg p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center text-center"
              >
                {/* Circular Image */}
                <div className="flex justify-center mb-4 md:mb-6">
                  <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                </div>

                {/* Title - Centered, can be split into two lines */}
                <h3 className={`text-xl md:text-2xl font-bold ${card.textColor} mb-3 md:mb-4 text-center`}>
                  {titleParts.length > 1 ? (
                    <>
                      {titleParts[0]}
                      <br />
                      {titleParts[1] ? ` ${titleParts[1]}` : "update"}
                    </>
                  ) : (
                    card.title
                  )}
                </h3>

                {/* Description - Centered */}
                <p className="text-gray-700 text-sm md:text-base leading-relaxed text-center">
                  {card.description}
                </p>
              </div>
            );
          })}

          {/* Fifth Card - Centered */}
          <div className="sm:col-span-2 lg:col-span-2 flex justify-center">
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow max-w-md w-full flex flex-col items-center text-center">
              {/* Circular Image */}
              <div className="flex justify-center mb-4 md:mb-6">
                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden">
                  <Image
                    src={careerCards[4].image}
                    alt={careerCards[4].title}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
              </div>

              {/* Title - Centered */}
              <h3 className={`text-xl md:text-2xl font-bold ${careerCards[4].textColor} mb-3 md:mb-4 text-center`}>
                {careerCards[4].title}
              </h3>

              {/* Description - Centered */}
              <p className="text-gray-700 text-sm md:text-base leading-relaxed text-center">
                {careerCards[4].description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

