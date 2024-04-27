export const AllMenus: Menus = [
    {
        title: "Projetos",
        icon: "bx-list-ul",
        linkTo: "/projects"
    },
    {
        title: "Minha Conta",
        icon: "bx-cog",
        linkTo: "/my-account"
    },
]

export type Menus = Array<{
    title: string;
    icon: string;
    linkTo: string;
}>