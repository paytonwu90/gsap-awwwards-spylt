import { useMediaQuery } from "react-responsive"
import { nutrientLists } from "../constants"
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import gsap from "gsap";

const NutritionSection = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const nutrientItems = isMobile ? nutrientLists.slice(0, 3) : nutrientLists;

  useGSAP(() => {
    const titleSplit = SplitText.create('.nutrition-title', {
      type: 'chars',
    });
    const paragraphSplit = SplitText.create('.nutrition-section p', {
      type: 'words, lines',
      linesClass: 'paragraph-line',
    });

    const contentTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.nutrition-section',
        start: 'top center',
      }
    });
    contentTl.from(titleSplit.chars, {
      yPercent: 100,
      stagger: 0.02,
      ease: "power2.out"
    })
    .to('.nutrition-text-scroll', {
      opacity: 1,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 0.6,
      ease: "power1.inOut"
    })
    .from(paragraphSplit.words, {
      yPercent: 300,
      rotate: 3,
      duration: 0.8,
      stagger: 0.01,
      ease: "power1.inOut"
    }, "<");
  })

  return (
    <section className="nutrition-section">
      <img src="/images/slider-dip.png" alt="" className="w-full object-cover" />
      <img 
        src="/images/big-img.png" 
        alt="Spylt caffeinated vanilla milkshake protein drink can with a poured glass and vanilla ice cream cones" 
        className="big-img" 
      />

      <div className="flex flex-col md:flex-row justify-between px-5 md:px-10 mt-14 md:mt-0">
        <div className="relative inline-block md:translate-y-20">
          <div className="general-title relative flex flex-col justify-center items-center gap-24">
            <div className="overflow-hidden self-start">
              <h1 className="nutrition-title">It still does</h1>
            </div>
            <div
              style={{ clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" }}
              className="nutrition-text-scroll self-start"
            >
              <div className="inline-block bg-yellow-brown pb-5 pt-3 md:pt-0 px-3 md:px-5">
                <h2 className="text-milk-yellow">Body Good</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="flex md:justify-center items-center translate-y-5">
          <div className="max-w-md md:max-w-xs">
            <p className="text-lg md:text-right text-balance font-paragraph">
              Milk contains a wide array of nutrients, including vitamins, minerals, and protein, and this is lactose free
            </p>
          </div>
        </div>

        <div className="nutrition-box">
          <div className="list-wrapper">
            {
              nutrientItems.map((nutrient, index) => (
                <div key={index} className="relative flex-1 col-center">
                  <div>
                    <p className="font-paragraph md:text-lg">{nutrient.label}</p>
                    <p className="font-paragraph text-sm mt-2">up to</p>
                    <p className="text-2xl md:text-4xl tracking-tighter font-bold">{nutrient.amount}</p>
                  </div>
                  {
                    index !== nutrientItems.length - 1 && (
                      <div className="spacer-border"></div>
                    )
                  }
                </div>
              ))
            }
          </div>  
        </div>
      </div>
    </section>
  )
}

export default NutritionSection
