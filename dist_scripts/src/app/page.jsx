import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Navbar from "../components/Navbar";
import ProjectList from "../components/ProjectList";
import HeroBlob from "./HeroBlob";
import SignInButton from "../components/SignInButton";
export default async function Home() {
    const session = await getServerSession(authOptions);
    return (<div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto py-12 px-4 sm:px-8 lg:px-16">
        {/* Hero section with floating elements */}
        <section className="relative flex flex-col items-center justify-center mb-24 pt-10 min-h-[420px]">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-gradient-to-br from-indigo-300/20 to-purple-400/20 blur-3xl animate-float" style={{ animationDelay: '-2s' }}></div>
            <div className="absolute bottom-10 left-[15%] w-72 h-72 rounded-full bg-gradient-to-tr from-pink-300/20 to-indigo-300/20 blur-3xl animate-float" style={{ animationDelay: '-1s' }}></div>
            <HeroBlob />
          </div>
          
          <div className="relative z-10 w-full flex flex-col items-center">
            <div className="card px-8 py-12 max-w-3xl mx-auto flex flex-col items-center gap-6 backdrop-blur-xl">
              <div className="relative">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-2 text-center">
                  Final AI Hackathon
                </h1>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-primary rounded-full"></div>
              </div>
              
              <p className="mt-6 text-xl md:text-2xl text-gray-700 font-medium text-center max-w-2xl">
                Do the Math with AI — Explore and submit project ideas for our company hackathon
              </p>
              
              {session ? (<Link href="/submit" className="btn mt-4 group">
                  <span className="mr-2 transition-transform group-hover:scale-125">✨</span>
                  Submit Your Brilliant Idea
                </Link>) : (<SignInButton />)}
            </div>
          </div>
        </section>

        {/* Projects section with modern styling */}
        <section className="mb-20">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-12">
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Project Ideas</h2>
              <p className="mt-3 text-gray-600">Browse the innovative concepts from our talented team</p>
            </div>
            
            {session ? (<Link href="/submit" className="btn-secondary btn">
                <span className="mr-2">🚀</span>Submit a New Project
              </Link>) : (<div className="text-base text-gray-500 font-medium bg-white/80 backdrop-blur-md px-5 py-3 rounded-xl shadow-sm border border-gray-100">
                Sign in to submit your project idea
              </div>)}
          </div>

          <div className="transition-all grid gap-8">
            <ProjectList />
          </div>
        </section>
      </main>

      <footer className="mt-auto backdrop-blur-md bg-white/50 py-12 border-t border-gray-200/50 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-3">
                <Image src="/final-logo.svg" alt="Final AI Hackathon" width={100} height={35} className="transition-transform duration-300 hover:scale-105" priority/>
                <span className="text-xl text-gray-600 font-medium">Do the Math</span>
              </div>
              <p className="text-gray-500 text-sm mt-2 max-w-md text-center md:text-left">
                Empowering innovation through collaboration and AI-driven solutions
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-2">
              <div className="flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd"/>
                  </svg>
                </a>
              </div>
              <p className="text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Final Ltd. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>);
}
