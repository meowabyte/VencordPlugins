/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import {
    addMessagePreSendListener,
    MessageSendListener,
    removeMessagePreSendListener,
} from "@api/MessageEvents";
import definePlugin from "@utils/types";

// @ts-expect-error isRemix isnt on the upload[] type yet
const handleMessage: MessageSendListener = (_, __, ex) =>
    ex.uploads && ex.uploads.forEach((att) => (att.isRemix = true));

export default definePlugin({
    name: "RemixMe",
    description: "Turns every single message with attachment to have remix tag",
    authors: [{ id: 105170831130234880n, name: "kb" }],
    start() {
        addMessagePreSendListener(handleMessage);
    },
    stop() {
        removeMessagePreSendListener(handleMessage);
    },
});
