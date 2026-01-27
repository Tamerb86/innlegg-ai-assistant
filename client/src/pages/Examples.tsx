import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Copy, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { PAGE_DESCRIPTIONS } from "@/lib/pageDescriptions";

interface Example {
  id: number;
  title: string;
  platform: string;
  tone: string;
  category: string;
  content: string;
  engagement: string;
}

const examplePosts: Example[] = [
  {
    id: 1,
    title: "Produktlansering",
    platform: "LinkedIn",
    tone: "professional",
    category: "Markedsføring",
    content: `🚀 Vi er stolte av å presentere vår nyeste innovasjon!

Etter måneder med utvikling og testing, er vi endelig klare til å dele dette med dere. Vår nye løsning vil revolusjonere måten dere jobber på.

Hva gjør den spesiell?
✅ Spar 50% tid på daglige oppgaver
✅ Intuitiv design som alle kan bruke
✅ Sømløs integrasjon med eksisterende verktøy

Vil du være blant de første som prøver? Link i kommentarene! 👇

#innovasjon #produktlansering #teknologi`,
    engagement: "2.5K likes, 150 kommentarer"
  },
  {
    id: 2,
    title: "Bak kulissene",
    platform: "LinkedIn",
    tone: "friendly",
    category: "Kultur",
    content: `☕ Morgenmøte hos oss ser litt annerledes ut enn du kanskje tror...

Vi starter ikke med PowerPoint og lange agendaer. Vi starter med kaffe, latter og en runde "Hva gjorde deg glad i går?"

Hvorfor? Fordi vi tror at gode relasjoner skaper gode resultater. 

Vårt team er ikke bare kolleger - vi er mennesker som bryr oss om hverandre. Og det merkes på alt vi gjør.

Hva er din favoritt måte å starte arbeidsdagen på? 💭

#bedriftskultur #teamwork #arbeidsliv`,
    engagement: "1.8K likes, 89 kommentarer"
  },
  {
    id: 3,
    title: "Kundesuksess",
    platform: "LinkedIn",
    tone: "professional",
    category: "Case Study",
    content: `📊 Hvordan økte vi kundens salg med 300% på 6 måneder?

La meg dele historien om hvordan vi hjalp et norsk tech-selskap med å skalere deres vekst.

Utgangspunktet:
• Lav konverteringsrate på nettsiden
• Uklart verdiforslag
• Spredt markedsføringsstrategi

Vår tilnærming:
1️⃣ Dybdeintervjuer med eksisterende kunder
2️⃣ Redesign av hele customer journey
3️⃣ Fokusert content-strategi på LinkedIn

Resultatet:
✨ 300% økning i kvalifiserte leads
✨ 45% høyere konverteringsrate
✨ 2x raskere salgssyklus

Vil du vite mer om hvordan vi gjorde det? Send meg en DM! 💬

#kundesuksess #vekststrategi #b2bmarketing`,
    engagement: "3.2K likes, 210 kommentarer"
  },
  {
    id: 4,
    title: "Personlig innsikt",
    platform: "LinkedIn",
    tone: "casual",
    category: "Lederskap",
    content: `💡 Den beste ledelsen jeg noensinne fikk kom ikke fra en leder...

Den kom fra en kollega som sa: "Du trenger ikke ha alle svarene. Du trenger bare å være ærlig om det."

I 10 år trodde jeg at å være leder betydde å alltid vite best. Å aldri vise svakhet. Å ha kontroll på alt.

Men sannheten? De beste lederne jeg kjenner er de som tør å si:
• "Jeg vet ikke, men la oss finne ut av det sammen"
• "Jeg tok feil, beklager"
• "Hva tenker du? Din mening betyr noe"

Autentisk lederskap > Perfekt lederskap

Enig? 👇

#lederskap #autentisitet #vekst`,
    engagement: "4.1K likes, 320 kommentarer"
  },
  {
    id: 5,
    title: "Tips og råd",
    platform: "LinkedIn",
    tone: "professional",
    category: "Utdanning",
    content: `🎯 5 ting jeg skulle ønske jeg visste da jeg startet min karriere:

1. Nettverk > Kompetanse (i starten)
Hvem du kjenner åpner dører. Hva du kan holder dem åpne.

2. Spør om hjelp tidlig
De beste menneskene jeg kjenner elsker å hjelpe. Men du må tørre å spørre.

3. Dokumenter alt du lærer
Din fremtidige jeg vil takke deg. Skriv ned innsikter, ikke stol på hukommelsen.

4. Si nei oftere
Hver gang du sier ja til noe, sier du nei til noe annet. Velg bevisst.

5. Invester i deg selv først
Kurs, bøker, mentorer - det er den beste investeringen du kan gjøre.

Hva skulle du ønske du visste tidligere? 💭

#karriere #tips #personligutvikling`,
    engagement: "2.9K likes, 180 kommentarer"
  },
  {
    id: 6,
    title: "Bransjeinnsikt",
    platform: "LinkedIn",
    tone: "professional",
    category: "Analyse",
    content: `📈 AI-revolusjonen i norsk næringsliv: Hva skjer egentlig?

Jeg har snakket med 50+ norske bedriftsledere de siste månedene. Her er hva jeg ser:

🔴 Myte: "AI vil erstatte alle jobbene"
🟢 Realitet: AI forsterker menneskelig kreativitet og produktivitet

Trendene jeg ser:
• 78% av bedriftene tester AI-verktøy
• Men bare 23% har en klar AI-strategi
• Største hindring? Ikke teknologi, men kultur

Min spådom for 2026:
De bedriftene som vinner er ikke de med mest AI, men de som best kombinerer AI med menneskelig innsikt.

Hva er din erfaring med AI i din bransje? 🤖

#kunstigintelligens #digitalisering #fremtiden`,
    engagement: "3.5K likes, 240 kommentarer"
  }
];

export default function Examples() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("Alle");

  const categories = ["Alle", "Markedsføring", "Kultur", "Case Study", "Lederskap", "Utdanning", "Analyse"];

  const filteredExamples = selectedCategory === "Alle" 
    ? examplePosts 
    : examplePosts.filter(ex => ex.category === selectedCategory);

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Kopiert til utklippstavlen!");
  };

  const handleUseAsTemplate = (example: Example) => {
    // Navigate to Generate page with pre-filled topic
    setLocation(`/generate?topic=${encodeURIComponent(example.title)}&tone=${example.tone}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <div>
              <PageHeader title="Eksempler" description={PAGE_DESCRIPTIONS.examples} />
              <p className="text-muted-foreground">
                Profesjonelle innlegg som fungerer - bruk dem som inspirasjon
              </p>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Examples Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredExamples.map((example) => (
            <Card key={example.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <CardTitle className="text-lg">{example.title}</CardTitle>
                    <CardDescription>{example.engagement}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{example.platform}</Badge>
                    <Badge variant="outline">{example.category}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-lg mb-4 max-h-64 overflow-y-auto">
                  <p className="text-sm whitespace-pre-wrap">{example.content}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleCopy(example.content)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Kopier
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleUseAsTemplate(example)}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Bruk som mal
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <Card className="mt-12 bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Klar til å lage ditt eget innlegg?</h3>
                <p className="text-muted-foreground">
                  Bruk AI til å generere profesjonelt innhold på sekunder
                </p>
              </div>
              <Button size="lg" onClick={() => setLocation("/generate")}>
                Kom i gang
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
