<script setup>
import { navigate } from 'astro:transitions/client';
</script>

<template>
  <div class="max-w-screen-lg mx-auto p-5">
    <a href="/test-vocacional/registro" class="flex items-center gap-1 mb-8 ">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-6 fill-neutral-950">
        <path d="M12.707 17.293 8.414 13H18v-2H8.414l4.293-4.293-1.414-1.414L4.586 12l6.707 6.707z"></path>
      </svg>
      <span>Back</span>
    </a>

    <h1 class="text-5xl font-bold from-purple-500 via-pink-600 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent mb-1 pb-2.5">
        Privacy Notice
    </h1>
    <p class="mb-4 text-neutral-600">
      At Prisma, we are committed to protecting your privacy. This Privacy Notice explains how we collect, use, and safeguard your personal information when you use our services.
    </p>
    
    <h2 class="text-2xl font-semibold mt-6 mb-2">Information We Collect</h2>
    <p class="mb-4 text-neutral-600">
      We may collect personal information such as your name, email address, and location when you register for our services. We also collect information about your interactions with our platform to improve our offerings.
    </p>

    <h2 class="text-2xl font-semibold mt-6 mb-2">How We Use Your Information</h2>
    <p class="mb-4 text-neutral-600">
      The information we collect is used to provide you with a personalized experience, improve our services, and communicate with you regarding updates or changes.
    </p>

    <h2 class="text-2xl font-semibold mt-6 mb-2">Data Security</h2>
    <p class="mb-4 text-neutral-600">
      We implement reasonable security measures to protect your personal information from unauthorized access or disclosure. However, no method of transmission over the internet or electronic storage is completely secure.
    </p>

    <h2 class="text-2xl font-semibold mt-6 mb-2">Your Rights</h2>
    <p class="mb-4 text-neutral-600">
      You have the right to access, correct, or delete your personal information. If you wish to exercise these rights, please contact us using the information provided below.
    </p>

    <h2 class="text-2xl font-semibold mt-6 mb-2">Contact Us</h2>
    <p class="mb-4 text-neutral-600">
      If you have any questions or concerns about this Privacy Notice or our data practices, please contact us.
    </p>

    <p class="text-xs mt-4 text-neutral-600">This Privacy Notice may be updated from time to time. We encourage you to review it periodically for any changes.</p>
  </div>
</template>
