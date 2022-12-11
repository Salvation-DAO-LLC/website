import { Accordion, Box, Title, Text } from "@mantine/core"
import ReactMarkdown from "react-markdown"
import React, { useMemo } from "react"

interface FAQItem {
    title: string
    body: string
}

interface FAQSection {
    title: string
    items: FAQItem[]
}

export default function FAQ() {
    const faqBody: React.ReactNode | React.ReactNode[] = useMemo(() => {
        const sections: string[] | null = msg.split(/^(?=#+ )/m)
        if (!sections) return null

        const faqtree: FAQSection[] = []
        let faqitems: FAQSection | null = null
        let body = ""
        let i = 0
        for (let x = 0; x < sections.length; x++) {
            const section = sections[x]
            const rawlines = section.split(/\r?\n/)
            const lines: string[] = []

            if (rawlines[0].startsWith("## ")) {
                if (faqitems) {
                    faqtree.push(faqitems)
                }
                faqitems = { title: rawlines[0], items: [] }
                continue
            }

            rawlines.forEach((item) => {
                if (item.trim() !== "") {
                    lines.push(item.trim())
                }
            })

            if (!faqitems) throw new Error("no faq item")

            if (lines[0].startsWith("####")) {
                faqitems.items[faqitems.items.length - 1].body += "\n" + lines.join("\n")
                continue
            }
            faqitems.items.push({ title: lines[0], body: "" })

            if (lines.length > 1) {
                faqitems.items[faqitems.items.length - 1].body += lines.slice(1).join("\n").trim()
            }
        }
        if (faqitems) {
            faqtree.push(faqitems)
            faqitems = null
        }

        return faqtree.map((fq, i) => {
            const makeKey = (fi: FAQItem) =>
                fi.title
                    .replace(/[^\w\s]/g, "")
                    .replaceAll("#", "")
                    .toLowerCase()

            return (
                <Box key={`faq-section-${i}`}>
                    <ReactMarkdown>{fq.title}</ReactMarkdown>
                    <Accordion variant="filled" radius="md">
                        {fq.items.map((fi, i) => (
                            <Accordion.Item value={makeKey(fi)} key={`faq-item-${i}`}>
                                <Accordion.Control>
                                    <ReactMarkdown>{fi.title}</ReactMarkdown>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <ReactMarkdown>{fi.body}</ReactMarkdown>
                                </Accordion.Panel>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </Box>
            )
        })
    }, [])
    return <Box sx={{ maxWidth: "720px", img: { maxWidth: "100%" } }}>{faqBody}</Box>
}

const msg = `## General 

### What happens as soon as the first round succesfully closes?

As soon as the round closes we will start with the following preparations:
- Decouple Supremacy from XSYN platform - our in-house infrastructure provider
- Move Supremacy to run transactions completely on-chain
- Decommission XSYN
- Opensource Project transfer IP to Supremacy DAO
- Transfer of ownership of SUPS treasury to DAO

Once this stage is complete we can begin Project Resiliance
This will includes
- Player run Battle Arena Nodes
- Earn SUPS from the DAO by operating nodes
- Sell node specific mech passes
- Control SUPS payouts etc
- Run your own asset store
- List your own player created assets
- Earn a percentage from asset sales
- Nodes can create their own liquidity farms / staking pools

### Will Ninja Syndicate studio still contribute to game development once we form a DAO and how will this work?

Absolutely, for us to continue operations and be custodians of the game we will need to hit a monthly target which will cover the following months operations. 

## DAO Token

### What is the total supply cap of the DAO token?
The total Supply cap will be determined by the amount of tokens generated after the closure of each round. If the minimum monthly target is met for each month and no additional funds added for each round, there will be a total of 6,768,000 tokens in circulation after 12 months including the 20% reserved for the team. To put this in perspective, Star Atlas has a total fixed supply of 360,000,000 and illuvium has 10,000,000. 
 
In addition to this initial amount the DAO will be allowed to further mint a maximum of a further 10% of total tokens at end of round 12 to be distributed through in game mechanisms only. This will help ensure the individuals most emotionally invested in the game have an opportunity to have a say in the future.
 
 
### What will the DAO token do? 
The Supremacy DAO token’s leading utility is the expression of political rights inside the Supremacy franchise for the following game releases. Supremacy: Battle Arena, Supremacy: Human Resistance, Supremacy: Grand Strategy.

This means you will be responsible in deciding the future direction of the game. 

### Do DAO token holders benefit from future investment into the Ninja Syndicate the company that initially built Supremacy?

Short answe . A DAO token does not represent equity in the underlying company that is currently building the game. However any investment received by the company will mean we can continue to help build Supremacy, which the DAO will play a direct role in shaping. 

We want to reward our community and supporters which means we will always be thinking of ways to benefit the community where we are able to.

### What Happens to the Teams DAO Token Supply?
We will decide this at a later date but it is likely that it will be split between the individual team members, as we are all individuals with independnt ideas just like you. 

## The DAO

 
### If enough funds are raised early can the DAO choose to pause or stop future rounds to limit DAO token Supply? 
 
We don't see why not, although it is not possible until the governance framework is built for, but this is not something smart to implement at the beginning. The mission of this DAO is to ensure the game makes it through till it can sustain itself. Once all Rounds are closed, no more governance tokens will be released except through in game mechanisms.

 
### What kind of things can be governed by the DAO?
 
Any proposal can be put forward by DAO members but certain things are harder to implement than others and some are impossible for the time being. For example, it does not make sense to rely on governance approval when making small design changes to help balance gameplay but it does make sense to implement bigger picture proposals such as the starting price or total supply of new in game assets.

 
### What can't be governed by the DAO?
 
Anything that would impact the companies ability to continue operations in general, anything unrelated to Supremacy Game franchise and anything that everyone else in the DAO votes is just plain stupid.
 
### When will the DAO infrastructure be built so we can start submitting proposals?
 
Wen DAO? We will start working on this as soon as the first round closes and we can all breath a little. This will include either choosing a prebuilt DAO infrastructure provider or building it out ourselves. There are benefits and drawbacks to both so these decisions will be made under full consideration. This is not expected to be an overnight development.


### What even is a DAO?

DAO stands for Decentralized Autonomous Organisation and in this context is a form of organizational governance. A Organizational DAO relies on the protocol layer of the blockchain and uses smart contracts to generate a set of rules and objectives that can only be changed if consensus is formed by the DAO members based on a voting system. 

The most common mechanism for forming consensus in this context is through token voting mechanisms. The blockchain is therefore used as a tool to force adherence to a particular decision made that will impact the organizations operations. In most instances, once the rules are set by the DAO and have been deployed to a blockchain they cannot be changed or manipulated unless there are rules set that enable rules to be changed (if consensus is formed) in the original deployment of the code.

As you can imagine unless the DAO tokens are sufficiently decentralized, A system like this can be manipulated by parties who hold a large volume of tokens but do not have the projects best interests at heart. For this reason, most DAOS start with limited control and their are a variety of different forms of governance to try maintain democratic process. Some examples of this are:

Examples of DAO Governance solutions
There are many different examples of democratic voting systems with many being considered/updated due to the inherent issues when trying to scale such solutions in the decentralised environment.

####  Relative Majority
One Share = One Vote
One person = One Vote

#### Delegative Democracy
A collective decision making process made through direct participation or through delegation of votes to a representative

#### Quorum Voting
A a voting method where a certain threshold of voters is required for a proposal to pass. If the threshold is met, either decision may win. If the proposal does not reach quorum, then it is automatically rejected. This is the most common form of token voting governance but there are growing concerns around its scalability.

#### Conviction Voting
A decision-making process that selects for the aggregated preference of community members expressed continuously over time. Voters assert their preference by assigning their votes to proposals they would like to see approved. The longer a member stakes their votes on a proposal, the more conviction accrues. The community member can change which proposals their votes are staked on at any time, reflecting a change in total conviction. After enough conviction accrues, the proposal is passed.

#### Holographic Consensus
A voting mechanism created by DAOstack that combines futarchy, or prediction markets, with token-based quorum voting. In the Holographic Consensus model, predictors can stake funds for or against a proposal they believe will pass or fail, and if they predict correctly, they are entitled to a financial incentive. If a proposal is predicted to pass, it is “boosted”, meaning it can pass with a simple relative majority rather than requiring a quorum to be met.

#### Quadratic Voting

A decision-making process whereby individuals allocate votes to express the degree of their preferences, rather than just the direction of their preferences. Essentially, voters can elect to pay for additional votes on a proposal to emphasize their position more strongly. The cost of each additional vote grows exponentially: cost to the voter = (number of votes) ^2.


### What type of DAO governance will we have?

Good question! as you can see there are many different types and that list is not exhaustive. Once Round 1 closes we will continue to do research to ensure we choose the best method to suit our community and vision for the game. This will most likely be in consultation with our partners and community.

### Where can I learn more about DAOs?

[Aragon](https://aragon.org/dao), [Consensys](https://consensys.net/blog/blockchain-explained/what-is-a-dao-and-how-do-they-work/) and the [Ethereum Foundation](https://ethereum.org/en/dao/) all have great reasources for doing a deeper dive into DAOs. If you want to dive even deeper and understand some of the benefits a DAO might have over a centralized entity, read this blog post by Vitalik Buterin [here](https://vitalik.ca/general/2022/09/20/daos.html)

## Security and Other General Questions
 
### What happens if this round closes but the next one doesn't?
 
The initial round will give us a little more time to seek grants, partnerships and supporters. Any additional funds raised for Supremacy will be added directly to the DAO Treasury and will be able to be viewed by anyone. In future rounds, any additional contributions over and above the months target amount may be used to close the next round if necessary.
 
### Are we able to audit the contract used for each round?
 
Absolutely, The first contract is viewable **here** All future contract addresses will be posted in advance of the round opening.
 
### How will the treasury be secured?
 
There are many options for this the most commonly being a mult sig wallet. We will update all the final details in this regard before the second round opens or if we recieve additional investment before this time and need it to be set up securely.
 
### Why didn't you let the community  the situation know sooner?
 
We were very certain our investment was going to come through and if this happened before the signed contract expired we would of been able to continue as was. Sometimes these things turn out for the better though.

 
### Is Nexus and Supremacy World still on track for their release dates?
 
Yes, The team is still working hard to make sure these dates do not move. 
 

### What happens to the other XOR if one is bought by pledge?

The Light XORs that are sent to the far reaches of the Sol system, can be governed by the treasury, we already have some great ideas for these and think the community would too so let's put it to vote!`
