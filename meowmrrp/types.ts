/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export type EmojiNode = { animated: false, emojiId: string, jumboable: boolean, name: `:${string}:`, type: "customEmoji"; };
export type ChatEmojiProps = { node: EmojiNode, isInteracting: boolean, tooltipPosition?: string, enableClick?: boolean, channelId: string, messageId: string; };
