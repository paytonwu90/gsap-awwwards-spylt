import { useMediaQuery } from "react-responsive";

const FooterSection = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <section className="footer-section">
      <img
        src="/images/footer-dip.png"
        alt="footer dip"
        className="w-full object-cover -translate-y-1"
      />

      <div className="2xl:min-h-[110dvh] relative md:pt-[20vh] pt-[10vh]">
        <div className="relative overflow-hidden z-10">
          <h1 className="general-title text-center text-milk py-5">
            #CHUGRESPONSIBLY
          </h1>
        </div>

        {
          isMobile ? (
            // 只靠 w-[Xvw] 無法保證所有螢幕比例都不會蓋到文字：height 是 auto 跟著 vw 等比例縮放，
            // 但下面文字位置是固定間距，兩者互不牽制，瘦高螢幕下就可能超出間距，
            // 所以加上 max-height 做上限，讓寬高取比較保守的限制。
            <img
              src="/images/footer-drink.png"
              alt="footer drink"
              className="absolute top-0 w-[70vw] max-h-[35vh] object-contain"
            />
          ) : (
            <video
              src="/videos/splash.mp4"
              autoPlay
              playsInline
              muted
              className="absolute top-0 w-full object-contain mix-blend-lighten"
            />
          )
        }

        {/* relative 是為了在疊放順序上贏過前面 absolute 定位的 video/img，
            不然這裡的內容預設會被蓋在它們下面（沒有定位的元素必輸給有定位的元素）。 */}
        <div className="relative flex-center gap-5 z-10 mt-5 md:mt-20">
          <div className="social-btn">
            <img src="/images/yt.svg" alt="youtube" />
          </div>
          <div className="social-btn">
            <img src="/images/insta.svg" alt="instagram" />
          </div>
          <div className="social-btn">
            <img src="/images/tiktok.svg" alt="tiktok" />
          </div>
        </div>

        {/* 同上，relative 是為了贏過 video/img 的疊放順序，不是用來做位移。 */}
        <div className="relative flex flex-col md:flex-row justify-between font-paragraph md:text-lg font-medium text-milk gap-10 mt-40 xl:mt-32 px-5 md:px-10">
          <div className="flex items-center gap-5 md:gap-16">
            <div>
              <p>SPYLT Flavors</p>
            </div>
            <div>
              <p>Chug Club</p>
              <p>Student Marketing</p>
              <p>Dairy Dealers</p>
            </div>
            <div>
              <p>Company</p>
              <p>Contacts</p>
              <p>Tasty Talk</p>
            </div>
          </div>

          <div className="md:max-w-lg">
            <p>
              Get Exclusive Early Access and Stay Informed About Product
              Updates, Events, and More!
            </p>
            <div className="flex justify-between items-center border-b border-[#D9D9D9] py-5 md:mt-10">
              {/* The input field and arrow icon for newsletter signup. */}{" "}
              {/* A border at the bottom for a clean, modern look. */}
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full placeholder:font-sans placeholder:text-[#999999]"
              />
              <img src="/images/arrow.svg" alt="arrow" />
            </div>
          </div>
        </div>

        <div className="copyright-box">
          {/* The final row with copyright and legal links. */}
          <p>Copyright © 2025 Spylt - All Rights Reserved</p>
          <div className="flex items-center gap-7">
            <p>Privacy Policy</p>
            <p>Terms of Sеrvice</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FooterSection
