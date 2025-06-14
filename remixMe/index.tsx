/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { MessageEvents } from "@api/index";
import type { MessageExtra, MessageObject, MessageSendListener } from "@api/MessageEvents";
import definePlugin from "@utils/types";

import type { UploadWithRemix } from "./types";


const handleMessage: MessageSendListener = (_: string, __: MessageObject, ex: MessageExtra) =>
    ex.uploads && (ex.uploads as UploadWithRemix[]).forEach(att => att.isRemix = true);

export default definePlugin({
    name: "RemixMe",
    description: "Turns every single message with attachment to have remix tag",
    authors: [{ name: "meowabyte", id: 105170831130234880n }],
    start: () => MessageEvents.addMessagePreSendListener(handleMessage),
    stop: () => MessageEvents.addMessagePreSendListener(handleMessage)
});
