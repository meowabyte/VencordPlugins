/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Logger } from "@utils/Logger";
import type { Plugin } from "@utils/types";

import Plugins, { PluginMeta } from "~plugins";

const LOADER_ID = Symbol("meowabyte plugins");

const PLUGINS: Plugin[] = [
    require("./plugins/meowmrrp").default,
    require("./plugins/remixMe").default
];

/** @see https://github.com/Kyuuhachi/VencordPlugins/blob/main/index.ts */
const addPlugins = async () => {
    const { folderName, userPlugin } = PluginMeta[LOADER_ID as any];

    for (const p of PLUGINS.filter(p => p)) {
        Plugins[p.name] = p;
        PluginMeta[p.name] = {
            userPlugin, folderName: `${folderName}/${p.name}`
        };
    }

    delete Plugins[LOADER_ID as any];
    delete PluginMeta[LOADER_ID as any];

    new Logger("meowabyte plugins", "#dc7474").info(`${PLUGINS.length} plugins loaded!`);
};


Set = new Proxy(Set, {
    construct(t, args) {
        if (Plugins && Plugins[LOADER_ID as any]) {
            Set = t;
            addPlugins();
        }

        return Reflect.construct(t, args);
    }
});

export default { name: LOADER_ID };
