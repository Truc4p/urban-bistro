import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-dark text-white py-32 md:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}
        ></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-block border border-secondary/30 px-4 py-1.5 rounded-full mb-6">
            <p className="text-secondary text-sm font-medium tracking-widest uppercase">Fine Dining Experience</p>
          </div>
          <h1 className="font-serif text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Welcome to<br/>
            <span className="text-secondary">Urban Bistro</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-300 max-w-2xl mx-auto font-light">
            Where culinary artistry meets timeless elegance
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              to="/booking" 
              className="btn-primary bg-secondary text-primary shadow-xl hover:shadow-2xl"
            >
              Reserve Your Table
            </Link>
            <Link 
              to="/menu" 
              className="btn-outline border-white text-white hover:bg-white hover:text-primary"
            >
              View Menu
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-16">
          <h2 className="section-title">The Experience</h2>
          <div className="w-24 h-1 bg-secondary mx-auto mt-4"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="card-elegant text-center p-10 group hover:-translate-y-2 transition-transform duration-300">
            <div className="w-20 h-20 bg-cream border-2 border-secondary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-10 h-10 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl font-bold mb-3 text-primary">Gourmet Cuisine</h3>
            <p className="text-gray-600 leading-relaxed">Artfully crafted dishes by our award-winning chefs using the finest ingredients</p>
          </div>
          <div className="card-elegant text-center p-10 group hover:-translate-y-2 transition-transform duration-300">
            <div className="w-20 h-20 bg-cream border-2 border-secondary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-10 h-10 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl font-bold mb-3 text-primary">Seamless Reservations</h3>
            <p className="text-gray-600 leading-relaxed">Real-time table availability with instant confirmations for your convenience</p>
          </div>
          <div className="card-elegant text-center p-10 group hover:-translate-y-2 transition-transform duration-300">
            <div className="w-20 h-20 bg-cream border-2 border-secondary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-10 h-10 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl font-bold mb-3 text-primary">Premium Ambiance</h3>
            <p className="text-gray-600 leading-relaxed">Sophisticated atmosphere with impeccable service and attention to detail</p>
          </div>
        </div>
      </div>

      {/* Signature Section */}
      <div className="bg-primary text-white py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">A Culinary Journey</h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                At Urban Bistro, we believe dining is an art form. Each dish tells a story, combining traditional techniques with contemporary innovation.
              </p>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                From intimate dinners to grand celebrations, we create unforgettable experiences in an atmosphere of refined elegance.
              </p>
              <Link to="/menu" className="btn-primary inline-block">
                Explore Our Menu
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-secondary/20">
                <div className="text-4xl font-bold text-secondary mb-2">15+</div>
                <div className="text-gray-300 text-sm uppercase tracking-wide">Years of Excellence</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-secondary/20">
                <div className="text-4xl font-bold text-secondary mb-2">50+</div>
                <div className="text-gray-300 text-sm uppercase tracking-wide">Signature Dishes</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-secondary/20">
                <div className="text-4xl font-bold text-secondary mb-2">5-star</div>
                <div className="text-gray-300 text-sm uppercase tracking-wide">Michelin Rating</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-secondary/20">
                <div className="text-4xl font-bold text-secondary mb-2">10K+</div>
                <div className="text-gray-300 text-sm uppercase tracking-wide">Happy Guests</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-cream py-20 md:py-28">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">Ready for an Exquisite Evening?</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Reserve your table and embark on a memorable culinary adventure
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <Link to="/booking" className="btn-primary shadow-lg">
              Book Your Table
            </Link>
            <Link to="/menu" className="btn-outline">
              View Full Menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
