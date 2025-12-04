"use server";

import flagsList from '@/lib/image-assets/flags-list.json'

export async function getFlags() {
  return { success: true, files: flagsList };
}
