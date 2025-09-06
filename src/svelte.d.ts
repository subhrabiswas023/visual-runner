declare module "*.svelte" {
    import type { ComponentType } from "svelte";
    export default function (props: any): ComponentType;
}