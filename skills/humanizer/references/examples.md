<!-- markdownlint-disable MD013 MD024 -->

# Humanization examples

Use these examples when concrete contrasts would calibrate an edit better than
instructions alone. They follow the sequence in
[humanizing-text.md](humanizing-text.md).

## Contents

- [Protect meaning and voice](#protect-meaning-and-voice)
- [Ground claims in content](#ground-claims-in-content)
- [Rebuild sentences and paragraphs](#rebuild-sentences-and-paragraphs)
- [Select and order detail](#select-and-order-detail)
- [Handle narrative and dialogue](#handle-narrative-and-dialogue)
- [Adapt to context and tone](#adapt-to-context-and-tone)
- [Remove delivery residue](#remove-delivery-residue)
- [Complete task examples](#complete-task-examples)

## Protect meaning and voice

### Keep the writer's rough edge

**Before:**

> Frankly, the whole rollout was a disaster from start to finish, and the communication around it only made things worse in ways that were deeply frustrating and ultimately avoidable.

**After:**

> Frankly, the rollout was a mess, and the communication around it made everything worse.

Keep the bluntness. Remove only the padding.

### Keep technical precision

**Before:**

> The scheduler exhibits a number of performance bottlenecks that significantly degrade throughput under bursty workloads.

**After:**

> The scheduler slows down under bursty workloads because queue scans get expensive at higher concurrency.

Preserve the mechanism. Do not replace it with a vague claim that performance
“improves.”

### Keep warmth without ceremony

**Before:**

> I am deeply grateful for the incredible support and encouragement I received throughout this meaningful journey.

**After:**

> I'm grateful for the support people gave me while I was figuring this out.

Keep the gratitude. Drop the imported grandeur.

### Preserve honest uncertainty

**Before:**

> It could potentially possibly be argued that the policy might have some effect on demand.

**After:**

> The policy may reduce demand, but the available data does not show by how much.

Keep the limit that evidence requires, not every hedge the sentence accumulated.

## Ground claims in content

### Inflated significance

**Before:**

> The redesign marked a pivotal moment in the evolution of the brand, underscoring the company's commitment to innovation and setting the stage for a bold new chapter.

**After:**

> The redesign updated the logo, typography, and packaging to match the company's newer product line.

### Promotional language

**Before:**

> Nestled in the heart of Sofia, the cafe offers a vibrant atmosphere, stunning interiors, and an unforgettable culinary experience.

**After:**

> The cafe is in central Sofia and is known for its late hours and house-made pastries.

### Abstract impact

**Before:**

> The initiative strengthened community resilience and created a renewed sense of hope.

**After:**

> The grant paid for two generators. During the next outage, residents kept the lift and hallway lights running.

### Superficial analysis

**Before:**

> The dashboard improves decision-making by surfacing key metrics, enabling faster responses, and driving better collaboration across teams.

**After:**

> The dashboard puts revenue, churn, and support backlog on one screen, so the team can spot problems earlier.

### Vague attribution

**Before:**

> Experts believe the policy could play a crucial role in shaping the future of the industry.

**After:**

> A 2025 trade-association briefing said the policy would likely raise compliance costs for smaller firms.

### Notability roll call

**Before:**

> Her views have been cited in The New York Times, BBC, Financial Times, and The Hindu. She has more than 500,000 followers.

**After:**

> In a 2024 New York Times interview, she argued that AI regulation should focus on outcomes rather than methods.

### Corporate abstraction

**Before:**

> The platform showcases a robust set of features that enhance collaboration and align with modern productivity needs.

**After:**

> The platform adds shared drafts, comments, and version history.

### Unsupported sales claim

**Before:**

> Our cutting-edge solution empowers teams to unlock new levels of productivity and transform their workflows.

**After:**

> Our software cuts the manual part of weekly reporting from about three hours to thirty minutes.

Use the quantified claim only when the source supports it.

### Evidence stronger than the claim

**Before:**

> These experiments prove that the method is universally more robust than existing approaches.

**After:**

> On the three test datasets, the method lost two accuracy points under distribution shift; the strongest baseline lost eleven.

Match the claim to the tested scope. Do not turn one comparison into a universal
conclusion.

### Speculation filling an information gap

**Before:**

> Little is known about her early life, suggesting that she values privacy and likely grew up in a close-knit household.

**After:**

> The available sources do not document her early life.

Omit the sentence when the gap itself is not relevant.

## Rebuild sentences and paragraphs

### Plain verb

**Before:**

> The report serves as a comprehensive overview of quarterly performance.

**After:**

> The report summarizes quarterly performance.

### Direct claim instead of rhetorical correction

**Before:**

> This isn't just a bug fix. It's a statement about our commitment to quality.

**After:**

> This fix closes a bug that had been breaking exports for enterprise customers.

### One earned point instead of a triad

**Before:**

> The workshop delivered clarity, confidence, and momentum for the entire team.

**After:**

> The workshop gave the team a decision and an owner.

### Stable terminology

**Before:**

> The app stores the token. The platform then refreshes the credential.

**After:**

> The app stores the token, then refreshes it.

### Action before framing

**Before:**

> Having reviewed the customer feedback, the team recognized the need for a simpler checkout experience.

**After:**

> Customer feedback pointed to the checkout form. The team cut it from nine fields to five.

### Qualification with useful detail

**Before:**

> The migration went smoothly, for the most part.

**After:**

> The migration finished on time, with two six-minute outages during the database cutover.

### Paragraph without school-essay scaffolding

**Before:**

> Communication was a major challenge during the rollout. Teams used several different tools. Important updates were often missed. This showed the need for better coordination.

**After:**

> Support tracked the rollout in Slack. Engineering used Jira. Neither team saw the other's updates until Friday's review.

### Heading without restatement

**Before:**

> ## Performance
>
> Speed matters.
>
> When users hit a slow page, they leave.

**After:**

> ## Performance
>
> When users hit a slow page, they leave.

### Manufactured punchlines

**Before:**

> Then the new model arrived. No assumptions. No nostalgia. No compromise. The old rules were gone.

**After:**

> The new model did not favor the assumptions built into the earlier search, so several of the old rules stopped helping.

### Aphorism instead of a claim

**Before:**

> Symmetry is the language of trust, and efficiency becomes a trap when teams forget the human layer.

**After:**

> Symmetric layouts often feel more predictable. Teams can still optimize a workflow past the point where people find it usable.

### Fake-candid opener

**Before:**

> Is it worth the price? Honestly? It depends on how often you'll use it.

**After:**

> Whether it is worth the price depends on how often you'll use it.

## Select and order detail

### Flat list

**Before:**

> The office was filled with broken chairs, old monitors, tangled cables, dusty boxes, abandoned notebooks, and flickering lights.

**After:**

> One monitor still showed the login screen. Its keyboard was gone.

### Pseudo-inventory

**Before:**

> The workshop contained drills, saws, clamps, hammers, files, workbenches, spare wood, metal scraps, and safety equipment.

**After:**

> The table saw's guard was missing. A handwritten sign told staff to ask Luis before switching it on.

### Category drift

**Before:**

> The outage caused failed payments, angry customers, confusion, support tickets, and lasting damage to trust.

**After:**

> Payments failed for 47 minutes. Support received 312 tickets before the status page acknowledged the outage.

### Causal order

**Before:**

> The launch failed because of poor planning, unclear ownership, technical debt, late approvals, weak communication, and changing requirements.

**After:**

> Legal approved the copy two days late. That pushed the build into the migration window, where an old checkout dependency failed. No team owned the rollback.

### Procedure as sequence

**Before:**

> To publish the release, update the version, run the tests, build the package, check the output, create the tag, push the branch, and draft the announcement.

**After:**

> 1. Update the version and run the tests.
> 2. Build the package and inspect its contents.
> 3. Commit the release, create the tag, and push both.
> 4. Publish the announcement after the package is available.

### Honest scope

**Before:**

> This guide covers every aspect of effective product management, including strategy, research, planning, execution, collaboration, communication, analytics, and more.

**After:**

> This guide covers interview planning, roadmap tradeoffs, and weekly product reviews.

## Handle narrative and dialogue

### Emotion through attention and action

**Before:**

> A wave of anxiety washed over Daniel when he saw the email.

**After:**

> Daniel read the subject line twice, then locked his phone without opening the email.

### Motivation without explanation

**Before:**

> She accepted the assignment because she wanted to prove that she was capable and overcome the insecurity she had carried since the failed launch.

**After:**

> She accepted before her manager finished the question. The failed launch was still pinned above her desk.

### Shared backstory kept out of dialogue

**Before:**

> "As you know, we lost the Northwind account last year after the billing migration failed," Priya said.

**After:**

> Priya tapped the Northwind row. "We're not losing them twice."

### Atmosphere anchored to a body

**Before:**

> A cold wind swept through the dark and silent street as night began to fall.

**After:**

> Wind pushed grit under Sam's glasses as he crossed the empty street.

### Consequence instead of sentimental closure

**Before:**

> Despite the difficult quarter, the team gathered around the table with renewed hope, knowing they would face the future together.

**After:**

> The meeting ended at six. Mina stayed behind to recalculate the runway.

## Adapt to context and tone

### LinkedIn post

**Before:**

> I'm thrilled to share an exciting milestone in my professional journey. This experience deepened my passion for innovation, leadership, and cross-functional collaboration.

**After:**

> Wrapped a six-month product launch this week. The work was messy, slower than planned, and worth it. Alignment mattered less in the kickoff than it did in week nine, when everyone was tired and the tradeoffs were real.

### Founder update

**Before:**

> Q1 was a transformative quarter that highlighted the resilience of our team and the strength of our long-term vision.

**After:**

> Q1 was rough in places, but useful. We missed our onboarding target, fixed the pricing page, and now have a clearer picture of who converts and who doesn't.

### Technical documentation

**Before:**

> This endpoint facilitates seamless data retrieval while providing a robust and scalable mechanism for external integrations.

**After:**

> Use this endpoint to fetch account data for external integrations.

### Internal memo

**Before:**

> In light of recent developments, it is important to note that several operational challenges have emerged that may potentially impact efficiency.

**After:**

> Three issues are slowing the team down: late approvals, unclear ownership, and duplicated reporting.

### Reflective

**Before:**

> The event generated meaningful dialogue around the future of education.

**After:**

> What stayed with me wasn't the policy language. It was how many teachers sounded exhausted, and how little of the debate seemed to account for that.

### Minimalist

**Before:**

> The team leveraged a variety of strategic initiatives to optimize delivery outcomes.

**After:**

> The team changed the plan and shipped sooner.

### Playful

**Before:**

> The interface update introduces a refreshed visual hierarchy and a more intuitive navigation system.

**After:**

> The new interface finally stopped hiding the useful buttons.

### Poetic

**Before:**

> The city changed rapidly as new buildings replaced older neighborhoods.

**After:**

> The city kept its street names but lost some of its memory. New towers rose where the older blocks used to hold the day in place.

Keep poetic language only when the brief and source voice support it.

## Remove delivery residue

### Assistant chatter

**Before:**

> Here is an overview of the French Revolution. I hope this helps! Let me know if you'd like me to expand on any section.

**After:**

> The French Revolution began in 1789, when financial crisis and food shortages led to widespread unrest.

### Placeholder instructions

**Before:**

> [Describe the section that needs editing and provide clear reasons, including reliable sources if applicable.]

**After:**

> The lead should use the revenue figure in the 2024 annual report. The current figure comes from the 2022 filing.

### Abrupt cutoff

**Before:**

> The rollout failed for three reasons. First, the approval chain was too long. Second, ownership was split between teams. Third,

**After:**

> The rollout failed because the approval chain was too long, ownership was split between teams, and the final scope never settled.

### Sudden voice shift

**Before:**

> we tried to get this out fast and honestly the process was kind of a mess. The implementation, however, constitutes a robust and strategically aligned modernization effort.

**After:**

> We tried to ship this fast, and the process was messy. The implementation still improves the workflow, but not every part of it was elegant.

### Decorative formatting

**Before:**

> 🚀 **Launch Phase:** The product launches in Q3
>
> 💡 **Key Insight:** Users prefer simplicity
>
> ✅ **Next Steps:** Schedule follow-up meeting

**After:**

> The product launches in Q3. User research showed a preference for simplicity. Next step: schedule a follow-up meeting.

### Diff-anchored documentation

**Before:**

> This function was added to replace the previous loop, which caused quadratic lookup time.

**After:**

> This function uses a hash map for constant-time lookups instead of scanning the collection for each item.

Describe the current behavior unless the document is specifically about the
migration or change history.

## Complete task examples

### Natural professional post

**Task:** Make this sound natural for LinkedIn. Keep it thoughtful, not corporate.

**Input:**

> I am excited to announce that I had the opportunity to participate in a transformative panel discussion on the evolving landscape of AI innovation, where we explored key trends, valuable insights, and exciting opportunities for cross-sector collaboration.

**Rewrite:**

> Spoke on an AI panel this week. The interesting part wasn't the usual “what's next” discussion. It was hearing how differently people in policy, product, and operations think about the same risks.

### Critique without rewrite

**Task:** Critique this for generated-sounding patterns only.

**Input:**

> The initiative stands as a testament to the organization's unwavering commitment to empowering communities and fostering sustainable impact.

**Diagnosis:**

- Significance and promotional language replace the actual result.
- Abstract nouns hide who acted and who benefited.

**Repair:** Say what the initiative did, who it helped, and what changed.

### Preserve an informal voice

**Task:** Make this less stiff but keep my voice.

**Input:**

> Look, I'm not saying the launch was perfect, but the amount of chaos people are pretending not to remember is honestly kind of funny at this point.

**Rewrite:**

> Look, the launch wasn't perfect, and at this point it's a little funny how quickly people forget how chaotic it was.

### Direct internal memo

**Task:** Rewrite this for an internal operations memo.

**Input:**

> In order to ensure alignment across all relevant stakeholders, it is important to note that delays may potentially arise due to dependencies associated with the current approval workflow.

**Rewrite:**

> Delays are likely because the current approval workflow has too many dependencies.

### Persuasive without hype

**Task:** Make this natural but still persuasive.

**Input:**

> Our revolutionary platform transforms the way modern teams collaborate, delivering game-changing efficiency gains at scale.

**Rewrite:**

> Our platform helps teams review work faster by keeping comments, approvals, and version history in one place.

The rewrite stays persuasive by naming the benefit instead of exaggerating it.
