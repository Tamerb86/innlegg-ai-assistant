import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Rocket, CreditCard, Settings, Shield, Users, Zap, Search, X } from "lucide-react";

export default function FAQ() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      icon: Rocket,
      title: "Komme i gang",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      questions: [
        {
          q: "Hvordan starter jeg med Nexify AI?",
          a: "Det er enkelt! Registrer deg med din e-postadresse, velg en abonnementsplan (eller start med gratis prøveperiode), og du er klar til å generere ditt første innlegg på under 30 sekunder. Ingen kredittkort kreves for prøveperioden."
        },
        {
          q: "Trenger jeg teknisk kunnskap for å bruke Nexify AI?",
          a: "Absolutt ikke! Nexify AI er designet for å være intuitivt og brukervennlig. Du trenger bare å skrive inn ideen eller emnet ditt, og AI-en tar seg av resten. Ingen kodekunnskap eller teknisk erfaring er nødvendig."
        },
        {
          q: "Hvor lang tid tar det å lage et innlegg?",
          a: "Med Nexify AI kan du generere profesjonelt innhold på kun 30 sekunder! Skriv inn emnet ditt, velg tone og stil, og AI-en leverer et ferdig innlegg klar til publisering eller videre redigering."
        },
        {
          q: "Kan jeg prøve Nexify AI gratis?",
          a: "Ja! Vi tilbyr en gratis prøveperiode på 14 dager med full tilgang til alle funksjoner. Du kan generere opptil 5 innlegg uten å oppgi betalingsinformasjon. Perfekt for å teste om Nexify AI passer for deg."
        }
      ]
    },
    {
      icon: CreditCard,
      title: "Betaling og abonnement",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      questions: [
        {
          q: "Hvilke betalingsmetoder aksepterer dere?",
          a: "Vi aksepterer alle vanlige betalingskort (Visa, Mastercard, American Express) og Vipps – Norges mest populære betalingsløsning. Alle betalinger er sikre og krypterte."
        },
        {
          q: "Hva koster Nexify AI?",
          a: "Nexify AI koster 199 NOK per måned for ubegrenset tilgang til alle funksjoner, inkludert AI Content Generator og personlig AI Content Coach. Vi tilbyr også årlig abonnement med 20% rabatt (1 910 NOK/år)."
        },
        {
          q: "Kan jeg kansellere abonnementet mitt når som helst?",
          a: "Ja, du kan kansellere når som helst uten bindingstid eller skjulte gebyrer. Abonnementet ditt forblir aktivt til slutten av betalingsperioden, og du vil ikke bli belastet igjen."
        },
        {
          q: "Tilbyr dere refusjon?",
          a: "Ja! Vi tilbyr 30 dagers pengene-tilbake-garanti hvis du ikke er fornøyd med Nexify AI. Ingen spørsmål stilt – bare kontakt support@nexify.no for full refusjon."
        },
        {
          q: "Hva skjer hvis jeg overskrider innlegg-kvoten min?",
          a: "På gratisplanen er du begrenset til 5 innlegg. På betalte planer har du ubegrenset tilgang, så du kan generere så mange innlegg du trenger uten ekstra kostnader."
        }
      ]
    },
    {
      icon: Zap,
      title: "Funksjoner og bruk",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      questions: [
        {
          q: "Hvilke typer innhold kan jeg generere?",
          a: "Nexify AI støtter alle typer innhold for sosiale medier: Facebook-innlegg, Instagram-tekster, LinkedIn-artikler, Twitter/X-tråder, blogginnlegg, produktbeskrivelser, og mer. AI-en tilpasser tonen og stilen basert på plattformen."
        },
        {
          q: "Kan jeg redigere innholdet etter generering?",
          a: "Selvfølgelig! Alt generert innhold kan redigeres direkte i editoren. Du kan også be AI-en om å regenerere deler av teksten eller justere tonen hvis du ønsker endringer."
        },
        {
          q: "Hva er AI Content Coach?",
          a: "AI Content Coach er din personlige skriveassistent som gir deg tilbakemeldinger på innholdet ditt, foreslår forbedringer, og hjelper deg å utvikle bedre skriveferdigheter over tid. Det er som å ha en profesjonell copywriter ved din side."
        },
        {
          q: "Støtter Nexify AI flere språk?",
          a: "Ja! Nexify AI støtter norsk, engelsk, svensk, dansk, og mange andre språk. Du kan generere innhold på hvilket som helst språk, og AI-en vil tilpasse seg kulturelle nyanser og lokale uttrykk."
        },
        {
          q: "Kan jeg lagre og gjenbruke innlegg?",
          a: "Ja, alle genererte innlegg lagres automatisk i din 'Mine innlegg'-bibliotek. Du kan søke, filtrere, redigere, og gjenbruke tidligere innlegg når som helst."
        }
      ]
    },
    {
      icon: Settings,
      title: "Konto og innstillinger",
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      questions: [
        {
          q: "Hvordan endrer jeg abonnementsplanen min?",
          a: "Gå til 'Innstillinger' → 'Abonnement' i dashboardet ditt. Der kan du oppgradere, nedgradere, eller kansellere abonnementet ditt. Endringer trer i kraft umiddelbart eller ved neste faktureringsperiode."
        },
        {
          q: "Kan jeg bruke Nexify AI på flere enheter?",
          a: "Ja! Nexify AI er en nettbasert tjeneste som fungerer på alle enheter – PC, Mac, nettbrett, og mobil. Logg inn med samme konto på alle enhetene dine, og innholdet ditt synkroniseres automatisk."
        },
        {
          q: "Hvordan endrer jeg e-postadressen min?",
          a: "Gå til 'Innstillinger' → 'Profil' og oppdater e-postadressen din. Du vil motta en bekreftelseslenke på den nye adressen for å verifisere endringen."
        },
        {
          q: "Hva skjer med dataene mine hvis jeg kansellerer?",
          a: "Alle innleggene dine forblir tilgjengelige i 30 dager etter kansellering, slik at du kan eksportere dem. Etter 30 dager slettes dataene permanent i henhold til GDPR-regler."
        }
      ]
    },
    {
      icon: Shield,
      title: "Personvern og sikkerhet",
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20",
      questions: [
        {
          q: "Er dataene mine trygge?",
          a: "Absolutt! Vi bruker banknivå kryptering (SSL/TLS) for alle data i transitt og hvile. Dataene dine lagres på sikre servere i EU, og vi følger strenge GDPR-retningslinjer for personvern."
        },
        {
          q: "Hvem har tilgang til innholdet jeg genererer?",
          a: "Kun du har tilgang til ditt innhold. Vi deler aldri, selger, eller bruker innholdet ditt til treningsformål uten ditt eksplisitte samtykke. Dine data er dine."
        },
        {
          q: "Er Nexify AI GDPR-kompatibel?",
          a: "Ja, Nexify AI er fullt GDPR-kompatibel. Vi respekterer dine rettigheter til datainnsyn, sletting, og portabilitet. Les vår personvernerklæring for fullstendige detaljer."
        },
        {
          q: "Bruker dere innholdet mitt til å trene AI-modellen?",
          a: "Nei, vi bruker aldri ditt genererte innhold til å trene AI-modeller uten ditt eksplisitte samtykke. Ditt innhold forblir privat og konfidensielt."
        }
      ]
    },
    {
      icon: Users,
      title: "Support og hjelp",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/20",
      questions: [
        {
          q: "Hvordan kontakter jeg kundeservice?",
          a: "Du kan kontakte oss via e-post på support@nexify.no. Vi svarer vanligvis innen 24 timer på hverdager. For akutte problemer, bruk 'Hjelp'-knappen i dashboardet for raskere respons."
        },
        {
          q: "Tilbyr dere opplæring eller veiledning?",
          a: "Ja! Vi har en omfattende kunnskapsbase med videoer, guider, og tips. I tillegg gir AI Content Coach deg personlig veiledning mens du jobber."
        },
        {
          q: "Hva gjør jeg hvis jeg opplever tekniske problemer?",
          a: "Prøv først å oppdatere siden eller logge ut og inn igjen. Hvis problemet vedvarer, kontakt support@nexify.no med en beskrivelse av problemet og skjermbilder hvis mulig."
        },
        {
          q: "Kan jeg foreslå nye funksjoner?",
          a: "Absolutt! Vi elsker tilbakemeldinger fra brukerne våre. Send dine forslag til support@nexify.no, og vi vil vurdere dem for fremtidige oppdateringer."
        }
      ]
    }
  ];

  // Filter FAQ categories based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return faqCategories;

    const query = searchQuery.toLowerCase();
    return faqCategories
      .map(category => ({
        ...category,
        questions: category.questions.filter(
          item =>
            item.q.toLowerCase().includes(query) ||
            item.a.toLowerCase().includes(query)
        )
      }))
      .filter(category => category.questions.length > 0);
  }, [searchQuery]);

  const totalResults = filteredCategories.reduce(
    (sum, cat) => sum + cat.questions.length,
    0
  );

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <HelpCircle className="h-20 w-20 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-6">Ofte stilte spørsmål (FAQ)</h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            Finn svar på de vanligste spørsmålene om Nexify AI. Finner du ikke det du leter etter? 
            Kontakt oss på <a href="mailto:support@nexify.no" className="underline hover:text-blue-200">support@nexify.no</a>
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Search Box */}
        <Card className="mb-8 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Søk i FAQ</h3>
          </div>
          <div className="relative">
            <Input
              type="text"
              placeholder="Skriv inn nøkkelord for å finne svar raskt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-2">
              {totalResults > 0
                ? `Fant ${totalResults} resultat${totalResults !== 1 ? 'er' : ''}`
                : 'Ingen resultater funnet'}
            </p>
          )}
        </Card>

        {/* Results or No Results Message */}
        {filteredCategories.length === 0 ? (
          <Card className="p-12 text-center">
            <HelpCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Ingen resultater funnet</h3>
            <p className="text-muted-foreground mb-6">
              Prøv andre søkeord eller kontakt oss direkte på{' '}
              <a href="mailto:support@nexify.no" className="text-blue-600 hover:underline">
                support@nexify.no
              </a>
            </p>
            <Button onClick={handleClearSearch} variant="outline">
              Nullstill søk
            </Button>
          </Card>
        ) : (
          <>
        {filteredCategories.map((category, categoryIndex) => {
          const Icon = category.icon;
          return (
            <Card key={categoryIndex} className="mb-8">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`${category.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-7 w-7 ${category.color}`} />
                  </div>
                  <h2 className="text-2xl font-bold">{category.title}</h2>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item, index) => (
                    <AccordionItem key={index} value={`item-${categoryIndex}-${index}`}>
                      <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-2">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </Card>
          );
        })}
          </>
        )}

        {/* Contact CTA */}
        <Card className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white border-0 mt-12">
          <div className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Fant du ikke svaret du lette etter?</h3>
            <p className="text-lg mb-6">
              Vårt supportteam er her for å hjelpe deg! Vi svarer vanligvis innen 24 timer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@nexify.no" 
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
              >
                Kontakt support
              </a>
              <a 
                href="/landing" 
                className="bg-white/10 backdrop-blur-sm px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors inline-block"
              >
                Tilbake til forsiden
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
