import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-800 bg-gray-950 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold text-white">Scholarly Insight</h3>
            <p className="text-sm text-gray-400">
              Annotate, share, and discover academic research with ease.
            </p>
          </div>
          
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Platform</h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-400">
              <li><Link href="/search" className="hover:text-blue-500 transition-colors">Search Articles</Link></li>
              <li><Link href="/articles/2106.09685" className="hover:text-blue-500 transition-colors">Featured</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Company</h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-400">
              <li><Link href="/about-us" className="hover:text-blue-500 transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-blue-500 transition-colors">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Legal</h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-blue-500 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Scholarly Insight. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer