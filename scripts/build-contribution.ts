import * as path from "path";
import * as fs from "fs";

import { CommandProviders } from "../src/datagen/commands";
import { TreeViewProviders } from "../src/datagen/treeViews";
import { WebviewViewProviders } from "../src/datagen/webviewViews";

const contributes = {
    commands: CommandProviders.REGISTRY.getAllValues().map((ref) => {
        return {
            command: ref.id,
            ...ref.value,
        };
    }),
    menus: {
        "view/title": [
            {
                command: CommandProviders.REFRESH.id,
                when: `view == ${TreeViewProviders.INPUTS.id}`,
                group: "navigation",
            },
            {
                command: CommandProviders.ADD_FILE.id,
                when: `view == ${TreeViewProviders.INPUTS.id}`,
                group: "navigation",
            },
        ],
        "view/item/context": [
            {
                command: CommandProviders.DELETE_ITEM.id,
                when: `view == ${TreeViewProviders.INPUTS.id} && (viewItem == file || viewItem == input)`,
                group: "modification",
            },
            {
                command: CommandProviders.ADD_INPUT.id,
                when: `view == ${TreeViewProviders.INPUTS.id} && viewItem == file`,
                group: "inline",
            },
            {
                command: CommandProviders.RENAME_INPUT.id,
                when: `view == ${TreeViewProviders.INPUTS.id} && viewItem == input`,
                group: "modification",
            },
            {
                command: CommandProviders.EDIT_INPUT.id,
                when: `view == ${TreeViewProviders.INPUTS.id} && viewItem == input`,
                group: "modification",
            },
        ],
    },
    viewsContainers: {
        activitybar: [
            {
                id: "visual-runner",
                title: "Visual Runner",
                icon: "$(play)",
            },
        ],
        panel: [
            {
                id: "visual-console",
                title: "Visual Console",
                icon: "$(terminal)",
            },
        ],
    },
    views: {
        "visual-runner": TreeViewProviders.REGISTRY.getAllValues().map(
            (ref) => {
                return {
                    id: ref.id,
                    ...ref.value,
                };
            }
        ),
        "visual-console": WebviewViewProviders.REGISTRY.getAllValues().map(
            (ref) => {
                return {
                    id: ref.id,
                    ...ref.value,
                };
            }
        ),
    },
};

function main() {
    const projectRoot = process.cwd();
    const packageJsonPath = path.join(projectRoot, "package.json");
    console.log(`Updating package.json at: ${packageJsonPath}`);
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    packageJson.contributes = contributes;

    fs.writeFileSync(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2),
        "utf-8"
    );
    console.log("Updated package.json contributes section.");
}

main();
