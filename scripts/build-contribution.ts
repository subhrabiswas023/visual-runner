import * as path from "path";
import * as fs from "fs";

import { CommandProviders } from "../src/datagen/commands";
import { WebviewViewProviders } from "../src/datagen/webviewViews";

const contributes = {
    commands: CommandProviders.REGISTRY.getAllValues().map((ref) => {
        return {
            command: ref.id,
            ...ref.value,
        };
    }),
    viewsContainers: {
        panel: [
            {
                id: "visual-console",
                title: "Visual Console",
                icon: "$(terminal)",
            },
        ],
    },
    views: {
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
