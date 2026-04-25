// ═══════════════════════════════════════════════════
//  OO Studio — Module Data
//  window.MODULES  →  gelezen door app.js
// ═══════════════════════════════════════════════════
window.MODULES = [
  // ─────────────────────────────────────────────────
  //  MODULE 1 — Klassen & Objecten
  // ─────────────────────────────────────────────────
  {
    id: 1, title: "Klassen & Objecten", subtitle: "De bouwstenen van OOP",
    emoji: "🏗️", color: "#3cb497", weeks: "Week 1–2",
    tagline: "Van een idee naar een werkende klasse en object",
    theory: [
      {
        title: "Van procedureel naar Object Georiënteerd",
        icon: "🔄",
        content: `Procedureel programmeren: code als een reeks stappen waarbij data en functies gescheiden zijn.

Object Georiënteerd Programmeren (OOP) organiseert code rondom objecten — combinaties van data ÉN gedrag.

Voordelen van OOP:
• Betere structuur en leesbaarheid
• Code hergebruik via overerving
• Makkelijker onderhoudbaar en uitbreidbaar
• Modelleert het probleemdomein op een natuurlijke manier`,
        code: `// Procedureel:
string merk = "Toyota";
int bouwjaar = 2020;
void PrintInfo(string m, int j) {
    Console.WriteLine($"{m} ({j})");
}

// Object Georiënteerd:
Auto mijnAuto = new Auto("Toyota", 2020);
mijnAuto.PrintInfo();  // data + gedrag samen!`
      },
      {
        title: "Een klasse definiëren",
        icon: "📦",
        content: `Een klasse is een blauwdruk (sjabloon) voor objecten. Ze beschrijft:
• Attributen  → wat een object WEET (fields/properties)
• Gedrag       → wat een object KAN (methodes)

In C# gebruik je het keyword class gevolgd door de naam (PascalCase).

In UML wordt een klasse getoond als een rechthoek met 3 secties:
- Bovenste sectie: klassenaam
- Middelste sectie: attributen met zichtbaarheid (- privaat, + publiek)
- Onderste sectie: methodes`,
        uml: `classDiagram
  class Auto {
    -string merk
    -int bouwjaar
    +Auto(merk, bouwjaar)
    +PrintInfo() void
  }`,
        code: `class Auto
{
    // Fields (attributen) — privaat
    private string merk;
    private int bouwjaar;

    // Constructor
    public Auto(string merk, int bouwjaar)
    {
        this.merk = merk;
        this.bouwjaar = bouwjaar;
    }

    // Methode (gedrag) — publiek
    public void PrintInfo()
    {
        Console.WriteLine($"{merk} ({bouwjaar})");
    }
}`
      },
      {
        title: "Objecten aanmaken (instantiëren)",
        icon: "✨",
        content: `Een object is een concreet exemplaar van een klasse. Je maakt een object aan met het keyword new.

Meerdere objecten van dezelfde klasse zijn mogelijk — elk met hun eigen data.

De variabele (bijv. auto1) is een REFERENTIE naar het object op de heap.`,
        code: `// Objecten aanmaken
Auto auto1 = new Auto("Toyota", 2020);
Auto auto2 = new Auto("BMW", 2022);
Auto auto3 = new Auto("Peugeot", 2019);

// Elk object heeft zijn eigen data
auto1.PrintInfo();  // Toyota (2020)
auto2.PrintInfo();  // BMW (2022)
auto3.PrintInfo();  // Peugeot (2019)

// auto1 en auto2 zijn referenties — ze wijzen
// naar objecten op de heap (vrij geheugen)`
      },
      {
        title: "Toegangsmodifiers",
        icon: "🔒",
        content: `Toegangsmodifiers bepalen wie een lid van een klasse kan zien en gebruiken. Dit heet encapsulatie: verberg de interne details, bied een publieke interface aan.

• public    (+)  → overal bereikbaar
• private   (-)  → alleen binnen de klasse zelf
• protected (#)  → alleen binnen de klasse en subklassen
• internal  (~)  → alleen binnen hetzelfde project

Goede vuistregel: fields zijn altijd private, methodes/properties zijn public als ze van buiten nodig zijn.`,
        code: `class BankRekening
{
    private double saldo;       // (-) niemand buiten kan dit direct lezen
    public string Eigenaar;     // (+) iedereen kan dit lezen/wijzigen

    public void Storten(double bedrag)  // (+) publieke actie
    {
        if (bedrag > 0)
            saldo += bedrag;    // intern mag saldo wél worden aangepast
    }

    public double GetSaldo()    // (+) gecontroleerde toegang
    {
        return saldo;
    }
}`
      }
    ],
    quiz: [
      {
        type: "mc", xp: 20,
        q: "Wat is het verschil tussen een klasse en een object?",
        options: [
          "Ze zijn hetzelfde — klasse en object zijn synoniemen",
          "Een klasse is de blauwdruk; een object is een concrete instantie",
          "Een object is de blauwdruk; een klasse is een instantie",
          "Een klasse bevat alleen methodes, een object alleen data"
        ],
        answer: 1
      },
      {
        type: "fill", xp: 25,
        q: "Je maakt een object aan van de klasse Auto met: `Auto a = ___ Auto(\"BMW\", 2022);`",
        prefix: "Auto a = ", suffix: ' Auto("BMW", 2022);',
        answer: ["new"]
      },
      {
        type: "mc", xp: 20,
        q: "Welke toegangsmodifier gebruik je voor fields om encapsulatie te garanderen?",
        options: ["public", "protected", "private", "internal"],
        answer: 2
      },
      {
        type: "fill", xp: 25,
        q: "In UML staat het symbool `-` voor welke toegangsmodifier?",
        prefix: "- staat voor: ", suffix: "",
        answer: ["private"]
      }
    ],
    exercises: [
      {
        title: "Oefening 1 — Persoon klasse",
        description: "Maak een klasse Persoon met private fields naam en leeftijd, een constructor, en een methode StelVoor() die zichzelf voorstelt.",
        hint: "Gebruik this.naam = naam; in de constructor om het field te vullen.",
        starter: `using System;

// TODO: Definieer de klasse Persoon
// - private fields: naam (string), leeftijd (int)
// - constructor: Persoon(string naam, int leeftijd)
// - methode: void StelVoor()
//   → print "Hallo, ik ben [naam], ik ben [leeftijd] jaar."

class Program
{
    static void Main()
    {
        // Maak 2 Persoon-objecten aan en roep StelVoor() op

    }
}`
      },
      {
        title: "Oefening 2 — BankRekening klasse",
        description: "Maak een BankRekening klasse met een privaat saldo, methodes Storten en Opnemen (opnemen mag niet als saldo onvoldoende is), en GetSaldo.",
        hint: "Controleer in Opnemen of bedrag <= saldo voor je aftrekt.",
        starter: `using System;

// TODO: Maak de klasse BankRekening
// - private double saldo (start op 0)
// - public string Eigenaar
// - void Storten(double bedrag)
// - void Opnemen(double bedrag) — print foutmelding als saldo onvoldoende
// - double GetSaldo()

class Program
{
    static void Main()
    {
        BankRekening r = new BankRekening();
        r.Eigenaar = "Joris";
        r.Storten(500);
        r.Opnemen(200);
        r.Opnemen(400); // onvoldoende saldo!
        Console.WriteLine($"Saldo: {r.GetSaldo()}");
    }
}`
      }
    ],
    deliverables: [
      { text: "Maak een klasse Product met name, prijs en btw-percentage. Voeg een methode PrijsMetBtw() toe. Teken het bijhorende UML-diagram.", xp: 50 },
      { text: "Maak 3 Product-objecten aan in Main() en druk de prijs met BTW af voor elk product.", xp: 30 }
    ]
  },

  // ─────────────────────────────────────────────────
  //  MODULE 2 — Methodes & Properties
  // ─────────────────────────────────────────────────
  {
    id: 2, title: "Methodes & Properties", subtitle: "Gedrag en toegang verfijnen",
    emoji: "🔧", color: "#00639c", weeks: "Week 2–3",
    tagline: "Properties als slimme fields, methodes met parameters en return-waarden",
    theory: [
      {
        title: "Methodes — return types & parameters",
        icon: "⚙️",
        content: `Een methode is een blok code met een naam dat je kunt aanroepen.

Anatomie van een methode:
  [modifier] [returntype] NaamVanMethode([parameters])

• returntype void   → geeft niets terug
• returntype int    → geeft een geheel getal terug — gebruik return
• returntype string → geeft tekst terug
• Parameters        → inputwaarden die je meegeeft bij de aanroep

In UML staat in de onderste sectie van de klasse:
  +NaamVanMethode(param: type) returntype`,
        uml: `classDiagram
  class Rekenmachine {
    +Optellen(a: int, b: int) int
    +Beschrijving() string
    +Reset() void
  }`,
        code: `class Rekenmachine
{
    private double geheugen = 0;

    // returntype int, 2 parameters
    public int Optellen(int a, int b)
    {
        return a + b;
    }

    // returntype string, geen parameters
    public string Beschrijving()
    {
        return "Ik ben een rekenmachine";
    }

    // returntype void — slaat resultaat op
    public void OpslaanInGeheugen(double waarde)
    {
        geheugen = waarde;
    }

    public double LeesBeurten() => geheugen;
}`
      },
      {
        title: "Method Overloading",
        icon: "📋",
        content: `Overloading = meerdere methodes met DEZELFDE naam maar ANDERE parameters in dezelfde klasse.

Regels voor geldige overloading:
✅ Ander aantal parameters
✅ Andere typen parameters
✅ Combinatie van beide
❌ Enkel ander returntype → GEEN geldige overloading!

De compiler kiest op compile-time de juiste versie op basis van het type en het aantal argumenten.

In UML verschijnt elke variant afzonderlijk in de onderste sectie.
Dit is een vorm van compile-time polymorfisme.`,
        uml: `classDiagram
  class Printer {
    +Print(tekst: string) void
    +Print(getal: int) void
    +Print(tekst: string, herhaling: int) void
    +Print(waarde: double, decimalen: int) void
  }`,
        code: `class Printer
{
    // variant 1: één string
    public void Print(string tekst)
        => Console.WriteLine($"Tekst: {tekst}");

    // variant 2: één int
    public void Print(int getal)
        => Console.WriteLine($"Getal: {getal}");

    // variant 3: string + herhaling
    public void Print(string tekst, int herhaling)
    {
        for (int i = 0; i < herhaling; i++)
            Console.WriteLine(tekst);
    }

    // variant 4: double + precisie
    public void Print(double waarde, int decimalen)
        => Console.WriteLine(waarde.ToString("F" + decimalen));
}

// Gebruik — compiler kiest automatisch de juiste variant:
Printer p = new Printer();
p.Print("Hallo");        // → variant 1
p.Print(42);             // → variant 2
p.Print("OOP!", 3);      // → variant 3
p.Print(3.14159, 2);     // → variant 4`
      },
      {
        title: "Auto-properties — van lang naar kort",
        icon: "🎛️",
        content: `Een property is een publieke toegangspoort naar private data. Ze zien eruit als een field, maar hebben een getter (lezen) en een setter (schrijven) — optioneel met logica erin.

─── Stap 1: de lange schrijfwijze (volledig uitgeschreven) ───
Je beheert zelf een privaat backing field (_naam) en schrijft get/set volledig uit.
Dit geeft maximale controle: je kunt validatie, logging of berekeningen toevoegen.

─── Stap 2: auto-property { get; set; } ───
Wanneer je GEEN extra logica nodig hebt, schrijft de compiler het backing field én de get/set voor jou.
  public string Naam { get; set; }
is volledig equivalent aan de lange versie — maar dan in één regel!

─── Stap 3: standaardwaarde ───
Auto-properties kunnen een beginwaarde krijgen direct na de definitie:
  public string Status { get; set; } = "Actief";

─── Stap 4: object initializer ───
Met auto-properties kun je properties instellen zonder constructor:
  var p = new Persoon { Naam = "Tom", Leeftijd = 25 };
Dit werkt enkel als de property een publieke setter heeft.

In UML staan properties in de middelste sectie: +Naam : type`,
        uml: `classDiagram
  class Persoon {
    +string Naam
    +int Leeftijd
    +string Status
    +Persoon()
    +Persoon(naam: string, leeftijd: int)
    +StelVoor() string
  }`,
        code: `// ── Lange schrijfwijze (backing field zichtbaar) ──
class PersoonLang
{
    private string _naam;      // backing field
    private int _leeftijd;

    public string Naam
    {
        get { return _naam; }          // lezen
        set { _naam = value; }         // schrijven (value = nieuwe waarde)
    }

    public int Leeftijd
    {
        get { return _leeftijd; }
        set
        {
            if (value < 0) throw new ArgumentException("Negatief!");
            _leeftijd = value;         // validatie vóór opslaan
        }
    }
}

// ── Auto-property (compiler doet het backing field) ──
class Persoon
{
    // compiler genereert zelf het private backing field
    public string Naam { get; set; }
    public int Leeftijd { get; set; }

    // Standaardwaarde direct meegeven
    public string Status { get; set; } = "Actief";
    public int AantalLogins { get; set; } = 0;

    // Constructor — gebruikt de properties
    public Persoon(string naam, int leeftijd)
    {
        Naam = naam;
        Leeftijd = leeftijd;
    }

    // Parameterloze constructor — properties via object initializer
    public Persoon() { }

    public string StelVoor()
        => $"Ik ben {Naam}, {Leeftijd} jaar oud. Status: {Status}";
}

// ── Object initializer (zonder constructor met parameters) ──
var p1 = new Persoon("Lisa", 22);                   // via constructor
var p2 = new Persoon { Naam = "Tom", Leeftijd = 25 }; // via initializer
var p3 = new Persoon { Naam = "An" };               // Leeftijd = 0 (default)

Console.WriteLine(p1.StelVoor());
Console.WriteLine(p2.Naam);    // Tom
p2.Leeftijd = 26;              // setter aanroepen
Console.WriteLine(p2.Leeftijd); // 26`
      },
      {
        title: "Berekende & Read-only properties",
        icon: "✂️",
        content: `Properties zijn niet altijd gekoppeld aan één field — ze kunnen ook een BEREKENDE waarde teruggeven.

Soorten properties:
• Volledig { get; set; }         → lees + schrijf (auto-property)
• { get; private set; }          → van buiten enkel leesbaar, intern schrijfbaar
• { get; init; }                 → alleen via constructor/object initializer instelbaar
• { get; }                       → écht read-only, enkel in constructor te zetten
• Expression-bodied => …         → berekende waarde, geen backing field nodig

In UML duidt een schuine streep (/) vóór de naam aan dat een property berekend is:
  /Diameter : double     (computed — geen eigen field, afgeleid van Straal)
  /Oppervlakte : double  (computed — afgeleid van Straal)

Berekende properties zijn elegant: geen dubbele data, altijd up-to-date.`,
        uml: `classDiagram
  class Cirkel {
    +double Straal
    +string Kleur
    +/double Diameter
    +/double Oppervlakte
    +Cirkel(straal: double, kleur: string)
    +ToString() string
  }`,
        code: `class Cirkel
{
    // Auto-property — lees + schrijf
    public double Straal { get; set; }

    // Read-only init — alleen via constructor
    public string Kleur { get; init; }

    // Read-only — nooit te wijzigen na constructor
    public int AanmaakJaar { get; }

    public Cirkel(double straal, string kleur)
    {
        Straal = straal;
        Kleur = kleur;
        AanmaakJaar = DateTime.Now.Year;  // enkel hier
    }

    // Berekende (computed) properties — geen backing field
    public double Diameter => Straal * 2;
    public double Oppervlakte => Math.PI * Straal * Straal;
    public double Omtrek => 2 * Math.PI * Straal;

    // Private set — van buiten lezen, intern aanpassen
    public int AantalBerekeningen { get; private set; } = 0;

    public double BerekenOppervlakte()
    {
        AantalBerekeningen++;          // intern schrijven OK
        return Oppervlakte;
    }

    public override string ToString()
        => $"Cirkel(r={Straal}, kleur={Kleur}) — opp={Oppervlakte:F2}";
}

// Gebruik:
var c = new Cirkel(5, "Rood");
Console.WriteLine(c.Diameter);       // 10  — berekend
Console.WriteLine(c.Oppervlakte);    // 78.54...
// c.AanmaakJaar = 2000;             // FOUT: read-only!
// c.AantalBerekeningen = 5;         // FOUT: private set!`
      },
      {
        title: "Constructor overloading & this()",
        icon: "🏗️",
        content: `Je kunt meerdere constructors definiëren (overloading). Gebruik this() om de ene constructor vanuit de andere aan te roepen en herhaling te vermijden.

Regels:
• Elke constructor heeft een ANDER aantal of type parameters
• this(…) delegeert naar een andere constructor van dezelfde klasse
• De gedelegeerde constructor draait EERST, daarna de rest van de huidige constructor

Default constructor: zonder parameters — handig als fields later worden ingesteld via properties.

In UML verschijnen alle constructors apart in de onderste sectie, met hun eigen parameterlijst.`,
        uml: `classDiagram
  class Auto {
    +string Merk
    +string Kleur
    +int Bouwjaar
    +Auto(merk: string, kleur: string, bouwjaar: int)
    +Auto(merk: string, bouwjaar: int)
    +Auto()
    +ToString() string
  }`,
        code: `class Auto
{
    public string Merk { get; set; }
    public string Kleur { get; set; }
    public int Bouwjaar { get; set; }

    // Volledige constructor
    public Auto(string merk, string kleur, int bouwjaar)
    {
        Merk = merk;
        Kleur = kleur;
        Bouwjaar = bouwjaar;
    }

    // Delegeert naar volledige constructor via this()
    public Auto(string merk, int bouwjaar)
        : this(merk, "Zwart", bouwjaar) { }

    // Default constructor
    public Auto() : this("Onbekend", 2024) { }

    public override string ToString()
        => $"{Merk} - {Kleur} ({Bouwjaar})";
}`
      }
    ],
    quiz: [
      {
        type: "mc", xp: 20,
        q: "Wat is het voordeel van een property met validatie t.o.v. een publiek field?",
        options: [
          "Properties zijn sneller dan fields",
          "Je kunt in de setter controleren of de waarde geldig is",
          "Properties gebruiken minder geheugen",
          "Er is geen verschil"
        ],
        answer: 1
      },
      {
        type: "fill", xp: 25,
        q: "Een property die van buiten alleen gelezen kan worden, maar intern wel gezet: `public int Leeftijd { get; ___ set; }`",
        prefix: "{ get; ", suffix: " set; }",
        answer: ["private"]
      },
      {
        type: "mc", xp: 20,
        q: "Wat doet de compiler bij een auto-property `public string Naam { get; set; }`?",
        options: [
          "Niets — het is gewoon een publiek field met een andere schrijfwijze",
          "Hij genereert automatisch een privaat backing field én de get/set-implementatie",
          "Hij voegt automatisch validatie toe aan de setter",
          "Hij maakt de property read-only"
        ],
        answer: 1
      },
      {
        type: "fill", xp: 20,
        q: "Een object aanmaken zonder constructor-parameters heet een object ___: `var p = new Persoon { Naam = \"Tom\" };`",
        prefix: "object ", suffix: "",
        answer: ["initializer", "initialisatie"]
      },
      {
        type: "mc", xp: 20,
        q: "Welke methode-handtekeningen zijn geldige overloads van `void Print(string s)`?",
        options: [
          "string Print(string s)  — enkel returntype verschilt",
          "void Print(string s, int n)  — extra parameter toegevoegd",
          "void print(string s)  — alleen naam verschilt (lowercase)",
          "void Print(string boodschap)  — alleen parameternaam verschilt"
        ],
        answer: 1
      },
      {
        type: "fill", xp: 25,
        q: "Een berekende (computed) property Diameter in UML krijgt vóór de naam een: `___ Diameter : double`",
        prefix: "", suffix: " Diameter : double",
        answer: ["/"]
      }
    ],
    exercises: [
      {
        title: "Oefening 1 — Temperatuur converter",
        description: "Maak een klasse Temperatuur met een private _celsius field en een property Celsius (met validatie: min -273.15). Voeg read-only properties Fahrenheit en Kelvin toe als expression-bodied properties.",
        hint: "Fahrenheit = Celsius * 9/5 + 32  |  Kelvin = Celsius + 273.15",
        starter: `using System;

class Temperatuur
{
    private double _celsius;

    // TODO: Property Celsius met validatie (>= -273.15)

    // TODO: Expression-bodied property Fahrenheit

    // TODO: Expression-bodied property Kelvin

    public Temperatuur(double celsius)
    {
        Celsius = celsius;
    }

    public override string ToString()
        => $"{Celsius}°C = {Fahrenheit:F1}°F = {Kelvin:F1}K";
}

class Program
{
    static void Main()
    {
        Temperatuur t = new Temperatuur(100);
        Console.WriteLine(t);
        t.Celsius = -300; // ongeldige waarde!
        t.Celsius = 0;
        Console.WriteLine(t);
    }
}`
      },
      {
        title: "Oefening 2 — Method & Constructor Overloading",
        description: "Maak een klasse Rekenmachine met overloaded methodes Optellen (int+int, double+double, drie ints) én overloaded constructors (default en met naam). Toon aan dat de compiler de juiste versie kiest.",
        hint: "Overloading werkt op aantal EN type parameters — schrijf elke variant volledig uit.",
        starter: `using System;

class Rekenmachine
{
    public string Naam { get; }

    // TODO: Overloaded constructors
    // 1. Rekenmachine()  → Naam = "Standaard"
    // 2. Rekenmachine(string naam)  → Naam = naam

    // TODO: Overloaded Optellen methodes
    // 1. int    Optellen(int a, int b)
    // 2. double Optellen(double a, double b)
    // 3. int    Optellen(int a, int b, int c)

    // TODO: override ToString() → $"Rekenmachine: {Naam}"
}

class Program
{
    static void Main()
    {
        var r1 = new Rekenmachine();
        var r2 = new Rekenmachine("Wetenschappelijk");

        Console.WriteLine(r1);                     // Rekenmachine: Standaard
        Console.WriteLine(r2);                     // Rekenmachine: Wetenschappelijk

        Console.WriteLine(r1.Optellen(3, 4));      // int versie: 7
        Console.WriteLine(r1.Optellen(1.5, 2.3)); // double versie: 3.8
        Console.WriteLine(r1.Optellen(1, 2, 3));   // drie ints: 6
    }
}`
      }
    ],
    deliverables: [
      { text: "Maak een klasse Student met properties Naam en Punten (0–100), een berekende read-only property Geslaagd (bool) en een overloaded constructor (met én zonder startpunten). Teken het volledige UML-diagram incl. '/' voor berekende properties.", xp: 50 },
      { text: "Voeg aan de Student-klasse overloaded methodes Beoordeling() toe: één zonder parameters (geeft string terug op basis van Punten) en één met int drempelwaarde als parameter (geeft bool terug). Test beide varianten in Main().", xp: 30 }
    ]
  },

  // ─────────────────────────────────────────────────
  //  MODULE 3 — Overerving
  // ─────────────────────────────────────────────────
  {
    id: 3, title: "Overerving", subtitle: "Code hergebruik via hiërarchieën",
    emoji: "🔗", color: "#9B5CF6", weeks: "Week 3–4",
    tagline: "Basisklassen, subklassen en de kracht van is-een relaties",
    theory: [
      {
        title: "Het concept overerving",
        icon: "🌳",
        content: `Overerving laat toe dat een klasse (subklasse) alle leden van een andere klasse (basisklasse) erft.

Gebruik overerving wanneer er een IS-EEN relatie is:
• Een Hond IS EEN Dier ✅
• Een Auto IS EEN Voertuig ✅
• Een Hond IS EEN Auto ❌

Voordelen:
• Code hergebruik — gedeelde logica staat op één plek
• Uitbreiding — subklassen voegen eigen gedrag toe
• Hiërarchie — modelleert de echte wereld

In UML duidt een pijl met gesloten driehoekje (──▷) op overerving.`,
        uml: `classDiagram
  Dier <|-- Hond
  Dier <|-- Kat
  class Dier {
    #string Naam
    +Dier(naam)
    +Geluid() string
    +Beschrijf() void
  }
  class Hond {
    +Geluid() string
  }
  class Kat {
    +Geluid() string
  }`,
        code: `// Basisklasse
class Dier
{
    protected string Naam { get; set; }  // protected: ook in subklassen zichtbaar

    public Dier(string naam)
    {
        Naam = naam;
    }

    public virtual string Geluid()   // virtual = kan overschreven worden
    {
        return "...";
    }

    public void Beschrijf()
    {
        Console.WriteLine($"{Naam} zegt: {Geluid()}");
    }
}

// Subklassen
class Hond : Dier       // Hond erft van Dier
{
    public Hond(string naam) : base(naam) { }  // roep basisklasse-constructor aan

    public override string Geluid() => "Woef!"; // overschrijf de methode
}

class Kat : Dier
{
    public Kat(string naam) : base(naam) { }
    public override string Geluid() => "Miauw!";
}`
      },
      {
        title: "base keyword",
        icon: "🔑",
        content: `Het keyword base geeft toegang tot de basisklasse vanuit de subklasse.

Twee gebruikswijzen:
1. base(parameters)  → roep de basisklasse-constructor aan
2. base.Methode()    → roep een methode van de basisklasse aan

Dit is handig wanneer je de basisklasse-logica wil behouden én uitbreiden.`,
        code: `class Voertuig
{
    public string Merk { get; set; }
    public int Snelheid { get; set; }

    public Voertuig(string merk, int snelheid)
    {
        Merk = merk;
        Snelheid = snelheid;
    }

    public virtual string Info()
        => $"{Merk} — max. {Snelheid} km/u";
}

class ElektrischeAuto : Voertuig
{
    public int Bereik { get; set; }

    public ElektrischeAuto(string merk, int snelheid, int bereik)
        : base(merk, snelheid)   // basisklasse-constructor
    {
        Bereik = bereik;
    }

    public override string Info()
        => base.Info() + $" | Bereik: {Bereik} km";  // basisklasse-methode + uitbreiding
}`
      },
      {
        title: "virtual, override en sealed",
        icon: "🔧",
        content: `• virtual  → de methode KAN worden overschreven in subklassen
• override → OVERSCHRIJFT een virtual methode van de basisklasse
• sealed   → voorkomt verdere overerving van een klasse, of verder overriden van een methode

C# gebruikt standaard geen virtual — je moet het expliciet aangeven. Dit is anders dan Java.

sealed class: kan niet geërfd worden (bijv. String in .NET is sealed).`,
        code: `class Vorm
{
    public virtual double Oppervlakte() => 0;  // virtual: subklassen mogen overschrijven
}

class Cirkel : Vorm
{
    public double Straal { get; set; }
    public Cirkel(double r) { Straal = r; }

    public sealed override double Oppervlakte()    // sealed override: geen verdere override
        => Math.PI * Straal * Straal;
}

// class SpecialeCirkel : Cirkel   ← compileerfout als Cirkel sealed is
// {
//     public override double Oppervlakte() => ...  ← ook fout door sealed override
// }

sealed class Constanten   // deze klasse kan niet geërfd worden
{
    public const double PI = 3.14159265;
}`
      }
    ],
    quiz: [
      {
        type: "mc", xp: 20,
        q: "Welke relatie is geschikt voor overerving?",
        options: [
          "Een Auto HEEFT EEN Motor",
          "Een Cirkel IS EEN Vorm",
          "Een Student HEEFT EEN Cursus",
          "Een Bestelling HEEFT EEN Product"
        ],
        answer: 1
      },
      {
        type: "fill", xp: 25,
        q: "Een klasse ElektrischeAuto die erft van Voertuig: `class ElektrischeAuto ___ Voertuig`",
        prefix: "class ElektrischeAuto ", suffix: " Voertuig",
        answer: [":"]
      },
      {
        type: "mc", xp: 20,
        q: "Wat doet het keyword virtual voor een methode?",
        options: [
          "De methode wordt abstract — subklassen MOETEN hem implementeren",
          "De methode KAN worden overschreven in subklassen",
          "De methode is verborgen voor subklassen",
          "De methode is static"
        ],
        answer: 1
      },
      {
        type: "fill", xp: 25,
        q: "Om de constructor van de basisklasse aan te roepen vanuit de subklasse-constructor: `public Hond(string naam) : ___(naam) { }`",
        prefix: ': ', suffix: '(naam) { }',
        answer: ["base"]
      }
    ],
    exercises: [
      {
        title: "Oefening 1 — Dierenhiërarchie",
        description: "Maak een basisklasse Dier en subklassen Hond, Kat en Vogel. Override de methode Geluid() in elke subklasse. Maak een array van Dier-objecten en laat elk dier zijn geluid maken.",
        hint: "Je kunt een Dier[] array vullen met Hond, Kat en Vogel objecten — dat is polymorfisme!",
        starter: `using System;

class Dier
{
    public string Naam { get; set; }
    public Dier(string naam) { Naam = naam; }

    public virtual string Geluid() => "...";

    public void Beschrijf()
        => Console.WriteLine($"{Naam} zegt: {Geluid()}");
}

// TODO: Maak klassen Hond, Kat en Vogel die erven van Dier
// Override Geluid() in elk



class Program
{
    static void Main()
    {
        Dier[] dieren = {
            new Hond("Rex"),
            new Kat("Whiskers"),
            new Vogel("Tweety")
        };

        foreach (var d in dieren)
            d.Beschrijf();
    }
}`
      },
      {
        title: "Oefening 2 — Voertuig hiërarchie",
        description: "Maak een klasse Voertuig (merk, snelheid, Info()). Maak subklassen Auto (aantalDeuren) en Fiets (elektrisch: bool). Override Info() en gebruik base.Info().",
        hint: "base.Info() geeft de info van Voertuig terug — voeg er dan de subklasse-info aan toe.",
        starter: `using System;

class Voertuig
{
    public string Merk { get; set; }
    public int MaxSnelheid { get; set; }

    public Voertuig(string merk, int snelheid)
    {
        Merk = merk;
        MaxSnelheid = snelheid;
    }

    public virtual string Info()
        => $"{Merk} (max. {MaxSnelheid} km/u)";
}

// TODO: klasse Auto : Voertuig
//   - int AantalDeuren
//   - override Info() met base.Info() + deuren

// TODO: klasse Fiets : Voertuig
//   - bool IsElektrisch
//   - override Info()

class Program
{
    static void Main()
    {
        var voertuigen = new Voertuig[]
        {
            new Auto("Volvo", 200, 4),
            new Fiets("Trek", 30, true),
            new Fiets("Gazelle", 25, false)
        };

        foreach (var v in voertuigen)
            Console.WriteLine(v.Info());
    }
}`
      }
    ],
    deliverables: [
      { text: "Maak een hiërarchie: Medewerker (naam, salaris) → Manager (afdeling, bonus) en Ontwikkelaar (programmeertaal). Override ToString(). Teken het UML-diagram met overervingspijlen.", xp: 60 },
      { text: "Voeg aan Medewerker een virtual methode BerekenJaarloon() toe. Override ze in Manager (salaris + bonus) en Ontwikkelaar (salaris * 1.1).", xp: 40 }
    ]
  },

  // ─────────────────────────────────────────────────
  //  MODULE 4 — Polymorfisme
  // ─────────────────────────────────────────────────
  {
    id: 4, title: "Polymorfisme", subtitle: "Één interface, meerdere vormen",
    emoji: "🎭", color: "#d97706", weeks: "Week 4–5",
    tagline: "Runtime polymorfisme, upcasting en patroonherkenning",
    theory: [
      {
        title: "Polymorfisme — het concept",
        icon: "🔄",
        content: `Polymorfisme (Grieks: "veel vormen") betekent dat een variabele van het type basisklasse kan verwijzen naar een object van een subklasse, en dat de juiste methode automatisch wordt aangeroepen.

Runtime polymorfisme: welke methode wordt aangeroepen, wordt bepaald op RUNTIME (niet compile-time) op basis van het werkelijke type.

Dit maakt code flexibel en uitbreidbaar — je hoeft niet te weten welk exact type je hebt.`,
        uml: `classDiagram
  Vorm <|-- Cirkel
  Vorm <|-- Rechthoek
  class Vorm {
    +Oppervlakte() double
    +Omtrek() double
  }
  class Cirkel {
    -double straal
    +Oppervlakte() double
    +Omtrek() double
  }
  class Rechthoek {
    -double breedte
    -double hoogte
    +Oppervlakte() double
    +Omtrek() double
  }`,
        code: `Vorm[] vormen = {
    new Cirkel(5),
    new Rechthoek(4, 6),
    new Cirkel(3)
};

// Polymorfisme in actie:
// C# roept de juiste Override aan op basis van het werkelijke type
foreach (Vorm v in vormen)
{
    Console.WriteLine($"Oppervlakte: {v.Oppervlakte():F2}");
}
// Output:
// Oppervlakte: 78.54   (Cirkel)
// Oppervlakte: 24.00   (Rechthoek)
// Oppervlakte: 28.27   (Cirkel)`
      },
      {
        title: "Upcasting & Downcasting",
        icon: "📐",
        content: `Upcasting: object van subklasse opslaan in basisklasse-variabele (automatisch, altijd veilig).
Downcasting: basisklasse-variabele omzetten naar subklasse (handmatig, kan mislukken).

Gebruik is om het type te controleren, as voor een veilige cast (geeft null als het type niet klopt).

C# 7+ patroonherkenning: if (dier is Hond hond) { ... } — compact en veilig.`,
        code: `Dier dier = new Hond("Rex");  // upcasting (automatisch)

// Manier 1: is + cast
if (dier is Hond)
{
    Hond h = (Hond)dier;   // downcasting — werkt want we controleerden
    h.ApporterenSpelen();
}

// Manier 2: as (null als fout type)
Hond hond = dier as Hond;
if (hond != null)
    hond.ApporterenSpelen();

// Manier 3: patroonherkenning (aanbevolen, C# 7+)
if (dier is Hond rex)
{
    rex.ApporterenSpelen();  // rex is al het juiste type
}`
      },
      {
        title: "Method Overloading",
        icon: "📋",
        content: `Overloading (compile-time polymorfisme): meerdere methodes met dezelfde naam maar verschillende parameters. De compiler kiest de juiste versie op compile-time.

Verschil met overriding:
• Overloading = zelfde naam, andere parameters, ZELFDE klasse
• Overriding   = zelfde naam, zelfde parameters, ANDERE klasse (subklasse)`,
        code: `class Printer
{
    // Overloading: zelfde naam, andere types
    public void Print(string tekst)
        => Console.WriteLine($"Tekst: {tekst}");

    public void Print(int getal)
        => Console.WriteLine($"Getal: {getal}");

    public void Print(string tekst, int herhaling)
    {
        for (int i = 0; i < herhaling; i++)
            Console.WriteLine(tekst);
    }
}

// Aanroep: compiler kiest automatisch de juiste versie
Printer p = new Printer();
p.Print("Hallo");     // → Print(string)
p.Print(42);          // → Print(int)
p.Print("OOP!", 3);   // → Print(string, int)`
      }
    ],
    quiz: [
      {
        type: "mc", xp: 20,
        q: "Wat is het verschil tussen method overloading en method overriding?",
        options: [
          "Er is geen verschil — het zijn synoniemen",
          "Overloading: zelfde naam/andere parameters in dezelfde klasse. Overriding: zelfde naam/parameters in subklasse.",
          "Overriding: zelfde naam/andere parameters in dezelfde klasse. Overloading: in subklasse.",
          "Overloading werkt alleen met static methodes"
        ],
        answer: 1
      },
      {
        type: "fill", xp: 25,
        q: "Patroonherkenning in C# 7+: `if (dier ___ Hond rex) { rex.Blaffen(); }`",
        prefix: "if (dier ", suffix: " Hond rex)",
        answer: ["is"]
      },
      {
        type: "mc", xp: 20,
        q: "Wat is upcasting?",
        options: [
          "Een subklasse-object opslaan in een basisklasse-variabele",
          "Een basisklasse-object omzetten naar een subklasse",
          "Een methode opnieuw definiëren in een subklasse",
          "Een object kopiëren naar een ander type"
        ],
        answer: 0
      },
      {
        type: "fill", xp: 25,
        q: "Veilige cast met as: `Hond h = dier ___ Hond;`",
        prefix: "Hond h = dier ", suffix: " Hond;",
        answer: ["as"]
      }
    ],
    exercises: [
      {
        title: "Oefening 1 — Polymorfisme met vormen",
        description: "Maak basisklasse Vorm en subklassen Cirkel, Rechthoek en Driehoek. Elke klasse overschrijft Oppervlakte() en Omtrek(). Druk voor een lijst vormen de totale oppervlakte af.",
        hint: "Driehoek: Oppervlakte = 0.5 * basis * hoogte, Omtrek = a + b + c",
        starter: `using System;

class Vorm
{
    public virtual double Oppervlakte() => 0;
    public virtual double Omtrek() => 0;
    public override string ToString()
        => $"{GetType().Name}: opp={Oppervlakte():F2}, omtrek={Omtrek():F2}";
}

// TODO: Cirkel (straal), Rechthoek (breedte, hoogte), Driehoek (basis, hoogte, zijdeA, zijdeB, zijdeC)

class Program
{
    static void Main()
    {
        Vorm[] vormen = {
            new Cirkel(5),
            new Rechthoek(4, 6),
            new Driehoek(3, 4, 3, 4, 5),
        };

        double totaal = 0;
        foreach (var v in vormen)
        {
            Console.WriteLine(v);
            totaal += v.Oppervlakte();
        }
        Console.WriteLine($"Totale oppervlakte: {totaal:F2}");
    }
}`
      },
      {
        title: "Oefening 2 — is/as & patroonherkenning",
        description: "Gegeven een lijst van Dier-objecten (Hond, Kat, Vogel). Gebruik is/as en patroonherkenning om speciale acties per type te doen.",
        hint: "foreach (var d in dieren) { if (d is Hond h) h.Apporteren(); }",
        starter: `using System;

class Dier { public string Naam; public Dier(string n) { Naam = n; } }
class Hond : Dier {
    public Hond(string n) : base(n) { }
    public void Apporteren() => Console.WriteLine($"{Naam} apporteert!");
}
class Kat : Dier {
    public Kat(string n) : base(n) { }
    public void Spinnen() => Console.WriteLine($"{Naam} spint...");
}
class Vogel : Dier {
    public Vogel(string n) : base(n) { }
    public void Vliegen() => Console.WriteLine($"{Naam} vliegt weg!");
}

class Program
{
    static void Main()
    {
        Dier[] dieren = { new Hond("Rex"), new Kat("Nora"), new Vogel("Tweety"), new Hond("Buddy") };

        // TODO: loop over dieren
        // gebruik patroonherkenning (is Type variabele)
        // voor elke subklasse, voer de specifieke actie uit
    }
}`
      }
    ],
    deliverables: [
      { text: "Maak een klasse Werknemer en subklassen Voltijds, Deeltijds en Freelancer. Override BerekenLoon(). Toon in een UML-diagram de relaties en methodes.", xp: 60 },
      { text: "Maak een lijst van Werknemer-objecten met mixed types. Bereken het totale loon via polymorfisme.", xp: 30 }
    ]
  },

  // ─────────────────────────────────────────────────
  //  MODULE 5 — Abstracte Klassen & Interfaces
  // ─────────────────────────────────────────────────
  {
    id: 5, title: "Abstract & Interfaces", subtitle: "Contracten en verplichte implementatie",
    emoji: "🔲", color: "#e73f16", weeks: "Week 5–6",
    tagline: "abstract klassen en interfaces: wanneer gebruik je wat?",
    theory: [
      {
        title: "Abstracte klassen",
        icon: "🚧",
        content: `Een abstracte klasse is een klasse waarvan je GEEN object kunt aanmaken. Ze dient als basisklasse voor subklassen.

• abstract methode: heeft GEEN implementatie — subklasse MOET deze implementeren
• Kan mix hebben van abstracte en concrete methodes
• Kan fields, constructors en properties bevatten
• In UML: klassenaam in schuinschrift (of «abstract» stereotype)`,
        uml: `classDiagram
  class Figuur {
    <<abstract>>
    #string kleur
    +Figuur(kleur)
    +Oppervlakte() double*
    +Omtrek() double*
    +Beschrijf() void
  }
  Figuur <|-- Cirkel
  Figuur <|-- Rechthoek
  class Cirkel {
    -double straal
    +Oppervlakte() double
    +Omtrek() double
  }
  class Rechthoek {
    -double b
    -double h
    +Oppervlakte() double
    +Omtrek() double
  }`,
        code: `abstract class Figuur          // abstract = kan niet geïnstantieerd worden
{
    protected string Kleur { get; set; }

    public Figuur(string kleur) { Kleur = kleur; }

    public abstract double Oppervlakte();   // abstract: GEEN implementatie
    public abstract double Omtrek();        // subklasse MOET dit implementeren

    // Concrete methode — wel implementatie, subklassen erven dit
    public void Beschrijf()
    {
        Console.WriteLine($"{GetType().Name} ({Kleur}): " +
            $"opp={Oppervlakte():F2}, omtrek={Omtrek():F2}");
    }
}

class Cirkel : Figuur
{
    private double _straal;
    public Cirkel(double straal, string kleur) : base(kleur) { _straal = straal; }

    public override double Oppervlakte() => Math.PI * _straal * _straal;
    public override double Omtrek() => 2 * Math.PI * _straal;
}

// Figuur f = new Figuur("rood");  ← FOUT: abstract klasse!`
      },
      {
        title: "Interfaces",
        icon: "🔌",
        content: `Een interface is een contract: het definieert WAT een klasse moet kunnen doen, niet HOE.

• Alle leden zijn standaard public
• Geen instantievariabelen (vóór C# 8), geen constructors
• Een klasse kan MEERDERE interfaces implementeren (multiple interface)
• In UML: «interface» stereotype + stippellijn met pijl (────▷)

Naamgevingsconventie: begint met een hoofdletter I (IVoertuig, IComparable)`,
        uml: `classDiagram
  class IVoertuig {
    <<interface>>
    +Rijden() void
    +Stoppen() void
    +MaxSnelheid int
  }
  class IRijbewijs {
    <<interface>>
    +Type string
  }
  IVoertuig <|.. Auto
  IRijbewijs <|.. Auto
  class Auto {
    +Rijden() void
    +Stoppen() void
    +MaxSnelheid int
    +Type string
  }`,
        code: `interface IVoertuig        // interface: contract zonder implementatie
{
    void Rijden();
    void Stoppen();
    int MaxSnelheid { get; }
}

interface IRijbewijs
{
    string Type { get; }   // "B", "C", "D" ...
}

// Een klasse kan MEERDERE interfaces implementeren
class Auto : IVoertuig, IRijbewijs
{
    public int MaxSnelheid => 180;
    public string Type => "B";

    public void Rijden()
        => Console.WriteLine($"Auto rijdt (max. {MaxSnelheid} km/u)");

    public void Stoppen()
        => Console.WriteLine("Auto stopt.");
}`
      },
      {
        title: "Abstract vs Interface — wanneer wat?",
        icon: "⚖️",
        content: `Abstracte klasse gebruiken wanneer:
✅ Er gedeelde code is (fields, concrete methodes)
✅ De klassen een IS-EEN relatie hebben
✅ Je constructors of toegangsmodifiers nodig hebt

Interface gebruiken wanneer:
✅ Je een contract definieert (KAN-DOE relatie)
✅ Meerdere niet-gerelateerde klassen hetzelfde moeten kunnen
✅ Je meerdere "gedragingen" wil samenvoegen

Vuistregel: abstracte klasse = gedeelde basis; interface = gedeeld contract.`,
        code: `// Abstract: gedeelde basis voor gerelateerde klassen
abstract class Medewerker
{
    public string Naam { get; set; }
    public abstract double BerekenLoon();
}

// Interfaces: contracten voor gedragingen
interface IExporteerbaar { string NaarCsv(); }
interface IPrintbaar     { void Print(); }

class Manager : Medewerker, IExporteerbaar, IPrintbaar
{
    public double Bonus { get; set; }
    public override double BerekenLoon() => 4000 + Bonus;
    public string NaarCsv() => $"{Naam},{BerekenLoon()}";
    public void Print() => Console.WriteLine($"[Manager] {Naam}");
}`
      }
    ],
    quiz: [
      {
        type: "mc", xp: 20,
        q: "Wat is het verschil tussen een abstracte klasse en een interface?",
        options: [
          "Een interface kan implementaties bevatten; een abstracte klasse niet",
          "Een abstracte klasse kan gedeelde code + fields hebben; een interface is enkel een contract",
          "Er is geen praktisch verschil",
          "Een klasse kan slechts één interface implementeren maar van meerdere abstracte klassen erven"
        ],
        answer: 1
      },
      {
        type: "fill", xp: 25,
        q: "Een klasse Auto die de interface IVoertuig implementeert: `class Auto ___ IVoertuig { ... }`",
        prefix: "class Auto ", suffix: " IVoertuig",
        answer: [":"]
      },
      {
        type: "mc", xp: 20,
        q: "Wat gebeurt er als je een object probeert aan te maken van een abstracte klasse?",
        options: [
          "Het object wordt aangemaakt maar alle abstracte methodes geven null terug",
          "Er treedt een runtime-fout op",
          "De compiler geeft een fout — het is niet toegestaan",
          "Het object wordt aangemaakt als instantie van de eerste subklasse"
        ],
        answer: 2
      },
      {
        type: "fill", xp: 25,
        q: "In UML wordt een interface aangeduid met het stereotype: `<<___>>`",
        prefix: "<<", suffix: ">>",
        answer: ["interface"]
      }
    ],
    exercises: [
      {
        title: "Oefening 1 — Abstracte Figuur klasse",
        description: "Maak een abstracte klasse Figuur met abstracte methodes Oppervlakte() en Omtrek(). Maak concrete subklassen Cirkel, Rechthoek en Driehoek. Gebruik polymorfisme om alle figuren te beschrijven.",
        hint: "abstract class Figuur { public abstract double Oppervlakte(); }",
        starter: `using System;

abstract class Figuur
{
    public string Kleur { get; set; }
    public Figuur(string kleur) { Kleur = kleur; }

    // TODO: abstracte methodes Oppervlakte() en Omtrek()

    public void Beschrijf()
        => Console.WriteLine($"{GetType().Name} ({Kleur}): " +
            $"opp={Oppervlakte():F2}, omtrek={Omtrek():F2}");
}

// TODO: class Cirkel : Figuur (straal)
// TODO: class Rechthoek : Figuur (breedte, hoogte)

class Program
{
    static void Main()
    {
        Figuur[] figuren = {
            new Cirkel(5, "Rood"),
            new Rechthoek(4, 6, "Blauw"),
        };
        foreach (var f in figuren) f.Beschrijf();
    }
}`
      },
      {
        title: "Oefening 2 — Interface IExporteerbaar",
        description: "Definieer de interface IExporteerbaar met methode string NaarCsv(). Laat Student, Product en Bestelling deze interface implementeren. Schrijf een methode die elk object naar CSV exporteert.",
        hint: "void ExportAlles(IExporteerbaar[] items) { foreach (var item in items) Console.WriteLine(item.NaarCsv()); }",
        starter: `using System;

interface IExporteerbaar
{
    // TODO: string NaarCsv();
}

class Student : IExporteerbaar
{
    public string Naam { get; set; }
    public int Punten { get; set; }
    public Student(string naam, int punten) { Naam = naam; Punten = punten; }
    // TODO: implementeer NaarCsv()
}

class Product : IExporteerbaar
{
    public string Naam { get; set; }
    public double Prijs { get; set; }
    public Product(string naam, double prijs) { Naam = naam; Prijs = prijs; }
    // TODO: implementeer NaarCsv()
}

class Program
{
    static void ExportAlles(IExporteerbaar[] items)
    {
        // TODO: exporteer elk item naar CSV
    }

    static void Main()
    {
        IExporteerbaar[] items = {
            new Student("Jan", 14),
            new Product("Laptop", 999.99),
            new Student("Lisa", 17)
        };
        ExportAlles(items);
    }
}`
      }
    ],
    deliverables: [
      { text: "Ontwerp een abstracte klasse Bankproduct (rekeningnummer, saldo, Storten(), abstract Opnemen()). Maak subklassen Spaarrekening en Zichtrekening met eigen opnamelogica. Teken het UML-diagram.", xp: 70 },
      { text: "Definieer een interface IRentedragend met BerekenRente(). Laat Spaarrekening deze interface implementeren.", xp: 30 }
    ]
  },

  // ─────────────────────────────────────────────────
  //  MODULE 6 — Static & Enums
  // ─────────────────────────────────────────────────
  {
    id: 6, title: "Static & Enums", subtitle: "Gedeelde leden en vaste waarden",
    emoji: "⚙️", color: "#1f416b", weeks: "Week 6–7",
    tagline: "static members, utility klassen en type-veilige constanten",
    theory: [
      {
        title: "Static members",
        icon: "🔗",
        content: `Een static member (field, property of methode) behoort tot de KLASSE — niet tot een specifiek object.

• Gedeeld door alle instanties
• Bereikbaar zonder object aan te maken: KlasseNaam.Member
• In UML: onderstreept weergegeven

Voorbeelden uit .NET: Math.PI, Console.WriteLine(), DateTime.Now`,
        uml: `classDiagram
  class Teller {
    -int$aantalInstanties
    +Teller()
    +GetAantal()$ int
    +Reset()$ void
    +id int
  }`,
        code: `class Teller
{
    // Static field — gedeeld door alle Teller-objecten
    private static int _aantalInstanties = 0;

    // Instance field — uniek per object
    public int Id { get; private set; }

    public Teller()
    {
        _aantalInstanties++;
        Id = _aantalInstanties;
    }

    // Static methode — bereikbaar zonder object
    public static int GetAantal() => _aantalInstanties;
    public static void Reset() => _aantalInstanties = 0;
}

// Gebruik:
var t1 = new Teller();  // Id = 1
var t2 = new Teller();  // Id = 2
Console.WriteLine(Teller.GetAantal());  // 2 — statisch, via klassenaam`
      },
      {
        title: "Static klassen",
        icon: "🏛️",
        content: `Een static klasse kan NIET worden geïnstantieerd — alle leden zijn static. Ideaal voor utility-functies (helpers) en constanten.

Voorbeelden: Math, Console, Convert, string (deels).

Voordelen:
• Geen onnodige objecten aanmaken
• Duidelijk dat de klasse enkel functies biedt, geen state per instantie`,
        code: `static class WiskundeHelper
{
    public const double Goudverhouding = 1.61803398875;

    public static double KwadraatWortel(double n) => Math.Sqrt(n);

    public static bool IsPriemgetal(int n)
    {
        if (n < 2) return false;
        for (int i = 2; i <= Math.Sqrt(n); i++)
            if (n % i == 0) return false;
        return true;
    }

    public static int Faculteit(int n)
        => n <= 1 ? 1 : n * Faculteit(n - 1);
}

// Gebruik: rechtstreeks via klassenaam
Console.WriteLine(WiskundeHelper.IsPriemgetal(17));  // True
Console.WriteLine(WiskundeHelper.Faculteit(5));       // 120`
      },
      {
        title: "Enums",
        icon: "📋",
        content: `Een enum (enumeratie) is een type met een vaste set benoemde constanten. Enums maken code leesbaarder en voorkomen "magic numbers".

• Standaard gaat een enum van 0, 1, 2, ...
• Je kunt eigen waarden toewijzen
• In UML: «enumeration» stereotype

Gebruik enums wanneer een waarde slechts een beperkt aantal mogelijkheden heeft: dagen, kleuren, richtingen, statussen...`,
        uml: `classDiagram
  class Dag {
    <<enumeration>>
    Maandag
    Dinsdag
    Woensdag
    Donderdag
    Vrijdag
    Zaterdag
    Zondag
  }
  class Afspraak {
    +Dag dag
    +string beschrijving
    +IsWeekend() bool
  }`,
        code: `enum Dag { Maandag, Dinsdag, Woensdag, Donderdag, Vrijdag, Zaterdag, Zondag }

enum HttpStatus
{
    Ok = 200,
    NotFound = 404,
    ServerError = 500
}

class Afspraak
{
    public Dag Dag { get; set; }
    public string Beschrijving { get; set; }

    public bool IsWeekend()
        => Dag == Dag.Zaterdag || Dag == Dag.Zondag;

    public override string ToString()
        => $"{Dag}: {Beschrijving}" + (IsWeekend() ? " (weekend)" : "");
}

// Switch met enum
Dag vandaag = Dag.Vrijdag;
string bericht = vandaag switch
{
    Dag.Maandag => "Begin van de week",
    Dag.Vrijdag => "Bijna weekend!",
    Dag.Zaterdag or Dag.Zondag => "Weekend!",
    _ => "Gewone werkdag"
};`
      }
    ],
    quiz: [
      {
        type: "mc", xp: 20,
        q: "Wat is het kenmerk van een static methode?",
        options: [
          "Ze kan alleen aangeroepen worden vanuit subklassen",
          "Ze behoort tot de klasse, niet tot een instantie, en is bereikbaar via de klassenaam",
          "Ze kan niet met parameters werken",
          "Ze is automatisch abstract"
        ],
        answer: 1
      },
      {
        type: "fill", xp: 25,
        q: "Een enum dag aanmaken: `___ Dag { Maandag, Dinsdag, ... }`",
        prefix: "", suffix: " Dag { Maandag, ... }",
        answer: ["enum"]
      },
      {
        type: "mc", xp: 20,
        q: "Waarom gebruik je een static klasse?",
        options: [
          "Als je overerving nodig hebt",
          "Als alle methodes gedeeld zijn en je geen objecten wil aanmaken",
          "Als je polymorfisme wil gebruiken",
          "Als je een interface wil implementeren"
        ],
        answer: 1
      },
      {
        type: "fill", xp: 25,
        q: "De standaard beginwaarde van het eerste enum-lid is: ___",
        prefix: "Standaard beginwaarde: ", suffix: "",
        answer: ["0"]
      }
    ],
    exercises: [
      {
        title: "Oefening 1 — Static teller + utility",
        description: "Maak een klasse Student met een static teller voor het aantal aangemakte studenten. Maak ook een static klasse ValidatieHelper met methoden IsGeldigPunten(int) en IsGeldigeNaam(string).",
        hint: "Verhoog de static teller in de constructor van Student.",
        starter: `using System;

static class ValidatieHelper
{
    // TODO: IsGeldigPunten(int p) → true als 0 <= p <= 100
    // TODO: IsGeldigeNaam(string n) → true als niet leeg en >= 2 tekens
}

class Student
{
    // TODO: static teller
    public string Naam { get; set; }
    public int Punten { get; set; }

    public Student(string naam, int punten)
    {
        if (!ValidatieHelper.IsGeldigeNaam(naam))
            throw new ArgumentException("Ongeldige naam");
        if (!ValidatieHelper.IsGeldigPunten(punten))
            throw new ArgumentException("Ongeldige punten");
        Naam = naam;
        Punten = punten;
        // TODO: verhoog teller
    }

    // TODO: static methode AantalStudenten()
}

class Program
{
    static void Main()
    {
        var s1 = new Student("Jan", 14);
        var s2 = new Student("Lisa", 18);
        Console.WriteLine($"Aantal studenten: {Student.AantalStudenten()}");
    }
}`
      },
      {
        title: "Oefening 2 — Enum Seizoen & weer",
        description: "Definieer een enum Seizoen en een klasse Weerbericht met een property Seizoen. Voeg een methode Advies() toe die op basis van het seizoen een kledingadvies geeft.",
        hint: "Gebruik een switch-expressie op het enum-lid.",
        starter: `using System;

// TODO: enum Seizoen { Lente, Zomer, Herfst, Winter }

class Weerbericht
{
    public string Stad { get; set; }
    public double TemperatuurCelsius { get; set; }
    // TODO: property Seizoen (van type Seizoen)

    public Weerbericht(string stad, double temp, Seizoen seizoen)
    {
        Stad = stad;
        TemperatuurCelsius = temp;
        Seizoen = seizoen;
    }

    public string Advies()
    {
        // TODO: switch op Seizoen
        // Lente  → "Neem een regenjas mee"
        // Zomer  → "Zonnebril en zonnescherm!"
        // Herfst → "Warme jas aanraden"
        // Winter → "Muts, sjaal en handschoenen"
        return "";
    }

    public override string ToString()
        => $"{Stad} ({Seizoen}): {TemperatuurCelsius}°C — {Advies()}";
}

class Program
{
    static void Main()
    {
        var w1 = new Weerbericht("Brussel", 22, Seizoen.Zomer);
        var w2 = new Weerbericht("Gent", 5, Seizoen.Winter);
        Console.WriteLine(w1);
        Console.WriteLine(w2);
    }
}`
      }
    ],
    deliverables: [
      { text: "Maak een enum OrderStatus (Nieuw, Verwerkt, Verzonden, Geleverd, Geannuleerd) en een klasse Bestelling die de status bijhoudt. Teken UML met enum-notatie.", xp: 50 },
      { text: "Maak een static klasse DiscountHelper met methodes BerekenKorting(OrderStatus, double) en GeefStatusBericht(OrderStatus).", xp: 40 }
    ]
  },

  // ─────────────────────────────────────────────────
  //  MODULE 7 — Exceptions & Samenstelling
  // ─────────────────────────────────────────────────
  {
    id: 7, title: "Exceptions & Samenstelling", subtitle: "Foutafhandeling en relaties tussen klassen",
    emoji: "🚨", color: "#dc2626", weeks: "Week 7–8",
    tagline: "try-catch-finally, custom exceptions en compositie vs. aggregatie",
    theory: [
      {
        title: "Exceptions — try, catch, finally",
        icon: "⚠️",
        content: `Een exception is een object dat een fout signaleert. In plaats van crashes gebruik je try-catch om fouten op te vangen en te behandelen.

• try     → code die een fout KAN gooien
• catch   → vangt de fout op, verwerkt ze
• finally → wordt ALTIJD uitgevoerd (ook bij fout), ideaal voor opruimen
• throw   → gooit zelf een exception

Volgorde catch-blokken: specifiekste exception EERST.`,
        uml: `classDiagram
  Exception <|-- SystemException
  Exception <|-- ApplicationException
  ApplicationException <|-- BankException
  class BankException {
    +string Boodschap
    +double Bedrag
    +BankException(msg, bedrag)
  }`,
        code: `try
{
    BankRekening r = new BankRekening("BE99", 500);
    r.Opnemen(600);   // gooit exception
    Console.WriteLine("Dit wordt niet uitgevoerd");
}
catch (BankException ex)        // specifieke exception eerst
{
    Console.WriteLine($"Bankfout: {ex.Message}");
}
catch (ArgumentException ex)
{
    Console.WriteLine($"Ongeldig argument: {ex.Message}");
}
catch (Exception ex)            // catch-all altijd als laatste
{
    Console.WriteLine($"Onverwachte fout: {ex.Message}");
}
finally
{
    // Wordt ALTIJD uitgevoerd — gebruik voor opruimen
    Console.WriteLine("Transactie afgerond (fout of niet).");
}`
      },
      {
        title: "Custom exceptions & throw",
        icon: "🎯",
        content: `Je maakt eigen exception-klassen door te erven van Exception (of ApplicationException).

throw new MijnException("boodschap");
throw;   ← hergooi (behoudt stack trace)

Custom exceptions zijn nuttig om domeinspecifieke fouten te communiceren met duidelijke types en extra informatie.`,
        code: `// Custom exception
class OnvoldoendeSaldoException : Exception
{
    public double Bedrag { get; }

    public OnvoldoendeSaldoException(double bedrag)
        : base($"Onvoldoende saldo voor opname van {bedrag:C}")
    {
        Bedrag = bedrag;
    }
}

class BankRekening
{
    private double _saldo;
    public BankRekening(double beginsaldo) { _saldo = beginsaldo; }

    public void Opnemen(double bedrag)
    {
        if (bedrag <= 0)
            throw new ArgumentException("Bedrag moet positief zijn", nameof(bedrag));
        if (bedrag > _saldo)
            throw new OnvoldoendeSaldoException(bedrag);   // gooit custom exception

        _saldo -= bedrag;
        Console.WriteLine($"Opname {bedrag:C} OK. Nieuw saldo: {_saldo:C}");
    }
}`
      },
      {
        title: "Compositie & Aggregatie",
        icon: "🧱",
        content: `Naast overerving zijn er nog andere relaties tussen klassen:

• Associatie  ────→   "gebruikt"  — losse koppeling
• Aggregatie  ◇───→   "heeft een" — onderdeel kan zelfstandig bestaan
• Compositie  ◆───→   "bestaat uit" — onderdeel kan NIET zelfstandig bestaan

Compositie = sterkste binding: als het geheel verdwijnt, verdwijnen de delen mee.
Aggregatie = zwakkere binding: delen kunnen blijven bestaan.

In UML: ◆ (gevuld) voor compositie, ◇ (leeg) voor aggregatie.`,
        uml: `classDiagram
  class Adres {
    +Straat string
    +Gemeente string
  }
  class Motor {
    +Vermogen int
    +Starten() void
  }
  class Persoon {
    +Naam string
    +Adres adres
  }
  class Auto {
    +Merk string
    +Motor motor
  }
  Persoon *-- Adres : compositie
  Auto *-- Motor : compositie`,
        code: `// Compositie: Adres bestaat alleen binnen Persoon
class Adres
{
    public string Straat { get; set; }
    public string Gemeente { get; set; }
    public string Postcode { get; set; }

    public override string ToString()
        => $"{Straat}, {Postcode} {Gemeente}";
}

class Persoon
{
    public string Naam { get; set; }
    public Adres Adres { get; set; }   // compositie: Adres is deel van Persoon

    public Persoon(string naam, string straat, string postcode, string gemeente)
    {
        Naam = naam;
        Adres = new Adres             // Adres aangemaakt BINNEN Persoon → compositie
        {
            Straat = straat,
            Postcode = postcode,
            Gemeente = gemeente
        };
    }

    public override string ToString() => $"{Naam} woont op {Adres}";
}`
      }
    ],
    quiz: [
      {
        type: "mc", xp: 20,
        q: "Welk blok wordt altijd uitgevoerd, ook als er een exception optreedt?",
        options: ["try", "catch", "finally", "throw"],
        answer: 2
      },
      {
        type: "fill", xp: 25,
        q: "Om een eigen exception-klasse te maken: `class MijnException : ___`",
        prefix: "class MijnException : ", suffix: "",
        answer: ["Exception", "ApplicationException"]
      },
      {
        type: "mc", xp: 20,
        q: "Wat is het verschil tussen compositie en aggregatie?",
        options: [
          "Er is geen verschil",
          "Bij compositie kan het deel NIET zelfstandig bestaan; bij aggregatie wel",
          "Bij aggregatie kan het deel NIET zelfstandig bestaan; bij compositie wel",
          "Compositie is alleen voor statische klassen"
        ],
        answer: 1
      },
      {
        type: "fill", xp: 25,
        q: "De volgorde in een catch-blok: gooi ___ exceptions EERST.",
        prefix: "Vang de ", suffix: "ste exceptions het eerst op",
        answer: ["specifiek", "meest specifieke", "specifieks"]
      }
    ],
    exercises: [
      {
        title: "Oefening 1 — BankRekening met exceptions",
        description: "Breid de BankRekening klasse uit met custom exception OnvoldoendeSaldoException en NegatiefBedragException. Vang ze op in Main() met aparte catch-blokken en een finally.",
        hint: "Maak twee aparte exception-klassen die elk van Exception erven.",
        starter: `using System;

class NegatiefBedragException : Exception
{
    public NegatiefBedragException(double bedrag)
        : base($"Bedrag {bedrag} moet positief zijn.") { }
}

// TODO: class OnvoldoendeSaldoException : Exception

class BankRekening
{
    private double _saldo;
    public string Iban { get; }

    public BankRekening(string iban, double saldo)
    {
        Iban = iban;
        _saldo = saldo;
    }

    public void Opnemen(double bedrag)
    {
        // TODO: gooi NegatiefBedragException als bedrag <= 0
        // TODO: gooi OnvoldoendeSaldoException als bedrag > saldo
        _saldo -= bedrag;
        Console.WriteLine($"Opname {bedrag:C} geslaagd. Saldo: {_saldo:C}");
    }
}

class Program
{
    static void Main()
    {
        var r = new BankRekening("BE99", 500);
        double[] bedragen = { 200, -50, 400 };

        foreach (var b in bedragen)
        {
            try
            {
                r.Opnemen(b);
            }
            // TODO: vang NegatiefBedragException op
            // TODO: vang OnvoldoendeSaldoException op
            finally
            {
                Console.WriteLine("--- transactie poging afgerond ---");
            }
        }
    }
}`
      },
      {
        title: "Oefening 2 — Compositie: Order & Orderregels",
        description: "Maak een klasse Orderregel (product, prijs, aantal) en Order (lijst van orderregels). Order bevat OrderRegels via compositie. Voeg methodes toe voor totaalprijs en het toevoegen van regels.",
        hint: "Gebruik List<Orderregel> als privaat field in Order. Maak new Orderregel(...) aan BINNEN Order.VoegToe().",
        starter: `using System;
using System.Collections.Generic;

class Orderregel
{
    public string Product { get; set; }
    public double Prijs { get; set; }
    public int Aantal { get; set; }

    public Orderregel(string product, double prijs, int aantal)
    {
        Product = product; Prijs = prijs; Aantal = aantal;
    }

    public double Subtotaal => Prijs * Aantal;

    public override string ToString()
        => $"{Product} x{Aantal} = {Subtotaal:C}";
}

class Order
{
    // TODO: private List<Orderregel> _regels = new();
    public string Klant { get; set; }

    public Order(string klant) { Klant = klant; }

    // TODO: void VoegToe(string product, double prijs, int aantal)
    // TODO: double Totaal()
    // TODO: void PrintOrder()
}

class Program
{
    static void Main()
    {
        var o = new Order("Jan Janssen");
        o.VoegToe("Laptop", 999.99, 1);
        o.VoegToe("Muis", 29.99, 2);
        o.VoegToe("Toetsenbord", 79.99, 1);
        o.PrintOrder();
    }
}`
      }
    ],
    deliverables: [
      { text: "Maak een klasse Universiteit met een lijst van Faculteit-objecten (compositie). Elke Faculteit heeft een lijst van Studenten. Teken het volledige UML-diagram met compositiepijlen en multipliciteiten (1, 1..*, *).", xp: 70 },
      { text: "Voeg exception-handling toe aan de Student-inschrijvingslogica: gooi een VolzetteFaculteitException als een faculteit meer dan 30 studenten heeft.", xp: 40 }
    ]
  }
];
