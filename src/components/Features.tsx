import React from 'react'
import { Zap, Shield, Globe, Gauge, Users, HeadphonesIcon } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Get results in seconds with our optimized AI infrastructure'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and never shared with third parties'
  },
  {
    icon: Globe,
    title: 'Global Scale',
    description: 'Servers worldwide ensure low latency wherever you are'
  },
  {
    icon: Gauge,
    title: 'High Performance',
    description: 'State-of-the-art models delivering exceptional quality'
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Join thousands of creators pushing AI boundaries'
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Expert help available whenever you need it'
  }
]

const Features = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose DeepAI?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              We're not just another AI platform. We're your partner in innovation, 
              providing the tools and support you need to bring your ideas to life.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop"
              alt="AI Technology"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">99.9%</div>
                  <div className="text-gray-600">Uptime SLA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
