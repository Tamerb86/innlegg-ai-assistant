import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Loader2, Check } from "lucide-react";

export function Pricing() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>("monthly");
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: plans, isLoading: plansLoading } = trpc.payment.getPlans.useQuery();
  const { data: currentSubscription } = trpc.payment.getSubscription.useQuery(
    undefined,
    { enabled: !!user }
  );
  const createCheckout = trpc.payment.createCheckoutSession.useMutation();

  const handleSelectPlan = async (planId: number) => {
    if (!user) {
      setLocation("/");
      return;
    }

    setSelectedPlan(planId);
    setIsLoading(true);

    try {
      const result = await createCheckout.mutateAsync({
        planId,
        billingCycle: billingCycle as 'monthly' | 'yearly',
      });

      if (result.url) {
        window.open(result.url, "_blank");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Error creating checkout session");
    } finally {
      setIsLoading(false);
      setSelectedPlan(null);
    }
  };

  const formatPrice = (price: number | null | undefined) => {
    if (!price) return "Free";
    const nok = price / 100;
    return `${nok.toFixed(0)} NOK`;
  };

  if (plansLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Pricing Plans</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Choose the perfect plan for your needs
          </p>

          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                billingCycle === "monthly"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                billingCycle === "yearly"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans?.map((plan) => {
            const price = billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;
            const isCurrentPlan = currentSubscription?.stripePriceId === (billingCycle === "monthly" ? plan.stripePriceIdMonthly : plan.stripePriceIdYearly);

            return (
              <Card key={plan.id} className={`relative flex flex-col p-8 transition-all ${isCurrentPlan ? "ring-2 ring-primary shadow-lg" : "hover:shadow-lg"}`}>
                {isCurrentPlan && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Current Plan
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-6">{plan.description}</p>

                <div className="mb-6">
                  <div className="text-4xl font-bold">{formatPrice(price)}</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {billingCycle === "monthly" ? "per month" : "per year"}
                  </p>
                </div>

                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isCurrentPlan || isLoading || selectedPlan === plan.id}
                  className="w-full mb-8"
                  variant={isCurrentPlan ? "outline" : "default"}
                >
                  {isCurrentPlan ? "Your Plan" : "Choose Plan"}
                  {isLoading && selectedPlan === plan.id && (
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  )}
                </Button>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{plan.postsPerMonth ? `${plan.postsPerMonth} posts/month` : "Unlimited posts"}</span>
                  </div>

                  {plan.canUseDALLE === 1 && (
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>DALL-E 3 Image Generation</span>
                    </div>
                  )}

                  {plan.canUseVoiceTraining === 1 && (
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Advanced Voice Training</span>
                    </div>
                  )}

                  {plan.canUseContentCalendar === 1 && (
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Content Calendar</span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
