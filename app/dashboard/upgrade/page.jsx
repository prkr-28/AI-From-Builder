"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Zap, Crown, Rocket } from "lucide-react";

const UpgradePage = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      icon: <Zap className="w-6 h-6" />,
      features: [
        "Up to 5 forms",
        "100 responses per month",
        "Basic themes",
        "Email support"
      ],
      current: true
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      icon: <Crown className="w-6 h-6" />,
      features: [
        "Unlimited forms",
        "Unlimited responses",
        "Advanced themes",
        "Custom branding",
        "Priority support",
        "Analytics dashboard"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "per month",
      icon: <Rocket className="w-6 h-6" />,
      features: [
        "Everything in Pro",
        "Team collaboration",
        "API access",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee"
      ]
    }
  ];

  return (
    <div className="p-4 md:p-10">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Upgrade to unlock more features and create unlimited forms
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}
            
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  plan.current ? 'bg-gray-100 text-gray-600' : 
                  plan.popular ? 'bg-primary/10 text-primary' : 'bg-blue-100 text-blue-600'
                }`}>
                  {plan.icon}
                </div>
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold">
                {plan.price}
                <span className="text-sm font-normal text-gray-600">/{plan.period}</span>
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full" 
                variant={plan.current ? "outline" : plan.popular ? "default" : "outline"}
                disabled={plan.current}
              >
                {plan.current ? "Current Plan" : "Upgrade Now"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-600 mb-4">
          Need a custom solution? Contact our sales team.
        </p>
        <Button variant="outline">
          Contact Sales
        </Button>
      </div>
    </div>
  );
};

export default UpgradePage;