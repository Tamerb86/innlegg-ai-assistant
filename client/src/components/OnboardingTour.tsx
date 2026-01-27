import { useState, useEffect } from "react";
import Joyride, { Step, CallBackProps, STATUS } from "react-joyride";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function OnboardingTour() {
  const [run, setRun] = useState(false);
  const { data: tourStatus } = trpc.user.getOnboardingStatus.useQuery();
  const completeTourMutation = trpc.user.completeOnboarding.useMutation();

  useEffect(() => {
    // Auto-start tour for new users after 1 second
    if (tourStatus && !tourStatus.completed) {
      const timer = setTimeout(() => {
        setRun(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [tourStatus]);

  const steps: Step[] = [
    {
      target: "body",
      content: (
        <div className="space-y-3">
          <h2 className="text-xl font-bold">👋 Velkommen til Innlegg!</h2>
          <p>La oss ta en rask tur gjennom plattformen for å vise deg de viktigste funksjonene.</p>
          <p className="text-sm text-muted-foreground">Dette tar bare 1 minutt.</p>
        </div>
      ),
      placement: "center",
    },
    {
      target: '[href="/generate"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-bold">✨ Generer innhold</h3>
          <p>Start her! Skriv et emne, velg plattform (LinkedIn, Twitter, etc.), og få AI-generert innhold på sekunder.</p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: '[href="/trends"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-bold">🔥 Trender</h3>
          <p>Finn aktuelle temaer fra Google Trends, Reddit, LinkedIn og mer. Klikk "Bruk dette" for å generere innhold direkte.</p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: '[href="/voice-training"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-bold">🎤 Stemmetrening</h3>
          <p>Lær AI din unike skrivest stil! Last opp eksempler på din tekst, og AI vil tilpasse innholdet til din stemme.</p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: '[href="/calendar"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-bold">📅 Innholdskalender</h3>
          <p>Planlegg innhold rundt norske høytider og globale hendelser. Perfekt for å holde deg relevant hele året.</p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: ".onboarding-dropdown",
      content: (
        <div className="space-y-2">
          <h3 className="font-bold">🎯 Flere verktøy</h3>
          <p>Utforsk avanserte funksjoner som A/B Testing, Konkurrent-Radar, Innholds-Serier, og mer under "Flere".</p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: '[href="/settings"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-bold">⚙️ Innstillinger</h3>
          <p>Administrer abonnementet ditt, endre profil, og tilpass plattformen etter dine behov.</p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: "body",
      content: (
        <div className="space-y-3">
          <h2 className="text-xl font-bold">🎉 Du er klar!</h2>
          <p>Nå er du klar til å lage fantastisk innhold. Start med å generere ditt første innlegg!</p>
          <p className="text-sm text-muted-foreground">Du kan alltid starte turen på nytt fra Innstillinger.</p>
        </div>
      ),
      placement: "center",
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      completeTourMutation.mutate(undefined, {
        onSuccess: () => {
          if (status === STATUS.FINISHED) {
            toast.success("Velkommen ombord! 🎉");
          }
        },
      });
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      styles={{
        options: {
          primaryColor: "#3b82f6",
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 12,
          padding: 20,
        },
        buttonNext: {
          borderRadius: 8,
          padding: "8px 16px",
          fontSize: 14,
          fontWeight: 600,
        },
        buttonBack: {
          borderRadius: 8,
          padding: "8px 16px",
          fontSize: 14,
          marginRight: 8,
        },
        buttonSkip: {
          color: "#6b7280",
          fontSize: 14,
        },
      }}
      locale={{
        back: "Tilbake",
        close: "Lukk",
        last: "Fullfør",
        next: "Neste",
        skip: "Hopp over",
      }}
      callback={handleJoyrideCallback}
    />
  );
}
