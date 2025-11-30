import { Users, Code, BookOpen } from 'lucide-react'

export default function AboutUs() {
  return (
    <div className="container mx-auto min-h-screen px-4 py-12">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mb-6 text-4xl font-bold text-white">About Scholarly Insight</h1>
        <p className="mb-12 text-xl text-gray-400">
          Empowering researchers and students to collaborate on academic literature in real-time.
        </p>
      </div>

      <div className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-3">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-900/30 text-blue-500">
            <BookOpen size={32} />
          </div>
          <h3 className="mb-4 text-xl font-bold text-white">Our Mission</h3>
          <p className="text-gray-400">
            To make academic research more accessible and interactive for everyone, breaking down barriers to knowledge.
          </p>
        </div>
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-900/30 text-purple-500">
            <Users size={32} />
          </div>
          <h3 className="mb-4 text-xl font-bold text-white">Community Driven</h3>
          <p className="text-gray-400">
            Built for students, researchers, and lifelong learners to share insights and discover new perspectives.
          </p>
        </div>
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-900/30 text-green-500">
            <Code size={32} />
          </div>
          <h3 className="mb-4 text-xl font-bold text-white">Open Source</h3>
          <p className="text-gray-400">
            Developed as part of the NYU Leetcode Bootcamp, showcasing modern web technologies and collaborative development.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-12 text-center">
        <h2 className="mb-8 text-3xl font-bold text-white">The Team</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <div className="flex flex-col items-center">
            <div className="mb-4 h-24 w-24 rounded-full bg-gray-800"></div>
            <h4 className="text-lg font-bold text-white">Kelly D'oleo</h4>
            <p className="text-sm text-gray-400">Member</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="mb-4 h-24 w-24 rounded-full bg-gray-800"></div>
            <h4 className="text-lg font-bold text-white">Shreyas Sankpal</h4>
            <p className="text-sm text-gray-400">Member</p>
          </div>

          <div className="flex flex-col items-center">
            <img src="/dev.png" alt="Tobias Lin" className="mb-4 h-24 w-24 rounded-full object-cover border-2 border-blue-500" />
            <h4 className="text-lg font-bold text-white">Tobias Lin</h4>
            <p className="text-sm text-blue-500">Developer</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="mb-4 h-24 w-24 rounded-full bg-gray-800"></div>
            <h4 className="text-lg font-bold text-white">Maddhav Suneja</h4>
            <p className="text-sm text-gray-400">Member</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="mb-4 h-24 w-24 rounded-full bg-gray-800"></div>
            <h4 className="text-lg font-bold text-white">Junior Garcia</h4>
            <p className="text-sm text-purple-500">Contributor</p>
          </div>
        </div>
      </div>
    </div>
  )
}