"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  Info,
  CheckCircle,
  Sparkles,
  Bot,
  MessageSquare,
  Zap,
  ArrowRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PendingPage = () => {
  const [showChatbotGlow, setShowChatbotGlow] = useState(false);
  const [particleKey, setParticleKey] = useState(0);
  const [isHoveringChatbot, setIsHoveringChatbot] = useState(false);

  const steps = [
    { text: "Профайл үүсгэгдлээ", completed: true },
    { text: "Мэдээлэл хянагдаж байна", completed: false, current: true },
    { text: "Баталгаажуулна", completed: false },
    { text: "Платформ ашиглах", completed: false },
  ];

  // Animate progress steps
  useEffect(() => {
    const interval = setInterval(() => {
      // setCurrentStep((prev) => (prev + 1) % 4); // This line was removed
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Chatbot glow effect
  useEffect(() => {
    const glowInterval = setInterval(() => {
      setShowChatbotGlow(true);
      setTimeout(() => setShowChatbotGlow(false), 2000);
    }, 4000);
    return () => clearInterval(glowInterval);
  }, []);

  // Regenerate particles
  useEffect(() => {
    const particleInterval = setInterval(() => {
      setParticleKey((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(particleInterval);
  }, []);

  return (
    <div className="relative min-h-screen w-screen flex flex-col overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full animate-float animation-delay-0" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200/30 rounded-full animate-float animation-delay-1000" />
        <div className="absolute bottom-32 left-20 w-12 h-12 bg-yellow-200/30 rounded-full animate-float animation-delay-2000" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-green-200/30 rounded-full animate-float animation-delay-1500" />

        {/* Animated Particles */}
        <div key={particleKey} className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/40 rounded-full animate-ping opacity-60"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                animationDelay: `${i * 400}ms`,
                animationDuration: `${2000 + Math.random() * 2000}ms`,
              }}
            />
          ))}
        </div>

        {/* Gradient Waves */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-300/20 to-purple-400/20 rounded-full animate-slow-spin" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-300/20 to-pink-400/20 rounded-full animate-reverse-spin" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center flex-grow w-full text-center px-4 py-12">
        {/* Main Clock Animation */}
        <div className="relative mb-8">
          {/* Pulse Rings */}
          <div className="absolute inset-0 rounded-full bg-yellow-200/30 animate-ping animation-delay-0" />
          <div className="absolute inset-0 rounded-full bg-yellow-300/20 animate-ping animation-delay-500" />
          <div className="absolute inset-0 rounded-full bg-yellow-400/10 animate-ping animation-delay-1000" />

          {/* Main Clock Container */}
          <div className="relative p-8 rounded-full bg-gradient-to-br from-yellow-100 via-yellow-50 to-orange-100 border-4 border-yellow-200/50 shadow-2xl transform hover:scale-110 transition-all duration-500">
            <Clock className="w-16 h-16 text-yellow-600 animate-bounce" />

            {/* Floating Sparkles */}
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-spin" />
            <Star className="absolute -bottom-1 -left-2 w-4 h-4 text-orange-400 animate-pulse" />
          </div>
        </div>

        {/* Animated Title */}
        <div className="mb-6 space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
            Таны профайл хянагдаж байна
          </h1>
          <div className="flex items-center justify-center gap-2 text-lg text-gray-600">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-0" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-150" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-300" />
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-white/50 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between max-w-2xl">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                      step.completed
                        ? "bg-green-500 text-white scale-110 shadow-lg shadow-green-200"
                        : step.current
                        ? "bg-blue-500 text-white animate-pulse scale-110 shadow-lg shadow-blue-200"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-bold">{index + 1}</span>
                    )}

                    {step.current && (
                      <div className="absolute inset-0 rounded-full bg-blue-400/30 animate-ping" />
                    )}
                  </div>

                  <span
                    className={`text-xs text-center max-w-20 font-medium transition-colors duration-300 ${
                      step.completed
                        ? "text-green-600"
                        : step.current
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.text}
                  </span>

                  {index < steps.length - 1 && (
                    <div
                      className={`absolute top-5 left-12 w-16 h-0.5 transition-colors duration-500 ${
                        step.completed ? "bg-green-300" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <p className="text-gray-700 mb-6 max-w-2xl text-lg leading-relaxed">
          Өмгөөлөгчийн профайлыг амжилттай үүсгэлээ! Таны мэдээллийг манай админ
          баг хянаж байна.
        </p>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-8 max-w-4xl w-full">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-blue-100">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold mb-2 text-gray-800">
                    Профайл баталгаажих
                  </h3>
                  <p className="text-sm text-gray-600">
                    Таны профайл баталгаажмагц та платформын бүх боломжийг
                    ашиглах боломжтой болно.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Chatbot Card */}
          <Card
            className={`relative overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-100 border-purple-200/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer ${
              showChatbotGlow
                ? "ring-4 ring-purple-300/50 shadow-2xl shadow-purple-200/50"
                : ""
            }`}
            onMouseEnter={() => setIsHoveringChatbot(true)}
            onMouseLeave={() => setIsHoveringChatbot(false)}
          >
            {/* Animated Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-r from-purple-400/10 via-blue-400/10 to-indigo-400/10 transition-opacity duration-500 ${
                isHoveringChatbot ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Shimmer Effect */}
            <div
              className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full ${
                isHoveringChatbot ? "translate-x-full" : ""
              } transition-transform duration-1000 ease-out skew-x-12`}
            />

            <CardContent className="relative p-6">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div
                    className={`p-3 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 transition-all duration-300 ${
                      isHoveringChatbot
                        ? "scale-110 shadow-lg shadow-purple-200"
                        : ""
                    }`}
                  >
                    <Bot
                      className={`w-5 h-5 text-white transition-transform duration-300 ${
                        isHoveringChatbot ? "rotate-12" : ""
                      }`}
                    />
                  </div>

                  {/* Glowing Ring */}
                  {(showChatbotGlow || isHoveringChatbot) && (
                    <div className="absolute inset-0 rounded-full bg-purple-400/30 animate-ping" />
                  )}

                  {/* Floating AI Indicators */}
                  {isHoveringChatbot && (
                    <>
                      <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-yellow-400 animate-spin" />
                      <Zap className="absolute -bottom-1 -left-2 w-3 h-3 text-blue-400 animate-pulse" />
                    </>
                  )}
                </div>

                <div className="text-left flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-800">AI Туслах</h3>
                    <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs px-2 py-1 animate-pulse">
                      Шинэ!
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Хүлээж байх хугацаандаа манай AI чатботыг туршиж үзээрэй!
                  </p>

                  <Button
                    asChild
                    className={`group bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 ${
                      isHoveringChatbot ? "scale-105" : ""
                    }`}
                  >
                    <a
                      href="/chatbot"
                      className="inline-flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>AI Чатбот турших</span>
                      <ArrowRight
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isHoveringChatbot ? "translate-x-1" : ""
                        }`}
                      />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>

            {/* Floating Particles */}
            {isHoveringChatbot && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-60"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                      animationDelay: `${i * 200}ms`,
                      animationDuration: `${1000 + Math.random() * 1000}ms`,
                    }}
                  />
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Estimated Time */}
        <div className="mt-8 p-4 rounded-lg bg-white/60 backdrop-blur-sm border border-white/80">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Хүлээгдэх хугацаа: 24-48 цаг</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(120deg);
          }
          66% {
            transform: translateY(5px) rotate(240deg);
          }
        }

        @keyframes slow-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes reverse-spin {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes gradient-x {
          0%,
          100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-slow-spin {
          animation: slow-spin 20s linear infinite;
        }
        .animate-reverse-spin {
          animation: reverse-spin 25s linear infinite;
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        .animation-delay-0 {
          animation-delay: 0ms;
        }
        .animation-delay-150 {
          animation-delay: 150ms;
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
        .animation-delay-1500 {
          animation-delay: 1500ms;
        }
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
        .animation-duration-2000 {
          animation-duration: 2000ms;
        }
      `}</style>
    </div>
  );
};

export default PendingPage;
