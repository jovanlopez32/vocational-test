<script setup >
import { reactive, ref } from 'vue';
import { navigate } from 'astro:transitions/client';

/* https://github.com/withastro/roadmap/discussions/653 */

/* import { Mistral } from "@mistralai/mistralai";

const mistral = new Mistral({
  apiKey: "tLStop8yeeMECtb0G4Y8tfXXRCjPLvRp",
});

const streamText = ref('');
async function run() {
  const result = await mistral.chat.stream({
    model: "open-mistral-7b",
    messages: [{role: 'user', content: 'What is the best French cheese?'}],
  });

  for await (const chunk of result) {
      streamText.value += chunk.data.choices[0].delta.content;
  }
} */

const formatData = reactive({ fullname: '', city: '', email: '' });

const handleSubmit = (event) => {
  event.preventDefault(); // Prevents the default form behavior.
  localStorage.setItem('userData', JSON.stringify(formatData));
  
  navigate('/test-vocacional/sliders');
};

</script>

<template>
  <!-- <button @click="run()" class="bg-neutral-800/90 py-2 px-4 rounded-lg text-white hover:bg-neutral-900 transition-all duration-500">mistral</button>
  {{ streamText }} -->
  <div class="max-w-screen-lg mx-auto p-5">
    <a href="/" class="flex items-center gap-1 mb-8 ">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-6 fill-neutral-950">
        <path d="M12.707 17.293 8.414 13H18v-2H8.414l4.293-4.293-1.414-1.414L4.586 12l6.707 6.707z"></path>
      </svg>
      <span>Back</span>
    </a>
    
    <div>
      <h1 class="text-5xl font-bold from-purple-500 via-pink-600 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent mb-1 pb-2.5">
        It's your moment to <span>shine!</span>
      </h1>
      <h2 class="text-lg mb-5">
        <span class="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 bg-[length:100%_2px] bg-no-repeat bg-[bottom]">Every person</span>,
        like a prism, <span class="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 bg-[length:100%_2px] bg-no-repeat bg-[bottom]">has multiple facets and colors to discover.</span>
      </h2>
      <p class="text-neutral-600">To help you explore the path that best reflects your essence, we need some basic details about you.</p>
    </div>
    
    <div class="mt-5 mb-10">
      <form @submit="handleSubmit" class="w-full max-w-screen-md grid gap-4" data-astro-reload>
        <div class="grid gap-2">
          <label class="font-semibold text-lg" for="fullname">Full Name</label>
          <input v-model="formatData.fullname" type="text" placeholder="John Bradley" required class="px-4 py-1 border-2 border-neutral-700 rounded-lg bg-transparent">
        </div>
        <div class="grid gap-2">
          <label class="font-semibold text-lg" for="city">State of the Republic</label>
          <input v-model="formatData.city" type="text" placeholder="San Luis Potosi" required class="px-4 py-1 border-2 border-neutral-700 rounded-lg bg-transparent">
        </div>
        <div class="grid gap-2">
          <label class="font-semibold text-lg" for="email">Email Address</label>
          <input v-model="formatData.email" type="text" placeholder="john.bradley@prisma.com" required class="px-4 py-1 border-2 border-neutral-700 rounded-lg bg-transparent">
        </div>
        <button class="relative p-[3px] inline-flex items-center justify-center font-bold overflow-hidden group rounded-full">
          <span class="w-full h-full bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 group-hover:from-rose-400 group-hover:via-fuchsia-500 group-hover:to-indigo-500 absolute"></span>
          <span class="relative px-10 py-3 transition-all ease-out bg-neutral-950 rounded-full group-hover:bg-opacity-0 duration-300 w-full">
            <span class="relative text-white">Continue</span>
          </span>
        </button>

      </form>
    </div>

    {{ formatData }}

    <div>
      <h3 class="mb-3 text-xl font-semibold">Why are we asking for this?</h3>
      <p class="text-neutral-600">We want to better understand what careers and talents are sought in every corner of the country, so we can help others like you find their vocation. Your information is part of something bigger!</p>
      <p class="text-xs mt-4 text-neutral-600">Your privacy is important to us.</p>
      <p class="text-xs mt-1 text-neutral-600">
        Your data will be protected and never shared with third parties. If you want to know more about how we protect it, you can read our
        <a class="underline text-rose-600" href="/test-vocacional/privacy">privacy notice</a>.
      </p>
    </div>
  </div>
</template>