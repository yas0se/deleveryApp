
export default function Home() {
  return (
    <div>
      <div className="grid md:grid-cols-3 gap-6 min-h-[164px] py-8 p-16 bg-gradient-to-r from-purple-700 to-purple-400 font-sans overflow-hidden">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold text-white">Welcome to your Delevery App!</h1>
          <p className="text-base text-gray-200 mt-4">
            Best plateform to found your delevery.
          </p>
          <a
            type="button"
            className="py-3 px-6 text-sm font-semibold bg-white text-purple-600 hover:bg-slate-100 rounded-md mt-8"
            href="/colis"
          >
            Get Started
          </a>
        </div>
        <div className="relative max-md:hidden">
          <img
            src="https://cdn.timify.com/compressed/uploads/v2blogarticles/A_Scheduled_Delivery_2x-20230425180151-685.png"
            alt="Banner Image"
            className="w-full right-4 top-[-13px] md:absolute skew-x-[-16deg] rotate-2 object-cover"
          />
        </div>
      </div>

    </div>
  );
}
