"use server";

import logosList from "@/lib/image-assets/clubs-list.json"

export async function getTeamLogos() {
    return { success: true, files: logosList };
}
