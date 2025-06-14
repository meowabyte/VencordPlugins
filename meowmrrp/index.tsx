/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { ErrorBoundary } from "@components/index";
import { getCurrentChannel, sendMessage } from "@utils/discord";
import { classes } from "@utils/misc";
import definePlugin, { OptionType } from "@utils/types";
import { findComponentByCodeLazy } from "@webpack";
import { Card, MessageStore, UserStore } from "@webpack/common";

import type { ChatEmojiProps, EmojiNode } from "./types";


let interv: number | null = null;

const DEFAULT_RANDOM_PHRASES = ["meow", "mrrp", "mrrow", "mrow", "mrrrrp", "mewo"];
const ALLOWED_DELAYS = [5, 10, 20, 30, 40, 50, 60];

const ChatEmoji = findComponentByCodeLazy<ChatEmojiProps>("emojiId:", "emojiName:", "animated:", "isInteracting:");

const blobcatcozyNode: EmojiNode = {
    emojiId: "1026533070955872337",
    name: ":blobcatcozy:",
    animated: false,
    type: "customEmoji",
    jumboable: false
};


const settings = definePluginSettings({
    notif1: {
        type: OptionType.COMPONENT,
        component: () => <Card className={classes("vc-settings-card", "vc-backup-restore-card")}>
            <span>
                This plugin triggers <b>ONLY</b> when no messages were sent in past <code>delay * 2</code> and if last message was not from a plugin to prevent spam!
                I don't care if you like it or not, I don't want to be hated for making spam plugin. <ErrorBoundary noop><ChatEmoji node={blobcatcozyNode} isInteracting={false} channelId={""} messageId={""} /></ErrorBoundary>
            </span>
        </Card>
    },
    delay: {
        type: OptionType.SLIDER,
        default: 10,
        description: "Delay (in minutes) how often you will meow on current channel.",
        restartNeeded: true,
        markers: ALLOWED_DELAYS
    },
    phrases: {
        type: OptionType.STRING,
        description: "Phrases to use. (separated by colon)",
        default: DEFAULT_RANDOM_PHRASES.join(", "),
    }
});

type Message = { id: string, timestamp: Date, author: { id: string; }, content?: string; };

export default definePlugin({
    name: "meowmrrp",
    description: "Randomly meow or mrrp on the chat. (with sensible delay)",
    authors: [{ id: 105170831130234880n, name: "kb" }],
    settings,

    getPhrases() {
        const phrases = this.settings.store.phrases.split(",");

        if (phrases.length === 0) return DEFAULT_RANDOM_PHRASES;
        return phrases;
    },

    get delay(): number { return this.settings.store.delay; },

    getRandomPhrase() {
        const phrases = this.getPhrases();
        return phrases[Math.floor(Math.random() * phrases.length)];
    },

    sendMeow() {
        const ch = getCurrentChannel();
        if (!ch) return;

        const { id } = ch;
        const lastMsg: Message | undefined = MessageStore.getMessages(id).last();

        if (
            lastMsg
            && (
                ( // author is user & includes phrase
                    lastMsg.author.id === UserStore.getCurrentUser().id
                    && lastMsg.content
                    && this.getPhrases().includes(lastMsg.content)
                )
                // last message was delay*2 ago
                || (Date.now() - lastMsg.timestamp.getTime()) < (this.delay * 60_000) * 2
            )
        ) return;

        sendMessage(ch.id, {
            content: this.getRandomPhrase()
        });
    },

    start() {
        if (this.delay < Math.min(...ALLOWED_DELAYS)) return; // Pls no silly, don't get muted qwq

        interv = setInterval(this.sendMeow.bind(this), this.delay * 60_000) as any;
    },

    stop() {
        if (interv) {
            clearInterval(interv);
            interv = null;
        }
    },
});
