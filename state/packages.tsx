export interface IPackage {
    name: string
    badge?: string
    badgeColor?: string
    description: string
    minAmount: number
    contains?: string[]
    imgURL: string
}

export const packages: IPackage[] = [
    {
        name: "Skin: Project Salvation",
        badgeColor: "pink",
        minAmount: 100,
        description: "Salvation skin",
        imgURL: "/packages/mech1.png",
        contains: ["Salvation Skin for Genesis and Nexus mechs"],
    },
    {
        name: "Mech:: Small Salvation Humanoid",
        badgeColor: "pink",
        minAmount: 250,
        description: "Codename: SmallSalvo. Fast, nimble and can pack a punch.",
        imgURL: "/packages/mech1.png",
        contains: ["SM Salvation mech"],
    },
    {
        name: "Salvation Mech Pack",
        badgeColor: "pink",
        minAmount: 500,
        description: "Small and medium humanoid mech",
        imgURL: "/packages/mech2.png",
        contains: ["SM Salvation mech"],
    },
    {
        name: "Salvation Mech Pack",
        badgeColor: "pink",
        minAmount: 1000,
        description: "Small, medium and large humanoid mechs",
        imgURL: "/packages/mech3.png",
        contains: ["SM Salvation mech"],
    },
    {
        name: "Platform Pack",
        badgeColor: "pink",
        minAmount: 2500,
        description: "Platform Salvation mech",
        imgURL: "/packages/mech4.png",
        contains: ["Salvation platform mech"],
    },
    {
        name: "All Salvation mechs",
        badgeColor: "pink",
        minAmount: 5000,
        description: "All humanoid mechs and a platform mech",
        imgURL: "/packages/allmechs.png",
        contains: ["small Salvation mech"],
    },
    {
        name: "XOR's Salvation",
        badgeColor: "red",
        minAmount: 20000,
        description: "XOR salvation",
        imgURL: "/packages/xor.png",
        contains: ["XOR - light", "XOR - dark"],
    },
    {
        name: "XOR and all",
        badgeColor: "red",
        minAmount: 24000,
        description: "XOR salvation",
        imgURL: "/packages/xor.png",
        contains: ["XOR - light", "XOR - dark", "All Salvation mechs", "2x Salvation Skin"],
    },
]
