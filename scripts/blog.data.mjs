// Source of truth for /blog/ posts. Each entry generates an EN page at
// blog/{slug}.html. If an es block exists, it also emits es/blog/{slug}.html.
// Body content is HTML inside the <article>. Keep it tight, opinionated, and
// non-generic — these posts target long-tail RevOps queries.

export const POSTS = [
  {
    slug: 'meddpicc-vs-meddic-forecast-accuracy',
    datePublished: '2026-05-12',
    keywords: 'MEDDPICC, MEDDIC, sales qualification framework, forecast accuracy, B2B SaaS sales, sales methodology',
    en: {
      title: 'MEDDPICC vs MEDDIC: which framework actually moves forecast accuracy',
      description: 'A direct comparison of MEDDPICC and MEDDIC from someone who has implemented both in B2B SaaS. The honest answer about which one lifts forecast accuracy — and why the framework matters less than the discipline behind it.',
      ogAlt: 'MEDDPICC vs MEDDIC — Jaime M. Mena',
      h1: 'MEDDPICC vs MEDDIC: which framework actually moves forecast accuracy',
      sub: 'May 12, 2026 · 8 min read · Sales Methodology',
      lead: 'I have rolled both out at different stages of the same company. The honest answer about which one lifts forecast accuracy is uncomfortable for the framework-vendor industry: <strong>it is not the framework. It is whether managers actually inspect what reps put in the fields.</strong> But there is still a real reason to pick one over the other, and most teams pick wrong.',
      body: `
        <h2>The framework taxonomy in 90 seconds</h2>

        <p>MEDDIC was first. Dick Dunkel invented it at PTC in the 1990s when enterprise software deals routinely slipped two quarters because nobody had bothered to confirm the buyer had budget or the authority to sign. The six letters force you to ask:</p>

        <ul>
          <li><strong>M</strong>etrics — what numerical outcome does the buyer want from this purchase?</li>
          <li><strong>E</strong>conomic Buyer — who personally signs the check?</li>
          <li><strong>D</strong>ecision Criteria — what specific things will they evaluate vendors on?</li>
          <li><strong>D</strong>ecision Process — what are the literal steps from now to signature?</li>
          <li><strong>I</strong>dentify Pain — what current state is unacceptable enough that they will spend money?</li>
          <li><strong>C</strong>hampion — who inside the account will sell on your behalf when you are not in the room?</li>
        </ul>

        <p>MEDDPICC came later. Same starting six, plus two more letters that fill real gaps the original ignored:</p>

        <ul>
          <li><strong>P</strong>aper Process — what does procurement, legal, and the contract review process look like? This is where late-stage deals die.</li>
          <li><strong>C</strong>ompetition — who else are they evaluating, including the do-nothing option?</li>
        </ul>

        <p>That is the entire difference. Eight letters versus six. Most reps cannot tell you which is which after sitting through enablement, and frankly, it does not matter.</p>

        <h2>What the data actually shows</h2>

        <p>The first time I rolled out MEDDPICC at a global SaaS company, forecast accuracy lifted roughly 18% over two quarters. The reflexive interpretation — and the one the methodology vendors prefer — is that adding Paper Process and Competition saved deals that would otherwise have slipped. That is partly true. But it is not the whole story.</p>

        <p>The honest story is this: before the rollout, we had a forecast call where reps said "this is going to close" and managers said "okay, commit." Nothing in the conversation tested the claim. After the rollout, we had a forecast call where reps could not say "this is going to close" without filling in eight fields, and managers had a structured way to push back when the fields were thin. The accuracy gain came from the <em>discipline of the inspection</em>, not the addition of two letters.</p>

        <p>You can prove this to yourself. Take a team that has been running MEDDIC for two years with manager inspection that actually grills the fields. Then take a team that just bolted MEDDPICC onto Salesforce with no manager process change. The first team will forecast better every single quarter. The methodology is a forcing function for the conversation. If the conversation is not happening, the methodology is a checkbox exercise.</p>

        <h2>So why not just always pick MEDDPICC?</h2>

        <p>You should — almost always. There are two scenarios where MEDDIC is the right answer:</p>

        <p><strong>1. Velocity-driven mid-market motions.</strong> If your average sales cycle is under 30 days and your ACV is under $50K, Paper Process is usually trivial (click-through MSAs, monthly billing, low procurement involvement). Adding the letter creates ceremony without insight. Competition is still worth tracking, but you can do that informally. Use MEDDIC.</p>

        <p><strong>2. The team has been on MEDDIC for years and adoption is finally clean.</strong> Switching frameworks resets adoption to zero. If MEDDIC compliance is at 80% and forecast accuracy is acceptable, do not introduce MEDDPICC as a project. Add Paper Process and Competition as separate Salesforce fields if you need them. Keep the framework name stable so the muscle memory holds.</p>

        <p>For everything else — enterprise sales, regulated industries, ACV above $100K, deal cycles over 60 days — MEDDPICC. The two extra letters add the most predictive signal exactly when you need it: late-stage deals where procurement is the slip risk, and competitive losses where reps would otherwise mark the deal Closed Lost without anyone digging into why.</p>

        <h2>The five things that actually move forecast accuracy</h2>

        <p>If you take nothing else from this post, take these. Every one of them is more important than which framework name you stenciled on the wall.</p>

        <p><strong>1. Required fields, not optional ones.</strong> Salesforce validation rules that block stage progression until the relevant MEDDPICC fields are populated. Reps will fight this. Hold the line. Half-filled qualification is worse than no qualification because it creates false confidence.</p>

        <p><strong>2. Manager inspection on a fixed cadence.</strong> Weekly pipeline review where the manager opens the deal record and reads the qualification fields out loud. If the Economic Buyer field says "Chief Procurement Officer" with no name, the manager flags it. If the Decision Process says "they will get back to us," the manager flags it. This is the entire intervention. The framework is the vocabulary. Inspection is the work.</p>

        <p><strong>3. A clear definition of "committed" backed by qualification depth.</strong> A deal cannot be Commit unless MEDDPICC compliance hits a defined threshold — for example, every letter has a non-trivial answer and Champion is named with first and last name. This makes Commit mean something. Forecast accuracy is mostly a function of what reps will allow themselves to call Commit, and a qualification floor anchors that.</p>

        <p><strong>4. Loss reasons that map to the framework.</strong> When deals close lost, the loss reason picklist should mirror the qualification letters: "No Economic Buyer," "No Compelling Event," "Lost to Competition (with named competitor)," "Paper Process Stalled." This makes post-mortem analysis useful and tells the next quarter's pipeline review where to look harder upstream.</p>

        <p><strong>5. The forecast call structure.</strong> Open with deals that are missing fields. Not deals that are biggest, not deals that are closing soonest — deals where qualification is thin. This single agenda choice changes the meeting from theater to operations.</p>

        <h2>When to skip both frameworks entirely</h2>

        <p>If you are a six-rep team selling a single SKU for under $20K ACV on a 14-day cycle, neither framework helps you. Your forecast accuracy problem is not qualification depth — it is volume variance. Focus on activity inputs and pipeline coverage ratios. Implement MEDDIC or MEDDPICC when your average deal touches more than three buyers, runs longer than 30 days, or has a contract that needs legal review. Below that bar, the ceremony costs more than it returns.</p>

        <h2>Implementation cheat sheet</h2>

        <p>If you are starting from zero on a B2B SaaS team with cycles over 30 days and ACVs over $50K, here is the order that works:</p>

        <ol>
          <li>Add the eight MEDDPICC fields to the Opportunity object in Salesforce or HubSpot.</li>
          <li>Make four of them required for movement past Stage 3 (Economic Buyer, Identified Pain, Champion, Decision Process). Add the rest as required at Stage 4.</li>
          <li>Build a Salesforce report or HubSpot dashboard that scores each deal by completeness — call it "MEDDPICC Health." Put it on the wall.</li>
          <li>Run a 30-minute pipeline review every Monday where the manager and rep go through the bottom five deals on the health score. Not the top five. The bottom five.</li>
          <li>Pair the rollout with a comp-plan kicker for full compliance on Closed Won deals. Small kicker, big behavioral signal — see the <a href="/case-studies/sales-commission-plan" class="inline-link">commission case study</a> for how that wires up.</li>
          <li>Six weeks in, audit a sample of deals where the rep said Commit. Compare to deals where the rep said Best Case. If qualification depth does not differ meaningfully, the framework has not landed yet. Reinforce.</li>
        </ol>

        <p>That is the playbook. The framework is the easy part. The reason most teams do not get the 18% accuracy lift is that they roll out the letters without rolling out the inspection. Pick MEDDPICC for almost every B2B SaaS team. Stand up the manager cadence. Hold the line on field completeness. The forecast follows.</p>
      `,
    },
  },

  {
    slug: 'salesforce-vs-hubspot-20-rep-team',
    datePublished: '2026-05-12',
    keywords: 'Salesforce vs HubSpot, B2B SaaS CRM, CRM for 20 reps, mid-market sales tech stack, HubSpot Sales Hub, Salesforce Sales Cloud',
    en: {
      title: 'Salesforce vs HubSpot for a 20-rep sales team: an honest comparison',
      description: 'A direct comparison of Salesforce and HubSpot for B2B SaaS teams at the 20-rep inflection point. Real trade-offs across time-to-value, customization, cost, and ecosystem — written from operator experience.',
      ogAlt: 'Salesforce vs HubSpot for 20 reps — Jaime M. Mena',
      h1: 'Salesforce vs HubSpot for a 20-rep sales team: an honest comparison',
      sub: 'May 12, 2026 · 9 min read · Tooling',
      lead: 'The 20-rep mark is the most common CRM crossroads in B2B SaaS. Below 10 reps, HubSpot wins by default — it is fast to stand up and the marketing alignment is free. Above 50 reps, Salesforce wins by default — you need the customization depth and the third-party ecosystem. The 20-rep mid-zone is where the decision genuinely tips on context. Here is how to read your own context honestly.',
      body: `
        <h2>The honest summary up front</h2>

        <p>If you want the answer without reading 1,800 more words: <strong>HubSpot</strong> is the right call for a 20-rep team that sells a single product with under $100K ACV, has Marketing and Sales sharing the same operations team, and does not have a regulated industry vertical pulling complexity into the deal. <strong>Salesforce</strong> is the right call for a 20-rep team with multi-product cross-sell, deal sizes routinely above $100K, deal structures that include ramps or multi-year discounting, or anything in healthcare, finance, or government. If you are in between, read on — the rest of this post is for you.</p>

        <h2>Time to value</h2>

        <p>HubSpot wins this comparison by a wide margin. A clean HubSpot Sales Hub instance can be productive in two weeks for a 20-rep team. The pipeline view is sensible by default. Email templates and sequences ship with the product. Reporting on conversion by stage, by rep, and by source is one click away.</p>

        <p>Salesforce is faster than its reputation suggests if you avoid the trap of trying to model your business perfectly on day one. A vanilla Sales Cloud setup with the standard Opportunity object, six default stages, and out-of-the-box reports can also be live in two to three weeks. The difference is what happens in month three. Salesforce starts asking you to make decisions — custom objects, page layouts per profile, validation rules, approval processes — and those decisions extend the implementation by months if you let them.</p>

        <p>Practical implication: if the company is funded for two more quarters of runway and needs revenue motion working <em>now</em>, HubSpot. If you have 12 months of runway and you are setting up a system that will run for three years, the Salesforce timeline cost is amortized.</p>

        <h2>Customization depth</h2>

        <p>This is where Salesforce earns its price tag. The number of ways you can extend Sales Cloud is genuinely uncountable. Custom objects with their own page layouts, validation rules, formula fields, flow builder, Apex code, managed packages from the AppExchange, and the underlying API model that any of those can hook into. There is essentially no business process complexity Salesforce cannot model.</p>

        <p>HubSpot has narrowed the gap meaningfully in the last three years. Custom objects exist. Workflows can do most of what Salesforce Flow can do. The reporting layer is better than it used to be. But there is still a depth ceiling. Once you need:</p>

        <ul>
          <li>Multi-currency with per-region pricing books</li>
          <li>Configure-Price-Quote with bundle logic and ramp pricing</li>
          <li>Territory management with hierarchical rollups</li>
          <li>Granular permission profiles where reps in Segment A cannot see Segment B's pipeline</li>
          <li>Approval processes that route through three layers based on discount percentage</li>
        </ul>

        <p>…you are in Salesforce territory. HubSpot can be made to do some of those, but with workarounds that future you will hate.</p>

        <h2>Cost at the 20-rep mark</h2>

        <p>Here are realistic numbers for a 20-rep team, as of mid-2026 (list pricing; assume 20% off after negotiation):</p>

        <p><strong>HubSpot Sales Hub Enterprise</strong>: roughly $150/user/month after negotiation. 20 users = $36,000/year. Add Marketing Hub Pro for marketing integration: another $800-1,200/month at scale, depending on contact volume.</p>

        <p><strong>Salesforce Sales Cloud Enterprise</strong>: roughly $135/user/month after negotiation. 20 users = $32,400/year. Add CPQ if you need it: another $75-110/user/month, so often a $20-25K incremental. Add a third-party tool for high-quality reporting (Sales Cloud's native reports are functional but limited): maybe $5-10K/year for Tableau CRM or similar.</p>

        <p>Sticker prices come out close. The total-cost-of-ownership gap shows up in implementation labor. A Salesforce implementation that touches CPQ, custom objects, and approval flows often runs $40-80K of admin/consultant time in year one. HubSpot is typically $5-15K of the same. By year three, the gap usually narrows or reverses if the team has been adding complexity to either system — but year one matters when the team is small.</p>

        <h2>Integration ecosystem</h2>

        <p>Salesforce has the AppExchange. There is almost no SaaS product worth integrating with that does not have a managed Salesforce package. Outreach, Gong, Clari, Chorus, Mutiny, Drift — all native, all maintained by the vendors, all stable. The integration risk on Salesforce is close to zero.</p>

        <p>HubSpot's marketplace is good. Most major sales tools have official HubSpot integrations. The risk is at the long tail: niche tools, regional payment providers, industry-specific data sources. Where Salesforce has a managed package, HubSpot often has either a third-party connector or a "build it yourself with the API" option. For a 20-rep team running a standard B2B SaaS playbook, this rarely bites. For a 20-rep team in a vertical with unusual data sources (claims systems, MLS feeds, EHR exports), HubSpot's coverage gaps cost real engineering hours.</p>

        <h2>The team-fit dimension nobody talks about</h2>

        <p>Tooling is also a hiring decision. Salesforce admins and developers are a deep, well-paid labor pool. If you scale the company and need a full-time SFDC admin in a year, you will find one. HubSpot admins exist but the pool is shallower, and many of them are former Salesforce admins who treat HubSpot as a temporary station. A senior Salesforce admin costs about $130K base; a senior HubSpot admin costs about $95K base — but you will hire faster in the Salesforce pool, and you will hire more reliably.</p>

        <p>Counterpoint: a 20-rep team usually does not need a full-time admin in year one. A 20-hour-per-week ops generalist works for either platform. By the time you need the full-time admin, you should already know whether the system is sticking.</p>

        <h2>What actually decides it</h2>

        <p>Set aside everything above for thirty seconds and ask three questions:</p>

        <p><strong>1. Where does Marketing live today?</strong> If Marketing is on HubSpot, putting Sales on Salesforce creates an integration tax that will eat a chunk of someone's quarter every quarter. Putting Sales on HubSpot eliminates the tax. The reverse is also true — if Marketing is on Marketo or Pardot, Salesforce becomes the gravitational center for both.</p>

        <p><strong>2. What is the deal shape?</strong> Single SKU at a fixed price = HubSpot is fine. Multi-product with ramp pricing, discount approvals, or multi-year contracts = Salesforce. The deal shape question dominates everything else in the comparison because it determines whether you can avoid CPQ and approval flows. If you can, life is simple on either platform.</p>

        <p><strong>3. Where do you want to be in three years?</strong> A 20-rep team that plans to be at 50 reps in three years should pick what the 50-rep version of the team needs. That is almost always Salesforce. A 20-rep team that plans to be at 20-30 reps in three years should pick what is fastest to run today. That is almost always HubSpot.</p>

        <h2>Migration cost reality</h2>

        <p>The argument "we will start on HubSpot and migrate to Salesforce later" works in theory and breaks in practice. A clean migration from HubSpot to Salesforce takes three to six months and costs $50-100K in time and tooling, not counting the productivity hit. It is doable, but it is rarely a small project. Pick the system you can live with for at least three years, not the system that lets you defer the decision.</p>

        <p>One narrow exception: if your team is under 10 reps today and you do not know what the company will look like at 20 reps, HubSpot is the right place to start because the migration cost is genuinely small at that scale. Move the decision point to 15 reps, when the deal shape and team-fit dimensions have sharpened.</p>

        <h2>The two-week diagnostic</h2>

        <p>If you are evaluating right now, do not start with vendor demos. Start with two weeks of internal work:</p>

        <ol>
          <li>Write down the deal taxonomy: every variation of how money changes hands in your current pipeline. Single product, multi-product, ramps, amendments, partial-period starts. The list should be exhaustive.</li>
          <li>For each variation, sketch the data model you would need to represent it cleanly. Custom objects? Currency? Pricing rules?</li>
          <li>Walk the last ten Closed Won deals through both HubSpot and Salesforce in a sandbox. Where does each system get awkward?</li>
          <li>Talk to two operators who have run the platform you are considering — one happy, one unhappy. Ask the unhappy one why.</li>
        </ol>

        <p>You will leave the two weeks with a clear answer, and you will not be talked into anything by a vendor demo. The CRM is a five-year decision. Spend two weeks getting it right.</p>
      `,
    },
  },

  {
    slug: 'cross-border-revops-playbook',
    datePublished: '2026-05-12',
    keywords: 'cross-border RevOps, US Mexico SaaS, USD MXN compensation, bilingual sales operations, near-shore RevOps, sales operations Mexico',
    en: {
      title: 'The cross-border RevOps playbook: USD revenue, MXN operations, one comp plan',
      description: 'A practical playbook for running Revenue Operations across the US-Mexico border: comp plans that handle USD and MXN, forecasting across time zones, Salesforce currency setup, and the common mistakes that cost teams real money.',
      ogAlt: 'Cross-border RevOps playbook — Jaime M. Mena',
      h1: 'The cross-border RevOps playbook: USD revenue, MXN operations, one comp plan',
      sub: 'May 12, 2026 · 8 min read · Bilingual GTM',
      lead: 'A growing number of B2B SaaS companies are US-incorporated, sell to US enterprise buyers in USD, and run sales operations or engineering out of Mexico. The setup makes financial sense — talent cost, time-zone overlap, USMCA legal clarity — but RevOps complexity sneaks up on teams that did not plan for it. This is the playbook I run when standing up the back office for one of these companies.',
      body: `
        <h2>The setup most teams end up with</h2>

        <p>The pattern is recognizable: a US Delaware C-corp, the US Inc. owns all customer contracts and books all revenue in USD, with a Mexican subsidiary (S.A. de C.V. or S. de R.L. de C.V.) that employs the engineering and sales operations teams. Customers are mostly US enterprise. The US entity charges the Mexican entity for services rendered under a transfer-pricing agreement. Reps and SDRs sometimes live in the US, sometimes in Mexico, sometimes both. Customer success is in Mexico City; the CRO is in Austin; the AEs are scattered.</p>

        <p>None of this is exotic anymore. What is still exotic is doing it well from a RevOps perspective. Most teams I see ship the org chart and let the operational complexity build up as technical debt. Two years in, the comp plan is a spreadsheet maintained by one person, the forecast misses by 15-20% every quarter because timezone gymnastics distort the pipeline review, and Salesforce has three different currency configurations layered on top of each other.</p>

        <h2>Comp plan: pay in local currency, target in revenue currency</h2>

        <p>This is the single highest-impact decision. Most teams get it wrong the first time.</p>

        <p><strong>The temptation:</strong> pay reps in MXN because they live in Mexico and need to pay rent in pesos. Tie quota and attainment to MXN booked revenue because the comp plan is denominated in MXN.</p>

        <p><strong>Why it fails:</strong> your revenue is in USD. The MXN/USD rate moves 8-15% in a typical year. If a rep books $1M USD of ARR and the rate moves from 17 to 19 MXN/USD over the quarter, their MXN-denominated quota gets easier or harder by 12% with no behavioral change on their part. Comp plans are supposed to drive behavior. FX volatility decouples behavior from outcome.</p>

        <p><strong>The fix:</strong> denominate the comp plan in USD. Set quota in USD. Calculate attainment in USD. Calculate the commission payout in USD. Then convert the payout to MXN at the end of each month, using a fixed published reference rate (Banxico FIX or the company's published month-end rate) plus a small buffer to absorb the timing risk between booking and payroll.</p>

        <p>The buffer is the part that matters. Pay the rep at, say, FIX minus 2%. The 2% is the company's hedge against the rate moving against them between when the deal closes and when payroll runs three weeks later. The rep gets a transparent, FX-volatility-free comp plan; the company holds a small predictable FX risk. Everyone can plan.</p>

        <p>Tax treatment is a separate question, and it is the one place where you must have a Mexican tax attorney in the loop. ISR (income tax) and IMSS (social security) apply to the MXN-equivalent payout. The 2% buffer can be partially offset by carefully structured "viáticos" and benefits packages, but that gets into territory beyond this post. Talk to a real attorney.</p>

        <h2>Forecasting across two time zones</h2>

        <p>The mistake here is to run the forecast call on US-East-Coast time and inherit the rest of the planet's problems. CST and CDT cover Mexico City; PST/PDT cover the West Coast; AEDT covers Australia if you sell there. By the time you reconcile what "last day of the quarter" means for a deal whose customer is in Sydney and whose AE is in Mexico City, you have created a 36-hour ambiguity window where deals slip in mysterious ways.</p>

        <p>Pick one canonical time zone for the entire revenue calendar — almost always UTC or the US East Coast equivalent — and run every cutoff against it. The last day of Q3 ends at 11:59 PM ET, period. Salesforce has a per-org timezone setting; align it. Every rep, regardless of where they sit, sees deal close dates and quarter cutoffs in the canonical zone. Avoid the trap of "well, my AE in Mexico City says it is still Tuesday her time" — that path leads to deals booking in the wrong quarter and reps gaming the calendar.</p>

        <p>The forecast meeting itself should be scheduled twice if you have meaningful headcount in both Pacific and Eastern: an 8:00 AM PT and a 10:00 AM ET option, both reviewing the same data. The CRO can pick which one to attend; managers run both with consistent agendas. This is more meeting load than running one canonical meeting, but it is the only way to keep AEs in Mexico City and Los Angeles equally engaged.</p>

        <h2>Salesforce: currency, locale, language</h2>

        <p>Three settings, three trap-doors.</p>

        <p><strong>Currency.</strong> Turn on Multi-Currency in Salesforce. Set the corporate currency to USD. Add MXN as a secondary currency with a rate that updates automatically (DatedExchangeRates with a daily refresh from a trusted FX feed, not the rep doing it manually). Every Opportunity has a CurrencyIsoCode field; reps should not change it, but admins need to know how to interpret it when a Latin American customer's contract is denominated in MXN.</p>

        <p><strong>Locale.</strong> Set every user's locale to match where they actually work, not where the company is headquartered. A user with English (United States) locale will see "5/12/2026" but a user with English (Mexico) locale will see "12/5/2026." This matters because reports default to user-locale formatting. A consolidated pipeline review that includes both locales reads inconsistently unless you normalize.</p>

        <p><strong>Language.</strong> Optional but worth it: enable Spanish as a UI language for users who want it. The data is the same; the labels translate. Users who want to operate in Spanish can; users who want English can. The flag is per-user and costs nothing.</p>

        <p>One detail nobody warns you about: the Currency field on Account, Contact, and Opportunity records can be confusing when AccountCurrency = MXN but the deal is in USD. Pick a convention and document it. Common one: Account currency matches the customer's billing entity currency; Opportunity currency matches the contract currency. Train reps on the distinction.</p>

        <h2>Commission calculation: do it in USD, pay in MXN</h2>

        <p>The commission calculator (see the <a href="/case-studies/sales-commission-plan" class="inline-link">commission case study</a> for the underlying model) should run in USD throughout. Compute quota attainment, accelerator tier, kickers, and gross commission all in USD. The last step is a single column conversion to MXN using the published rate.</p>

        <p>For reps' own self-verification: build the calculator so it shows both columns. Rep sees "$24,500 USD commission earned this period → ₱422,500 MXN gross." Transparency. The next person who tries to negotiate the conversion has already lost the argument.</p>

        <h2>Bilingual operations docs and enablement</h2>

        <p>If your Mexico-based ops team and your US-based commercial team need to share the same playbooks, you have two viable options:</p>

        <p><strong>Single English source.</strong> Everyone operates in English. This works for senior teams where English fluency is uniformly strong. Cost: less inclusive, particularly for junior CSMs and SDRs in the Mexico office.</p>

        <p><strong>Maintained bilingual docs.</strong> Every playbook, SOP, and enablement deck lives in both languages, with a documented owner who keeps them in sync. Cost: real maintenance overhead. You will need a freelance bilingual editor in the loop, and you must treat translation as a content version-control problem, not a one-time export.</p>

        <p>I have run both. The maintained-bilingual approach pays back when the team grows past about 30 people in the Mexico office, because the productivity drag of "wait, what does this English term mean exactly" compounds with headcount. Below 30, single-source English usually wins on simplicity.</p>

        <h2>The five mistakes I see most often</h2>

        <ol>
          <li><strong>Comp plan denominated in MXN.</strong> Already covered. FX volatility kills the behavioral signal of the plan.</li>
          <li><strong>Quarter cutoffs interpreted by rep's local time.</strong> A few wrongly-stamped deals per quarter cost real money once you are tracking attainment seriously.</li>
          <li><strong>Salesforce currency rates updated manually.</strong> Someone forgets; reporting drifts; one bad month nobody notices until the CFO's variance report calls it out.</li>
          <li><strong>Treating the Mexican subsidiary as "the back office" in vocabulary.</strong> Reps and CSMs in Mexico City are not back-office. They are commercial. Pipeline reviews and forecast calls should include them as peers; comp plans should match the US equivalents (in USD-denominated terms); enablement should be designed for both audiences. The org chart can subordinate the entity; the operating model should not subordinate the people.</li>
          <li><strong>No published policy on what currency the contract gets denominated in.</strong> Reps occasionally negotiate MXN-denominated contracts because the customer prefers it. This creates an FX risk the company holds for the contract term. There should be a written policy — usually USD-only — and any exception requires approval.</li>
        </ol>

        <h2>The half-day setup</h2>

        <p>If you inherit a US-MX RevOps setup that is already running but messy, here is the half-day audit to do first:</p>

        <ol>
          <li>Check Salesforce: is Multi-Currency on? Is corporate currency USD? Is the rate updating automatically? (15 min)</li>
          <li>Check the comp plan: is quota in USD or MXN? If MXN, calculate the FX-only attainment swing from the last year. Bring the number to the CFO. (45 min)</li>
          <li>Check the forecast call agenda: what time zone are quarter cutoffs in? Is it written down? (15 min)</li>
          <li>Check the playbooks: are they monolingual or bilingual? Is there an owner? (30 min)</li>
          <li>Check the org chart for the operational reality: are the Mexico-based commercial roles compensated and reviewed as peers to US-based equivalents? (45 min)</li>
          <li>Write up the gaps, prioritize the top three, present to the CRO and CFO. (90 min)</li>
        </ol>

        <p>This is the work I do in the first week of every cross-border engagement. The setup is more common every year and almost nobody has fully figured it out. Get the comp plan, time zones, and Salesforce currency right and you have eliminated the three failure modes that account for most of the operational drag. Everything else is execution.</p>
      `,
    },
    es: {
      title: 'El playbook de RevOps transfronterizo: ingresos en USD, operaciones en MXN, un solo plan de comisiones',
      description: 'Un playbook práctico para correr Revenue Operations a través de la frontera EE.UU.-México: planes de comisiones que manejan USD y MXN, pronósticos entre zonas horarias, configuración de monedas en Salesforce, y los errores comunes que cuestan dinero real.',
      ogAlt: 'Playbook de RevOps transfronterizo — Jaime M. Mena',
      h1: 'El playbook de RevOps transfronterizo: ingresos en USD, operaciones en MXN, un solo plan de comisiones',
      sub: '12 mayo 2026 · 8 min de lectura · GTM Bilingüe',
      lead: 'Cada vez más empresas B2B SaaS están incorporadas en EE.UU., venden a clientes enterprise estadounidenses en USD, y operan ventas o ingeniería desde México. El setup tiene sentido financiero — costo de talento, traslape horario, claridad legal del USMCA — pero la complejidad de RevOps se acumula en equipos que no la planearon. Este es el playbook que ejecuto cuando levanto el back office para una de estas empresas.',
      body: `
        <h2>El setup al que la mayoría de los equipos terminan llegando</h2>

        <p>El patrón es reconocible: una C-corp de Delaware en EE.UU., la Inc. estadounidense es dueña de todos los contratos con clientes y reconoce todos los ingresos en USD, con una subsidiaria mexicana (S.A. de C.V. o S. de R.L. de C.V.) que emplea al equipo de ingeniería y operaciones de ventas. Los clientes son mayoritariamente enterprise estadounidenses. La entidad estadounidense le cobra a la mexicana por servicios prestados bajo un acuerdo de precios de transferencia. Los representantes y SDRs a veces viven en EE.UU., a veces en México, a veces en ambos. Customer Success está en Ciudad de México; el CRO en Austin; los AEs dispersos.</p>

        <p>Nada de esto es exótico ya. Lo que sigue siendo exótico es hacerlo bien desde RevOps. La mayoría de los equipos que veo lanzan el organigrama y dejan que la complejidad operativa se acumule como deuda técnica. A dos años, el plan de comisiones es una hoja de cálculo mantenida por una sola persona, el pronóstico se falla 15-20% cada trimestre porque la gimnasia de zonas horarias distorsiona el pipeline review, y Salesforce tiene tres configuraciones de moneda apiladas una sobre otra.</p>

        <h2>Plan de comisiones: paga en moneda local, mide en moneda de ingresos</h2>

        <p>Esta es la decisión de mayor impacto. La mayoría de los equipos lo hacen mal la primera vez.</p>

        <p><strong>La tentación:</strong> pagar a los representantes en MXN porque viven en México y tienen que pagar renta en pesos. Atar la cuota y el attainment al ingreso reservado en MXN porque el plan de comisiones está denominado en MXN.</p>

        <p><strong>Por qué falla:</strong> tus ingresos están en USD. La tasa MXN/USD se mueve 8-15% en un año típico. Si un representante reserva $1M USD de ARR y la tasa se mueve de 17 a 19 MXN/USD durante el trimestre, su cuota denominada en MXN se vuelve más fácil o más difícil un 12% sin ningún cambio en su comportamiento. Los planes de comisiones supuestamente impulsan comportamiento. La volatilidad cambiaria desconecta el comportamiento del resultado.</p>

        <p><strong>La solución:</strong> denominar el plan de comisiones en USD. Cuota en USD. Attainment en USD. Pago de comisión en USD. Luego convertir el pago a MXN al final de cada mes, usando una tasa de referencia publicada y fija (FIX de Banxico o la tasa de fin de mes publicada por la empresa) más un pequeño colchón para absorber el riesgo de tiempo entre la reserva del deal y la nómina.</p>

        <p>El colchón es la parte que importa. Paga al representante a, digamos, FIX menos 2%. Ese 2% es la cobertura de la empresa contra la tasa moviéndose en su contra entre el cierre del deal y la nómina tres semanas después. El representante obtiene un plan de comisiones transparente y libre de volatilidad cambiaria; la empresa carga un pequeño riesgo cambiario predecible. Todos pueden planear.</p>

        <p>El tratamiento fiscal es una pregunta separada, y es el único lugar donde necesitas un abogado fiscalista mexicano. ISR e IMSS aplican sobre el monto equivalente en MXN. El colchón del 2% se puede compensar parcialmente con viáticos y prestaciones cuidadosamente estructurados, pero eso se sale del alcance de este post. Habla con un abogado de verdad.</p>

        <h2>Pronóstico entre dos zonas horarias</h2>

        <p>El error aquí es correr la forecast call en hora del Este de EE.UU. y heredar los problemas del resto del planeta. CST y CDT cubren la Ciudad de México; PST/PDT cubren la costa oeste; AEDT cubre Australia si vendes allá. Para cuando reconcilias qué significa "último día del trimestre" para un deal cuyo cliente está en Sídney y cuyo AE está en CDMX, has creado una ventana de ambigüedad de 36 horas donde los deals se mueven misteriosamente.</p>

        <p>Escoge una sola zona horaria canónica para todo el calendario de ingresos — casi siempre UTC o el equivalente del Este de EE.UU. — y corre todos los cortes contra ella. El último día del Q3 termina a las 11:59 PM ET, punto. Salesforce tiene un setting de zona horaria por organización; alinéalo. Cada representante, sin importar dónde viva, ve fechas de cierre y cortes de trimestre en la zona canónica. Evita la trampa de "pero mi AE en CDMX dice que todavía es martes en su hora" — ese camino termina con deals reservados en el trimestre equivocado y representantes haciendo trampa con el calendario.</p>

        <p>La forecast meeting en sí debería programarse dos veces si tienes headcount significativo en Pacífico y Este: una opción a las 8:00 AM PT y otra a las 10:00 AM ET, ambas revisando los mismos datos. El CRO puede elegir a cuál asistir; los managers corren ambas con agendas consistentes. Es más carga de juntas que correr una sola, pero es la única forma de mantener a los AEs de CDMX y Los Ángeles igualmente comprometidos.</p>

        <h2>Salesforce: moneda, locale, idioma</h2>

        <p>Tres ajustes, tres trampas.</p>

        <p><strong>Moneda.</strong> Activa Multi-Currency en Salesforce. Establece la moneda corporativa como USD. Agrega MXN como moneda secundaria con una tasa que se actualice automáticamente (DatedExchangeRates con refresh diario desde un feed FX confiable, no el representante haciéndolo manualmente). Cada Oportunidad tiene un campo CurrencyIsoCode; los representantes no deberían cambiarlo, pero los admins deben saber interpretarlo cuando el contrato de un cliente latinoamericano está denominado en MXN.</p>

        <p><strong>Locale.</strong> Configura el locale de cada usuario para que coincida con dónde trabaja en realidad, no con dónde está la sede. Un usuario con locale English (United States) verá "5/12/2026" pero un usuario con locale English (Mexico) verá "12/5/2026." Esto importa porque los reportes formatean por defecto con el locale del usuario. Un pipeline review consolidado que incluye ambos locales se lee inconsistente a menos que normalices.</p>

        <p><strong>Idioma.</strong> Opcional pero vale la pena: habilita español como idioma de UI para los usuarios que lo quieran. Los datos son los mismos; las etiquetas se traducen. Los usuarios que quieran operar en español pueden; los que quieran inglés también. El flag es por usuario y no cuesta nada.</p>

        <p>Un detalle del que nadie te advierte: el campo Currency en los registros de Account, Contact y Opportunity puede confundir cuando AccountCurrency = MXN pero el deal está en USD. Escoge una convención y documéntala. Una común: la moneda de la cuenta coincide con la de la entidad de facturación del cliente; la moneda de la Oportunidad coincide con la del contrato. Capacita a los representantes en la distinción.</p>

        <h2>Cálculo de comisiones: hazlo en USD, paga en MXN</h2>

        <p>La calculadora de comisiones (ver el <a href="/es/case-studies/sales-commission-plan" class="inline-link">caso de estudio del plan de comisiones</a> para el modelo subyacente) debe correr en USD todo el camino. Calcula attainment, tier de acelerador, kickers y comisión bruta todo en USD. El último paso es una sola columna de conversión a MXN usando la tasa publicada.</p>

        <p>Para la auto-verificación de los representantes: construye la calculadora para que muestre ambas columnas. El representante ve "$24,500 USD de comisión ganada este periodo → ₱422,500 MXN bruto." Transparencia. La siguiente persona que trate de negociar la conversión ya perdió el argumento.</p>

        <h2>Documentación operativa y enablement bilingüe</h2>

        <p>Si tu equipo de ops en México y tu equipo comercial en EE.UU. necesitan compartir los mismos playbooks, tienes dos opciones viables:</p>

        <p><strong>Una sola fuente en inglés.</strong> Todos operan en inglés. Funciona para equipos senior donde la fluidez en inglés es uniformemente fuerte. Costo: menos inclusivo, particularmente para CSMs y SDRs junior en la oficina de México.</p>

        <p><strong>Documentación bilingüe mantenida.</strong> Cada playbook, SOP y deck de enablement vive en ambos idiomas, con un dueño documentado que los mantiene sincronizados. Costo: overhead real de mantenimiento. Vas a necesitar un editor bilingüe freelance en el loop, y debes tratar la traducción como un problema de version control de contenido, no como un export único.</p>

        <p>He corrido ambos. El enfoque bilingüe mantenido paga de regreso cuando el equipo crece a más o menos 30 personas en la oficina de México, porque el drag de productividad de "espera, ¿qué significa este término en inglés exactamente?" se compone con el headcount. Debajo de 30, una sola fuente en inglés generalmente gana por simplicidad.</p>

        <h2>Los cinco errores que veo con más frecuencia</h2>

        <ol>
          <li><strong>Plan de comisiones denominado en MXN.</strong> Ya cubierto. La volatilidad cambiaria mata la señal conductual del plan.</li>
          <li><strong>Cortes de trimestre interpretados en hora local del representante.</strong> Unos pocos deals con timestamp equivocado por trimestre cuestan dinero real una vez que estás rastreando attainment en serio.</li>
          <li><strong>Tasas de cambio en Salesforce actualizadas manualmente.</strong> Alguien se olvida; los reportes se desfasan; un mal mes que nadie nota hasta que el reporte de varianza del CFO lo señala.</li>
          <li><strong>Tratar a la subsidiaria mexicana como "el back office" en el vocabulario.</strong> Los representantes y CSMs en CDMX no son back-office. Son comerciales. Las revisiones de pipeline y forecast calls deben incluirlos como pares; los planes de comisiones deben coincidir con los equivalentes en EE.UU. (en términos denominados en USD); el enablement debe diseñarse para ambas audiencias. El organigrama puede subordinar la entidad; el modelo operativo no debe subordinar a las personas.</li>
          <li><strong>Sin política publicada sobre en qué moneda se denomina el contrato.</strong> Los representantes ocasionalmente negocian contratos denominados en MXN porque el cliente lo prefiere. Esto crea un riesgo cambiario que la empresa carga durante todo el contrato. Debe haber una política escrita — usualmente solo USD — y cualquier excepción requiere aprobación.</li>
        </ol>

        <h2>La auditoría de medio día</h2>

        <p>Si heredas un setup de RevOps US-MX que ya está corriendo pero desordenado, esta es la auditoría de medio día para hacer primero:</p>

        <ol>
          <li>Revisa Salesforce: ¿Multi-Currency está activado? ¿La moneda corporativa es USD? ¿La tasa se actualiza automáticamente? (15 min)</li>
          <li>Revisa el plan de comisiones: ¿la cuota está en USD o MXN? Si está en MXN, calcula el swing de attainment solo por FX del último año. Llévale el número al CFO. (45 min)</li>
          <li>Revisa la agenda de la forecast call: ¿en qué zona horaria están los cortes de trimestre? ¿Está escrito? (15 min)</li>
          <li>Revisa los playbooks: ¿son monolingües o bilingües? ¿Hay un dueño? (30 min)</li>
          <li>Revisa el organigrama contra la realidad operativa: ¿los roles comerciales basados en México están compensados y revisados como pares de los equivalentes en EE.UU.? (45 min)</li>
          <li>Escribe los gaps, prioriza los tres más importantes, preséntale al CRO y al CFO. (90 min)</li>
        </ol>

        <p>Este es el trabajo que hago la primera semana de cada engagement transfronterizo. El setup es más común cada año y casi nadie lo tiene completamente resuelto. Configura bien el plan de comisiones, las zonas horarias y la moneda en Salesforce y habrás eliminado los tres modos de falla que generan la mayor parte del drag operativo. Todo lo demás es ejecución.</p>
      `,
    },
  },
];
