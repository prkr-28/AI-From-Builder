"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, CheckCircle, Zap, Users, BarChart3 } from "lucide-react";

const Hero = () => {
  const { isSignedIn } = useUser();

  const steps = [
    {
      step: "01",
      title: "Describe Your Form",
      description: "Simply describe what kind of form you need in plain English",
      icon: <Zap className="w-6 h-6" />,
    },
    {
      step: "02", 
      title: "AI Generates Form",
      description: "Our AI creates a professional form with all the right fields",
      icon: <CheckCircle className="w-6 h-6" />,
    },
    {
      step: "03",
      title: "Customize & Share",
      description: "Edit your form, style it, and share with anyone instantly",
      icon: <Users className="w-6 h-6" />,
    },
    {
      step: "04",
      title: "Collect Responses",
      description: "View and analyze all responses in your dashboard",
      icon: <BarChart3 className="w-6 h-6" />,
    },
  ];

  const professions = [
    "Event Organizers", "HR Managers", "Teachers", "Researchers", 
    "Marketing Teams", "Healthcare Providers", "Non-profits", "Consultants"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            AI-Powered Form Generation
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Create Beautiful Forms in
            <span className="text-primary"> Seconds</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your ideas into professional forms instantly. Just describe what you need, 
            and our AI will create a stunning, functional form ready to collect responses.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {isSignedIn ? (
              <Link href="/dashboard">
                <Button size="lg" className="px-8 py-4 text-lg">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            ) : (
              <SignInButton redirectUrl="/dashboard">
                <Button size="lg" className="px-8 py-4 text-lg">
                  Start Creating Forms
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </SignInButton>
            )}
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
              Watch Demo
            </Button>
          </div>

          {/* Trusted by section */}
          <div className="text-center mb-16">
            <p className="text-sm text-gray-500 mb-4">Trusted by professionals from</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              {professions.map((profession, index) => (
                <span key={index} className="bg-white px-3 py-1 rounded-full shadow-sm">
                  {profession}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How it works section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Creating professional forms has never been easier. Follow these simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to create, customize, and manage forms
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Generation</h3>
              <p className="text-gray-600">
                Describe your form in natural language and watch AI create it instantly
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Customization</h3>
              <p className="text-gray-600">
                Edit fields, change styling, and customize every aspect of your form
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Response Analytics</h3>
              <p className="text-gray-600">
                Track submissions and analyze responses with detailed insights
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Create Your First Form?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust our AI to create their forms
          </p>
          {isSignedIn ? (
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          ) : (
            <SignInButton redirectUrl="/dashboard">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;