export const AllMenus: Menus = [
    {
        title: "Projetos",
        icon: "bx bx-list-ul",
        linkTo: "/projects"
    },
    {
        title: "Aprovação",
        icon: "bx bx-list-check",
        linkTo: "/projects/final-approval"
    },
    {
        title: "Minha Conta",
        icon: "bx bx-cog",
        linkTo: "/my-account"
    },
]

export type Menus = Array<{
    title: string;
    icon: string;
    linkTo: string;
}>